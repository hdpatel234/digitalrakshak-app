'use client'

import useAuthority from '@/utils/hooks/useAuthority'
import useCurrentSession from '@/utils/hooks/useCurrentSession'
import type { CommonProps } from '@/@types/common'

interface AuthorityCheckProps extends CommonProps {
    userAuthority?: string[]
    authority?: string[]
    userPermissions?: string[]
    permissions?: string[]
}

const AuthorityCheck = (props: AuthorityCheckProps) => {
    const { authority = [], permissions = [], children } = props
    const { session } = useCurrentSession()

    const userAuthority = props.userAuthority && props.userAuthority.length > 0 
        ? props.userAuthority 
        : (session?.user?.authority || [])
        
    const userPermissions = props.userPermissions && props.userPermissions.length > 0 
        ? props.userPermissions 
        : (session?.user?.permissions || [])

    const roleMatched = useAuthority(userAuthority, authority, userPermissions, permissions)

    return <>{roleMatched ? children : null}</>
}

export default AuthorityCheck
