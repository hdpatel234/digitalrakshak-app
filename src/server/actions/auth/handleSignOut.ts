'use server'

import { signOut } from '@/auth'
import appConfig from '@/configs/app.config'

const handleSignOut = async () => {
    console
        .log('handleSignOut called, redirecting to', appConfig.unAuthenticatedEntryPath)
    await signOut({ redirectTo: appConfig.unAuthenticatedEntryPath })
}

export default handleSignOut
