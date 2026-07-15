'use client'

import { useEffect } from 'react'
import { useCustomerListStore } from '../_store/customerListStore'
import type { Customer } from '../types'
import type { CommonProps } from '@/@types/common'

interface CustomerListProviderProps extends CommonProps {
    customerList: Customer[]
    loading?: boolean
}

const CustomerListProvider = ({
    customerList,
    loading,
    children,
}: CustomerListProviderProps) => {
    const setCustomerList = useCustomerListStore(
        (state) => state.setCustomerList,
    )

    const setInitialLoading = useCustomerListStore(
        (state) => state.setInitialLoading,
    )

    useEffect(() => {
        setCustomerList(customerList)
        setInitialLoading(loading ?? false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customerList, loading])

    return <>{children}</>
}

export default CustomerListProvider
