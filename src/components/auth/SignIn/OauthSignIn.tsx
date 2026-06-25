'use client'

import Button from '@/components/ui/Button'

type OauthSignInType = 'google' | 'digilocker'

export type OnOauthSignInPayload = {
    type: OauthSignInType
    setMessage?: (message: string) => void
    setSubmitting?: (isSubmitting: boolean) => void
}

export type OnOauthSignIn = (payload: OnOauthSignInPayload) => void

type OauthSignInProps = {
    setMessage?: (message: string) => void
    onOauthSignIn?: OnOauthSignIn
}

const OauthSignIn = ({ onOauthSignIn, setMessage }: OauthSignInProps) => {
    const handleGoogleSignIn = async () => {
        onOauthSignIn?.({ type: 'google', setMessage })
    }

    const handleDigilockerSignIn = () => {
        onOauthSignIn?.({ type: 'digilocker', setMessage })
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <Button
                    className="flex-1"
                    type="button"
                    onClick={handleGoogleSignIn}
                >
                    <div className="flex items-center justify-center gap-2">
                        <img
                            className="h-[25px] w-[25px]"
                            src="/img/others/google.png"
                            alt="Google sign in"
                        />
                        <span>Google</span>
                    </div>
                </Button>
            </div>
            <div className="flex items-center gap-2">
                <Button
                    className="flex-1"
                    type="button"
                    onClick={handleDigilockerSignIn}
                >
                    <div className="flex items-center justify-center gap-2">
                        <span>Login with DigiLocker</span>
                    </div>
                </Button>
            </div>
        </div>
    )
}

export default OauthSignIn
