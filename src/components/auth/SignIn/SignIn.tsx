'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Logo from '@/components/template/Logo'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import SignInForm from './SignInForm'
import OauthSignIn from './OauthSignIn'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import useTheme from '@/utils/hooks/useTheme'
import type { OnSignIn } from './SignInForm'
import type { OnOauthSignIn } from './OauthSignIn'

type SignInProps = {
    signUpUrl?: string
    forgetPasswordUrl?: string
    onSignIn?: OnSignIn
    onOauthSignIn?: OnOauthSignIn
}

const DigiLockerIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        className={className}
        fill="none"
    >
        <path
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.5,31.1893V41.5a2,2,0,0,0,2,2h27a2,2,0,0,0,2-2v-26h-9a2,2,0,0,1-2-2v-9h-18a2,2,0,0,0-2,2V20.6349"
        />
        <line
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            x1="28.5"
            y1="4.5"
            x2="39.5"
            y2="15.5"
        />
        <path
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M25.3968,21.9252c-.0424,0-.0834.0053-.1255.0063a7.218,7.218,0,0,0-13.4879-2.1668c-.0435-.001-.0857-.0066-.1294-.0066a6.154,6.154,0,0,0,0,12.308H25.3968a5.07,5.07,0,1,0,0-10.1409Z"
        />
        <circle cx="18.7" cy="26" r="1.2" fill="#0B3C5D" />
        <polygon points="18,27 19.4,27 20,30 17.4,30" fill="#0B3C5D" />
    </svg>
)

const SignIn = ({
    forgetPasswordUrl = '/forgot-password',
    onSignIn,
    onOauthSignIn,
}: SignInProps) => {
    const [message, setMessage] = useTimeOutMessage()
    const [digilockerMessage, setDigilockerMessage] = useTimeOutMessage()
    const [showCredentials, setShowCredentials] = useState(false)
    const [isDigilockerLoading, setIsDigilockerLoading] = useState(false)
    const searchParams = useSearchParams()

    const mode = useTheme((state) => state.mode)

    useEffect(() => {
        const error = searchParams.get('error')
        const code = searchParams.get('code')
        const state = searchParams.get('state')
        
        if (error) {
            setDigilockerMessage(error)
            setIsDigilockerLoading(false)
        } else if (code && state) {
            setIsDigilockerLoading(true)
        }
    }, [searchParams, setDigilockerMessage])

    const handleDigiLockerSignIn = () => {
        onOauthSignIn?.({ 
            type: 'digilocker', 
            setMessage: setDigilockerMessage,
            setSubmitting: setIsDigilockerLoading
        })
    }

    return (
        <>
            <div className="mb-8 flex justify-center">
                <Logo
                    type="streamline"
                    mode={mode}
                    logoWidth={60}
                    logoHeight={60}
                />
            </div>
            <div className="mb-8 text-center">
                <h2 className="mb-2 text-2xl font-bold">Welcome Back!</h2>
                <p className="font-semibold text-gray-500 dark:text-gray-400">
                    Continue using your DigiLocker - MeriPehchaan credentials
                </p>
            </div>
            {digilockerMessage && (
                <Alert showIcon className="mb-4" type="danger">
                    <span className="break-all">{digilockerMessage}</span>
                </Alert>
            )}
            <div className="mb-6">
                <Button
                    block
                    className="bg-[#0B3C5D] hover:bg-[#07263b] text-white border-none py-3.5 h-auto flex items-center justify-center font-semibold rounded-lg shadow-sm transition-all duration-200"
                    type="button"
                    onClick={handleDigiLockerSignIn}
                    disabled={isDigilockerLoading}
                >
                    {isDigilockerLoading ? (
                        <div className="flex items-center justify-center h-6">
                            <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center gap-2">
                            <span>Continue with</span>
                            <DigiLockerIcon className="h-6 w-6 text-white inline-block" />
                            <span className="font-bold">DigiLocker</span>
                        </div>
                    )}
                </Button>
            </div>
            <div className="flex items-center gap-4 my-6">
                <div className="border-t border-gray-200 dark:border-gray-800 flex-1" />
                <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 tracking-wider uppercase">
                    OR
                </span>
                <div className="border-t border-gray-200 dark:border-gray-800 flex-1" />
            </div>
            <div className="mb-6 text-center">
                <button
                    type="button"
                    onClick={() => setShowCredentials(!showCredentials)}
                    className="text-base font-semibold text-gray-800 dark:text-gray-200 hover:text-[#0B3C5D] dark:hover:text-[#42a2e0] focus:outline-none transition-all flex items-center justify-center gap-1 mx-auto"
                >
                    <span>Login through username and password</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className={`w-5 h-5 transition-transform duration-200 ${showCredentials ? 'rotate-180' : ''}`}
                    >
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
            {showCredentials && (
                <div className="transition-all duration-300 ease-in-out">
                    {message && (
                        <Alert showIcon className="mb-4" type="danger">
                            <span className="break-all">{message}</span>
                        </Alert>
                    )}
                    <SignInForm
                        setMessage={setMessage}
                        passwordHint={
                            <div className="mb-7 mt-2">
                                <ActionLink
                                    href={forgetPasswordUrl}
                                    className="font-semibold heading-text mt-2 underline"
                                    themeColor={false}
                                >
                                    Forgot password
                                </ActionLink>
                            </div>
                        }
                        onSignIn={onSignIn}
                    />
                </div>
            )}
            {/* <div className="mt-8">
                <div className="flex items-center gap-2 mb-6">
                    <div className="border-t border-gray-200 dark:border-gray-800 flex-1 mt-[1px]" />
                    <p className="font-semibold heading-text">
                        or continue with
                    </p>
                    <div className="border-t border-gray-200 dark:border-gray-800 flex-1 mt-[1px]" />
                </div>
                <OauthSignIn
                    setMessage={setMessage}
                    onOauthSignIn={onOauthSignIn}
                />
            </div> */}
        </>
    )
}

export default SignIn
