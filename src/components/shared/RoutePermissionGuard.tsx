'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { apiGetPermissions } from '@/services/auth/profile'
import { protectedRoutes } from '@/configs/routes.config/routes.config'

export default function RoutePermissionGuard({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const [isChecking, setIsChecking] = useState(false)

    useEffect(() => {
        const checkPermission = async () => {
            // Check if route exists in protected config
            const routeMeta = protectedRoutes[pathname]
            
            // If no permissions required, skip check
            if (!routeMeta || !routeMeta.permissions || routeMeta.permissions.length === 0) {
                return
            }

            try {
                setIsChecking(true)
                const response = await apiGetPermissions()
                
                if (response.data && response.data.status) {
                    const userPermissions = response.data.data || []
                    
                    // Check if user has at least one of the required permissions
                    const hasPermission = routeMeta.permissions.some((perm) => userPermissions.includes(perm))
                    
                    if (!hasPermission) {
                        router.push('/access-denied')
                    }
                }
            } catch (error) {
                console.error('Failed to check permissions', error)
            } finally {
                setIsChecking(false)
            }
        }

        if (pathname && pathname !== '/access-denied') {
            checkPermission()
        }
    }, [pathname, router])

    return <>{children}</>
}
