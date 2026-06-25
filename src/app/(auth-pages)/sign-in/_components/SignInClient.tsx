'use client'

import { useEffect } from 'react'
import SignIn from '@/components/auth/SignIn'
import { onSignInWithCredentials } from '@/server/actions/auth/handleSignIn'
import handleOauthSignIn from '@/server/actions/auth/handleOauthSignIn'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { useSearchParams, useRouter } from 'next/navigation'
import type {
    OnSignInPayload,
    OnOauthSignInPayload,
} from '@/components/auth/SignIn'
import type { SignInCredential } from '@/@types/auth'

const getBrowserName = (userAgent: string) => {
    if (/Edg\//i.test(userAgent)) return 'Edge'
    if (/OPR\//i.test(userAgent)) return 'Opera'
    if (/Chrome\//i.test(userAgent)) return 'Chrome'
    if (/Safari\//i.test(userAgent)) return 'Safari'
    if (/Firefox\//i.test(userAgent)) return 'Firefox'
    if (/MSIE|Trident/i.test(userAgent)) return 'Internet Explorer'
    return 'Unknown'
}

const getOsName = (userAgent: string) => {
    if (/Windows NT/i.test(userAgent)) return 'Windows'
    if (/Android/i.test(userAgent)) return 'Android'
    if (/iPhone|iPad|iPod/i.test(userAgent)) return 'iOS'
    if (/Mac OS X/i.test(userAgent)) return 'macOS'
    if (/Linux/i.test(userAgent)) return 'Linux'
    return 'Unknown'
}

const getDeviceType = (userAgent: string) => {
    if (/iPad|Tablet|PlayBook|Silk/i.test(userAgent)) return 'Tablet'
    if (/Mobi|Android|iPhone|iPod/i.test(userAgent)) return 'Mobile'
    return 'Desktop'
}

const getClientIp = async () => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 2500)

    try {
        const response = await fetch('https://api.ipify.org?format=json', {
            method: 'GET',
            signal: controller.signal,
            cache: 'no-store',
        })

        if (!response.ok) {
            return ''
        }

        const data = (await response.json()) as { ip?: string }
        return data?.ip || ''
    } catch {
        return ''
    } finally {
        clearTimeout(timeout)
    }
}

const SignInClient = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const callbackUrl = searchParams.get(REDIRECT_URL_KEY)

    const handleSignIn = async ({
        values,
        setSubmitting,
        setMessage,
    }: OnSignInPayload) => {
        setSubmitting(true)

        const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : ''
        const payload: SignInCredential = {
            ...values,
            ip: await getClientIp(),
            browser: getBrowserName(userAgent),
            device: getDeviceType(userAgent),
            os: getOsName(userAgent),
        }

        onSignInWithCredentials(payload, callbackUrl || '').then((data) => {
            if (data?.error) {
                setMessage(data.error as string)
                setSubmitting(false)
            }
        })
    }

    const handleOAuthSignIn = async ({ type, setSubmitting }: OnOauthSignInPayload) => {
        if (type === 'google') {
            await handleOauthSignIn('google')
        }
        if (type === 'digilocker') {
            if (setSubmitting) {
                setSubmitting(true)
            }
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
            
            try {
                const response = await fetch(`${apiUrl}/auth/social-login/digilocker`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                })

                const result = await response.json()

                if (result.status && result.data?.url) {
                    window.location.href = result.data.url
                } else {
                    console.error('Digilocker login failed:', result.message || result)
                    if (setSubmitting) setSubmitting(false)
                }
            } catch (error) {
                console.error('Error initiating Digilocker login:', error)
                if (setSubmitting) setSubmitting(false)
            }
        }
    }

    useEffect(() => {
        let code = searchParams.get('code')
        let state = searchParams.get('state')

        // Extract from nested redirectUrl if present
        if (!code && callbackUrl && callbackUrl.includes('code=')) {
            const codeMatch = callbackUrl.match(/[?&]code=([^&]+)/)
            const stateMatch = callbackUrl.match(/[?&]state=([^&]+)/)
            
            if (codeMatch) code = codeMatch[1]
            if (stateMatch) state = stateMatch[1]
        }

        if (code && state) {
            const handleDigilockerCallback = async () => {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
                try {
                    const response = await fetch(`${apiUrl}/auth/social-login/digilocker/callback`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ code, state })
                    })
                    const result = await response.json()
                    
                    if (result.status && result.data?.access_token) {
                        const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : ''
                        const ip = await getClientIp()
                        
                        onSignInWithCredentials({
                            token: result.data.access_token,
                            isSso: true,
                            ip,
                            browser: getBrowserName(userAgent),
                            device: getDeviceType(userAgent),
                            os: getOsName(userAgent)
                        } as SignInCredential, callbackUrl || '').then((data) => {
                            if (data?.error) {
                                router.replace(`/sign-in?error=${encodeURIComponent(data.error as string)}`)
                            }
                        })
                    } else {
                        router.replace(`/sign-in?error=${encodeURIComponent(result.message || 'DigiLocker login failed')}`)
                    }
                } catch (error) {
                    console.error('Error handling Digilocker callback:', error)
                    router.replace(`/sign-in?error=${encodeURIComponent('Something went wrong during DigiLocker login')}`)
                }
            }
            handleDigilockerCallback()
        } else {
            const token = searchParams.get('token')
            if (token) {
                const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : ''
                getClientIp().then(ip => {
                    onSignInWithCredentials({
                        token,
                        isSso: true,
                        ip,
                        browser: getBrowserName(userAgent),
                        device: getDeviceType(userAgent),
                        os: getOsName(userAgent)
                    } as SignInCredential, callbackUrl || '').then((data) => {
                        if (data?.error) {
                            router.replace(`/sign-in?error=${encodeURIComponent(data.error as string)}`)
                        }
                    })
                })
            }
        }
    }, [searchParams, callbackUrl, router])

    return <SignIn onSignIn={handleSignIn} onOauthSignIn={handleOAuthSignIn} />
}

export default SignInClient
