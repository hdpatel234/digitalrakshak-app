'use client'

import { useMemo } from 'react'
import isEmpty from 'lodash/isEmpty'
import NavigationContext from './NavigationContext'
import useCurrentSession from '@/utils/hooks/useCurrentSession'
import { NAV_ITEM_TYPE_TITLE, NAV_ITEM_TYPE_COLLAPSE } from '@/constants/navigation.constant'

import type { NavigationTree } from '@/@types/navigation'
import type { CommonProps } from '@/@types/common'

interface NavigationProviderProps extends CommonProps {
    navigationTree: NavigationTree[]
}

function hasPermission(
    authority: string[] = [],
    permissions: string[] = [],
    userAuthority: string[] = [],
    userPermissions: string[] = [],
) {
    const roleMatched = isEmpty(authority) ? true : authority.some((role) => userAuthority.includes(role))
    const hasPermission = isEmpty(permissions) ? true : permissions.some((permission) => userPermissions.includes(permission))
    
    if (isEmpty(authority) && isEmpty(permissions)) return true
    if (isEmpty(userAuthority) && isEmpty(userPermissions)) return false
    
    return roleMatched && hasPermission
}

function filterNavigationTree(navTree: NavigationTree[], userAuthority: string[], userPermissions: string[]): NavigationTree[] {
    return navTree
        .map((nav) => {
            if (nav.subMenu && nav.subMenu.length > 0) {
                const filteredSubMenu = filterNavigationTree(nav.subMenu, userAuthority, userPermissions)
                return { ...nav, subMenu: filteredSubMenu }
            }
            return nav
        })
        .filter((nav) => {
            const hasAuth = hasPermission(nav.authority, nav.permissions, userAuthority, userPermissions)
            if (!hasAuth) return false

            if (nav.type === NAV_ITEM_TYPE_TITLE || nav.type === NAV_ITEM_TYPE_COLLAPSE) {
                return nav.subMenu && nav.subMenu.length > 0
            }

            return true
        })
}

const NavigationProvider = ({
    navigationTree,
    children,
}: NavigationProviderProps) => {
    const { session } = useCurrentSession()

    const filteredNavigationTree = useMemo(() => {
        const userAuthority = session?.user?.authority || []
        const userPermissions = session?.user?.permissions || []
        return filterNavigationTree(navigationTree, userAuthority, userPermissions)
    }, [navigationTree, session])

    return (
        <NavigationContext.Provider value={{ navigationTree: filteredNavigationTree }}>
            {children}
        </NavigationContext.Provider>
    )
}

export default NavigationProvider
