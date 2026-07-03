'use client'

import { useEffect } from 'react'
import { useCompletedListStore } from '../_store/completedListStore'
import type { Customer } from '../types'
import type { CommonProps } from '@/@types/common'

interface CompletedListProviderProps extends CommonProps {
    customerList: Customer[]
}

const CompletedListProvider = ({
    customerList,
    children,
}: CompletedListProviderProps) => {
    const setCustomerList = useCompletedListStore(
        (state) => state.setCustomerList,
    )

    const setInitialLoading = useCompletedListStore(
        (state) => state.setInitialLoading,
    )

    useEffect(() => {
        setCustomerList(customerList)

        setInitialLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customerList])

    return <>{children}</>
}

export default CompletedListProvider
