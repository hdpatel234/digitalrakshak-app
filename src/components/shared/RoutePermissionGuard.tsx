'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { apiGetPermissions } from '@/services/auth/profile'
import { protectedRoutes } from '@/configs/routes.config/routes.config'
import useCurrentSession from '@/utils/hooks/useCurrentSession'
import AccessDeniedPage from '@/app/(protected-pages)/access-denied/page'

export default function RoutePermissionGuard({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const { session, setSession } = useCurrentSession()

    const [hasAccess, setHasAccess] = useState(true)

    useEffect(() => {
        const checkPermission = async () => {
            try {
                // Fetch latest permissions
                const response = await apiGetPermissions()
                let latestPermissions: string[] = []

                if (response && response.status) {
                    latestPermissions = response.data || []

                    // Update session with latest permissions
                    setSession((prev) => prev ? {
                        ...prev,
                        user: {
                            ...(prev.user || {}),
                            permissions: latestPermissions
                        }
                    } : null)
                } else {
                    // Fallback to existing permissions in session if fetch fails or is invalid
                    latestPermissions = session?.user?.permissions || []
                }

                const routeMeta = protectedRoutes[pathname]

                // If no permissions required, allow access
                if (!routeMeta || !routeMeta.permissions || routeMeta.permissions.length === 0) {
                    setHasAccess(true)
                    return
                }

                // Check if user has at least one of the required permissions
                const hasPermission = routeMeta.permissions.some((perm) => latestPermissions.includes(perm))

                setHasAccess(hasPermission)
            } catch (error) {
                console.error('Failed to check permissions', error)

                // On error, check against the existing session permissions
                const routeMeta = protectedRoutes[pathname]
                const existingPermissions = session?.user?.permissions || []

                if (routeMeta && routeMeta.permissions && routeMeta.permissions.length > 0) {
                    const hasPermission = routeMeta.permissions.some((perm) => existingPermissions.includes(perm))
                    setHasAccess(hasPermission)
                } else {
                    setHasAccess(true)
                }
            } finally {
                // Done checking
            }
        }

        if (pathname && pathname !== '/access-denied') {
            checkPermission()
        } else {
            setHasAccess(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, setSession])

    if (!hasAccess) {
        return <AccessDeniedPage />
    }

    return <>{children}</>
}
