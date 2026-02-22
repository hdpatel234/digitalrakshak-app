'use server'

import { signIn } from '@/auth'
import appConfig from '@/configs/app.config'
import { AuthError } from 'next-auth'
import type { SignInCredential } from '@/@types/auth'

const stripAuthReadMore = (message: string) =>
    message.replace(/\.\s*Read more at\s+https?:\/\/\S+$/i, '').trim()

export const onSignInWithCredentials = async (
    { email, password }: SignInCredential,
    callbackUrl?: string,
) => {
    try {
        await signIn('credentials', {
            email,
            password,
            redirectTo: callbackUrl || appConfig.authenticatedEntryPath,
        })
    } catch (error) {
        console.error('Sign-in error:', error)
        if (error instanceof AuthError) {
            /** Customize error message based on AuthError */
            switch (error.type) {
                case 'CredentialsSignin': {
                    const credentialsError = error as AuthError & {
                        code?: string
                    }
                    const backendMessage =
                        credentialsError.code &&
                        credentialsError.code !== 'credentials'
                            ? credentialsError.code
                            : stripAuthReadMore(error.message)
                    return {
                        error: backendMessage || 'Invalid credentials',
                    }
                }
                default:
                    return {
                        error:
                            stripAuthReadMore(error.message) ||
                            'Something went wrong!',
                    }
            }
        }
        throw error
    }
}
