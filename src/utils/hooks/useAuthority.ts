'use client'

import { useMemo } from 'react'
import isEmpty from 'lodash/isEmpty'

function useAuthority(
    userAuthority: string[] = [],
    authority: string[] = [],
    userPermissions: string[] = [],
    permissions: string[] = [],
    emptyCheck = false,
) {
    const roleMatched = useMemo(() => {
        const hasRole = isEmpty(authority) ? true : authority.some((role) => userAuthority.includes(role))
        const hasPermission = isEmpty(permissions) ? true : permissions.some((permission) => userPermissions.includes(permission))
        return hasRole && hasPermission
    }, [authority, userAuthority, permissions, userPermissions])

    if (
        (isEmpty(authority) && isEmpty(permissions)) ||
        (isEmpty(userAuthority) && isEmpty(userPermissions) && !emptyCheck) ||
        (typeof authority === 'undefined' && typeof permissions === 'undefined')
    ) {
        return !emptyCheck
    }

    return roleMatched
}

export default useAuthority
