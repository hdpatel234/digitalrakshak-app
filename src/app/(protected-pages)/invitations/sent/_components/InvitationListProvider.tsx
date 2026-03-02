'use client'

import { useEffect } from 'react'
import { useInvitationListStore } from '../_store/invitationListStore'
import type { Customer } from '../types'
import type { CommonProps } from '@/@types/common'

interface InvitationListProviderProps extends CommonProps {
    customerList: Customer[]
}

const InvitationListProvider = ({
    customerList,
    children,
}: InvitationListProviderProps) => {
    const setCustomerList = useInvitationListStore(
        (state) => state.setCustomerList,
    )

    const setInitialLoading = useInvitationListStore(
        (state) => state.setInitialLoading,
    )

    useEffect(() => {
        setCustomerList(customerList)

        setInitialLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customerList])

    return <>{children}</>
}

export default InvitationListProvider

