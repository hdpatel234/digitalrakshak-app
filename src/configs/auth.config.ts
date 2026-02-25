import type { NextAuthConfig } from 'next-auth'
import { CredentialsSignin } from 'next-auth'
import { validateCredentialWithResponse } from '../server/actions/user/validateCredential'
import Credentials from 'next-auth/providers/credentials'
import Github from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'

import type { SignInCredential } from '@/@types/auth'

class BackendCredentialsSignin extends CredentialsSignin {
    constructor(message: string) {
        super(message)
        this.code = message
    }
}

type RefreshTokenResponse = {
    status?: boolean
    success?: boolean
    message?: string
    data?: {
        token_type?: string
        expires_in?: number | string
        access_token?: string
        refresh_token?: string
    } | null
    errors?: Record<string, string[]>
}

const getApiBaseUrl = () =>
    (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || '').replace(
        /\/+$/,
        '',
    )

const refreshTokenEndpoints = [
    '/auth/refresh-token',
]

const refreshAccessToken = async (token: Record<string, unknown>) => {
    const refreshToken = (token.refreshToken as string) || ''
    const apiBaseUrl = getApiBaseUrl()

    if (!refreshToken || !apiBaseUrl) {
        return {
            ...token,
            error: 'RefreshAccessTokenError',
            accessToken: '',
            refreshToken: '',
            expiresIn: 0,
            accessTokenExpiresAt: 0,
        }
    }

    try {
        for (const endpoint of refreshTokenEndpoints) {
            const response = await fetch(`${apiBaseUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    refresh_token: refreshToken,
                }),
                cache: 'no-store',
            })

            const payload = (await response.json()) as RefreshTokenResponse
            const data = payload?.data
            const expiresIn = Number(data?.expires_in || 0)
            const isSuccess =
                response.ok &&
                (payload?.status === true || payload?.success === true) &&
                !!data?.access_token &&
                Number.isFinite(expiresIn) &&
                expiresIn > 0

            if (!isSuccess || !data) {
                continue
            }

            const accessTokenExpiresAt = Date.now() + expiresIn * 1000

            return {
                ...token,
                error: undefined,
                accessToken: data.access_token || '',
                refreshToken: data.refresh_token || refreshToken,
                tokenType: data.token_type || 'Bearer',
                expiresIn,
                accessTokenExpiresAt,
            }
        }

        return {
            ...token,
            error: 'RefreshAccessTokenError',
            accessToken: '',
            refreshToken: '',
            expiresIn: 0,
            accessTokenExpiresAt: 0,
        }
    } catch {
        return {
            ...token,
            error: 'RefreshAccessTokenError',
            accessToken: '',
            refreshToken: '',
            expiresIn: 0,
            accessTokenExpiresAt: 0,
        }
    }
}

export default {
    providers: [
        Github({
            clientId: process.env.GITHUB_AUTH_CLIENT_ID,
            clientSecret: process.env.GITHUB_AUTH_CLIENT_SECRET,
        }),
        Google({
            clientId: process.env.GOOGLE_AUTH_CLIENT_ID,
            clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
        }),
        Credentials({
            async authorize(credentials) {
                /** validate credentials from backend here */
                const result = await validateCredentialWithResponse(
                    credentials as SignInCredential,
                )
                if (!result.user) {
                    throw new BackendCredentialsSignin(result.message)
                }

                return {
                    id: result.user.id,
                    name: result.user.userName,
                    email: result.user.email,
                    image: result.user.avatar,
                    authority: result.user.authority,
                    accessToken: result.user.accessToken,
                    refreshToken: result.user.refreshToken,
                    tokenType: result.user.tokenType,
                    expiresIn: result.user.expiresIn,
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                const authUser = user as {
                    authority?: string[]
                    accessToken?: string
                    refreshToken?: string
                    tokenType?: string
                    expiresIn?: number | string
                }
                const expiresIn = Number(authUser.expiresIn || 0)

                token.authority = authUser.authority || ['user']
                token.accessToken = authUser.accessToken || ''
                token.refreshToken = authUser.refreshToken || ''
                token.tokenType = authUser.tokenType || 'Bearer'
                token.expiresIn = expiresIn
                token.accessTokenExpiresAt = Date.now() + expiresIn * 1000
                token.error = undefined

                return token
            }

            const accessTokenExpiresAt = Number(token.accessTokenExpiresAt || 0)
            const now = Date.now()
            const refreshThresholdMs = 60 * 1000

            if (accessTokenExpiresAt > now + refreshThresholdMs) {
                return token
            }

            return refreshAccessToken(token as Record<string, unknown>)
        },
        async session(payload) {
            const accessTokenExpiresAt =
                (payload.token.accessTokenExpiresAt as number) || 0
            const isTokenExpired =
                accessTokenExpiresAt > 0 && Date.now() >= accessTokenExpiresAt

            /** apply extra user attributes here, for example, we add 'authority' & 'id' in this section */
            return {
                ...payload.session,
                user: {
                    ...payload.session.user,
                    id: payload.token.sub,
                    authority: (payload.token.authority as string[]) || ['user'],
                },
                accessToken: isTokenExpired
                    ? ''
                    : ((payload.token.accessToken as string) || ''),
                refreshToken: isTokenExpired
                    ? ''
                    : ((payload.token.refreshToken as string) || ''),
                tokenType: (payload.token.tokenType as string) || 'Bearer',
                expiresIn: isTokenExpired
                    ? 0
                    : ((payload.token.expiresIn as number) || 0),
                accessTokenExpiresAt,
                error: payload.token.error,
            }
        },
    },
} satisfies NextAuthConfig
