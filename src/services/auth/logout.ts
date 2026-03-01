'use client'

let isInternalLogoutInFlight = false

export const callInternalLogout = async () => {
    if (isInternalLogoutInFlight) {
        return
    }

    isInternalLogoutInFlight = true

    try {
        const token =
            sessionStorage.getItem('auth_token') ||
            localStorage.getItem('auth_token')

        await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            cache: 'no-store',
        })
    } catch {
        // Ignore API failures and still clear local token.
    } finally {
        sessionStorage.removeItem('auth_token')
        localStorage.removeItem('auth_token')
        isInternalLogoutInFlight = false
    }
}
