'use client'

import SignIn from '@/components/auth/SignIn'
import { onSignInWithCredentials } from '@/server/actions/auth/handleSignIn'
import handleOauthSignIn from '@/server/actions/auth/handleOauthSignIn'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { useSearchParams } from 'next/navigation'
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

    const handleOAuthSignIn = async ({ type }: OnOauthSignInPayload) => {
        if (type === 'google') {
            await handleOauthSignIn('google')
        }
    }

    return <SignIn onSignIn={handleSignIn} onOauthSignIn={handleOAuthSignIn} />
}

export default SignInClient
