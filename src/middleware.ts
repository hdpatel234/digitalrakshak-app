import NextAuth from 'next-auth'

import authConfig from '@/configs/auth.config'
import {
    authRoutes as _authRoutes,
    publicRoutes as _publicRoutes,
} from '@/configs/routes.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import appConfig from '@/configs/app.config'

const { auth } = NextAuth(authConfig)

const publicRoutes = Object.entries(_publicRoutes).map(([key]) => key)
const authRoutes = Object.entries(_authRoutes).map(([key]) => key)

const apiAuthPrefix = `${appConfig.apiPrefix}/auth`

export default auth((req) => {
    const { nextUrl } = req
    const accessTokenExpiresAt = Number(
        (req.auth as Record<string, unknown> | null)?.accessTokenExpiresAt || 0,
    )

    const hasRefreshError =
        (req.auth as Record<string, unknown> | null)?.error ===
        'RefreshAccessTokenError'
    const isTokenExpired =
        accessTokenExpiresAt > 0 && Date.now() >= accessTokenExpiresAt
    const isSignedIn = !!req.auth && !hasRefreshError && !isTokenExpired

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
    const isLogoutRoute = nextUrl.pathname === '/logout'
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname) || isLogoutRoute
    const isAuthRoute = authRoutes.includes(nextUrl.pathname)

    /** Skip auth middleware for api routes */
    if (isApiAuthRoute) return

    if ((hasRefreshError || isTokenExpired) && !isLogoutRoute) {
        const logoutUrl = new URL('/logout', nextUrl.origin)
        logoutUrl.searchParams.set('callbackUrl', appConfig.unAuthenticatedEntryPath)
        return Response.redirect(logoutUrl)
    }

    if (isAuthRoute) {
        if (isSignedIn) {
            /** Redirect to authenticated entry path if signed in & path is auth route */
            return Response.redirect(
                new URL(appConfig.authenticatedEntryPath, nextUrl),
            )
        }
        return
    }

    /** Redirect to authenticated entry path if signed in & path is public route */
    if (!isSignedIn && !isPublicRoute) {
        let callbackUrl = nextUrl.pathname
        if (nextUrl.search) {
            callbackUrl += nextUrl.search
        }

        return Response.redirect(
            new URL(
                `${appConfig.unAuthenticatedEntryPath}?${REDIRECT_URL_KEY}=${callbackUrl}`,
                nextUrl,
            ),
        )
    }

    /** Uncomment this and `import { protectedRoutes } from '@/configs/routes.config'` if you want to enable role based access */
    // if (isSignedIn && nextUrl.pathname !== '/access-denied') {
    //     const routeMeta = protectedRoutes[nextUrl.pathname]
    //     const includedRole = routeMeta?.authority.some((role) => req.auth?.user?.authority.includes(role))
    //     if (!includedRole) {
    //         return Response.redirect(
    //             new URL('/access-denied', nextUrl),
    //         )
    //     }
    // }
})

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api)(.*)'],
}
