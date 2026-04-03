'use client'

import { useEffect } from 'react'
import { useTransactionListStore } from '../_store/transactionListStore'
import type { Transactions, StatusOption } from '../types'
import type { CommonProps } from '@/@types/common'

interface TransactionListProviderProps extends CommonProps {
    transactionList: Transactions
    statusOptions?: StatusOption[]
}

const TransactionListProvider = ({
    transactionList,
    statusOptions = [],
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

        setInitialLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transactionList, statusOptions])

    return <>{children}</>
}

export default TransactionListProvider
