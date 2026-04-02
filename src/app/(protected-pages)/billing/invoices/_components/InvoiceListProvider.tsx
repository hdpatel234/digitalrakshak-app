'use client'

import { useEffect } from 'react'
import { useInvoiceListStore } from '../_store/invoiceListStore'
import type { Invoices, StatusOption } from '../types'
import type { CommonProps } from '@/@types/common'

interface InvoiceListProviderProps extends CommonProps {
    invoiceList: Invoices
    statusOptions?: StatusOption[]
}

const InvoiceListProvider = ({
    invoiceList,
    statusOptions = [],
    children,
}: InvoiceListProviderProps) => {
    const setInvoiceList = useInvoiceListStore((state) => state.setInvoiceList)
    const setStatusOptions = useInvoiceListStore(
        (state) => state.setStatusOptions,
    )

    const setInitialLoading = useInvoiceListStore(
        (state) => state.setInitialLoading,
    )

    useEffect(() => {
        setInvoiceList(invoiceList)
        setStatusOptions(statusOptions)

        setInitialLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [invoiceList, statusOptions])

    return <>{children}</>
}

export default InvoiceListProvider
