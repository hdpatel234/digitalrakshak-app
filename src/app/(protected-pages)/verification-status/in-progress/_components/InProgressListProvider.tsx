'use client'

import { useEffect } from 'react'
import { useInProgressListStore } from '../_store/inProgressListStore'
import type { Customer } from '../types'
import type { CommonProps } from '@/@types/common'

interface InProgressListProviderProps extends CommonProps {
    customerList: Customer[]
}

const InProgressListProvider = ({
    customerList,
    children,
}: InProgressListProviderProps) => {
    const setCustomerList = useInProgressListStore(
        (state) => state.setCustomerList,
    )

    const setInitialLoading = useInProgressListStore(
        (state) => state.setInitialLoading,
    )

    useEffect(() => {
        setCustomerList(customerList)

        setInitialLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customerList])

    return <>{children}</>
}

export default InProgressListProvider
