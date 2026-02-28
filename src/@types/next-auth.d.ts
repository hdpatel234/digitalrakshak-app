import type { DefaultSession } from 'next-auth'
import type { JWT as DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
    interface Session {
        user: DefaultSession['user'] & {
            id?: string
            authority?: string[]
            roles?: string[]
            permissions?: string[]
        }
        config?: Record<string, string>
        accessToken?: string
        refreshToken?: string
        tokenType?: string
        expiresIn?: number
        accessTokenExpiresAt?: number
        error?: string
    }

    interface User {
        authority?: string[]
        roles?: string[]
        permissions?: string[]
        config?: Record<string, string>
        accessToken?: string
        refreshToken?: string
        tokenType?: string
        expiresIn?: number
    }
}

declare module 'next-auth/jwt' {
    interface JWT extends DefaultJWT {
        authority?: string[]
        roles?: string[]
        permissions?: string[]
        config?: Record<string, string>
        accessToken?: string
        refreshToken?: string
        tokenType?: string
        expiresIn?: number
        accessTokenExpiresAt?: number
        error?: string
    }
}
