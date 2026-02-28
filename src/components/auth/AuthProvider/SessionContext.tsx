'use client'

import { createContext } from 'react'
import type { User } from 'next-auth'
import type { Dispatch, SetStateAction } from 'react'

export type AppSession = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user?: User & Record<string, any>
    expires: string
    config?: Record<string, string>
    accessToken?: string
    refreshToken?: string
    tokenType?: string
    expiresIn?: number
    accessTokenExpiresAt?: number
    error?: string
}

export type SessionContextValue = {
    session: AppSession | null
    setSession: Dispatch<SetStateAction<AppSession | null>>
}

const SessionContext = createContext<SessionContextValue>({
    session: {
        expires: '',
        config: {},
    },
    setSession: () => {},
})

export default SessionContext
