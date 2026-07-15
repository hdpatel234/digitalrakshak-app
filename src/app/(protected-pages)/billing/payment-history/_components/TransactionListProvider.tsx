'use client'

import { useEffect } from 'react'
import { useTransactionListStore } from '../_store/transactionListStore'
import type { Transactions, StatusOption } from '../types'
import type { CommonProps } from '@/@types/common'

interface TransactionListProviderProps extends CommonProps {
    transactionList: Transactions
    statusOptions?: StatusOption[]
    loading?: boolean
}

const TransactionListProvider = ({
    transactionList,
    statusOptions = [],
    loading,
    children,
}: TransactionListProviderProps) => {
    const setTransactionList = useTransactionListStore((state) => state.setTransactionList)
    const setStatusOptions = useTransactionListStore(
        (state) => state.setStatusOptions,
    )

    const setInitialLoading = useTransactionListStore(
        (state) => state.setInitialLoading,
    )

    useEffect(() => {
        setTransactionList(transactionList)
        setStatusOptions(statusOptions)

        setInitialLoading(loading ?? false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transactionList, statusOptions, loading])

    return <>{children}</>
}

export default TransactionListProvider
