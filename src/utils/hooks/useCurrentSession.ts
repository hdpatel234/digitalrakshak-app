import { useContext } from 'react'
import SessionContext from '@/components/auth/AuthProvider/SessionContext'
import type { AppSession } from '@/components/auth/AuthProvider/SessionContext'
import type { Dispatch, SetStateAction } from 'react'

const useCurrentSession = () => {
    const context = useContext(SessionContext)
    const fallbackSession: AppSession = {
        expires: '',
        user: {},
        config: {},
    }
    const noopSetSession: Dispatch<SetStateAction<AppSession | null>> = () =>
        undefined

    if (!context) {
        return {
            session: fallbackSession,
            setSession: noopSetSession,
        }
    }

    return {
        session: context.session || fallbackSession,
        setSession: context.setSession,
    }
}

export default useCurrentSession
