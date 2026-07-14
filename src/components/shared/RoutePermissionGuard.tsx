'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { apiGetPermissions } from '@/services/auth/profile'
import { protectedRoutes } from '@/configs/routes.config/routes.config'
import useCurrentSession from '@/utils/hooks/useCurrentSession'
import AccessDenied from '@/components/shared/AccessDenied'

export default function RoutePermissionGuard({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const { session, setSession } = useCurrentSession()

    // 1. Synchronous Access Check
    const routeMeta = protectedRoutes[pathname]
    let hasAccess = true

    if (pathname && pathname !== '/access-denied' && routeMeta && routeMeta.permissions && routeMeta.permissions.length > 0) {
        const sessionPermissions = session?.user?.permissions || []
        hasAccess = routeMeta.permissions.some((perm) => sessionPermissions.includes(perm))
    }

    // 2. Background Permission Sync
    useEffect(() => {
        const syncPermissions = async () => {
            try {
                const response = await apiGetPermissions()
                
                if (response && response.status) {
                    const latestPermissions = response.data || []
                    
                    setSession((prev) => {
                        if (!prev) return null;
                        
                        const currentPermissions = prev.user?.permissions || []
                        const isDifferent = latestPermissions.length !== currentPermissions.length || 
                                            !latestPermissions.every(p => currentPermissions.includes(p)) ||
                                            !currentPermissions.every(p => latestPermissions.includes(p));
                        
                        if (isDifferent) {
                            return {
                                ...prev,
                                user: {
                                    ...(prev.user || {}),
                                    permissions: latestPermissions
                                }
                            }
                        }
                        
                        return prev; // If identical, return exactly the same object to prevent re-renders
                    })
                }
            } catch (error) {
                console.error('Failed to background sync permissions', error)
            }
        }

        if (pathname && pathname !== '/access-denied') {
            syncPermissions()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, setSession])

    if (hasAccess === false) {
        return <AccessDenied />
    }

    return <>{children}</>
}
