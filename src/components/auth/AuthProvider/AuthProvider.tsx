'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
    SessionProvider as NextAuthSessionProvider,
    signOut,
    useSession,
} from 'next-auth/react'
import SessionContext from './SessionContext'
import type { Session as NextAuthSession } from 'next-auth'
import type { AppSession } from './SessionContext'
import type { Dispatch, ReactNode, SetStateAction } from 'react'
import appConfig from '@/configs/app.config'
import apiClient from '@/services/axios/ApiClient'
import { callInternalLogout } from '@/services/auth/logout'

type Session = NextAuthSession | null

type AuthProviderProps = {
    session: Session | null
    children: ReactNode
}

const SessionSync = ({
    onSessionChange,
}: {
    onSessionChange: (session: Session) => void
}) => {
    const { data: liveSession } = useSession()
    const didHandleSessionError = useRef(false)

    useEffect(() => {
        onSessionChange(liveSession || null)
    }, [liveSession, onSessionChange])

    useEffect(() => {
        const appSession = liveSession as AppSession | null
        const accessToken = appSession?.accessToken

        if (accessToken) {
            apiClient.setToken(accessToken)
        }

        if (
            appSession?.error === 'RefreshAccessTokenError' &&
            !didHandleSessionError.current
        ) {
            didHandleSessionError.current = true

            const handleExpiredSession = async () => {
                await callInternalLogout()
                await signOut({
                    callbackUrl: appConfig.unAuthenticatedEntryPath,
                })
            }

            handleExpiredSession()
        }
    }, [liveSession])

    return null
}

const AuthProvider = (props: AuthProviderProps) => {
    const { session, children } = props
    const [sessionState, setSessionState] = useState<Session>(session)

    useEffect(() => {
        setSessionState(session)
    }, [session])

    const sessionContextValue = useMemo(
        () => ({
            session: sessionState as AppSession | null,
            setSession: setSessionState as Dispatch<
                SetStateAction<AppSession | null>
            >,
        }),
        [sessionState],
    )

    return (
        /** since the next auth useSession hook was triggering mutliple re-renders, hence we are using the our custom session provider and we still included the next auth session provider, incase we need to use any client hooks from next auth */
        <NextAuthSessionProvider
            session={sessionState}
            refetchOnWindowFocus={false}
        >
            <SessionSync onSessionChange={setSessionState} />
            <SessionContext.Provider value={sessionContextValue}>
                {children}
            </SessionContext.Provider>
        </NextAuthSessionProvider>
    )
}

export default AuthProvider
