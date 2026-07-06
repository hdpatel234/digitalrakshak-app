import useAuthority from '@/utils/hooks/useAuthority'
import type { CommonProps } from '@/@types/common'

interface AuthorityCheckProps extends CommonProps {
    userAuthority?: string[]
    authority?: string[]
    userPermissions?: string[]
    permissions?: string[]
}

const AuthorityCheck = (props: AuthorityCheckProps) => {
    const { userAuthority = [], authority = [], userPermissions = [], permissions = [], children } = props

    const roleMatched = useAuthority(userAuthority, authority, userPermissions, permissions)

    return <>{roleMatched ? children : null}</>
}

export default AuthorityCheck
