'use client'

import { useEffect } from 'react'
import { useOrderListStore } from '../_store/orderListStore'
import type { Orders, StatusOption, PaymentMethodOption } from '../types'
import type { CommonProps } from '@/@types/common'

interface OrderListProviderProps extends CommonProps {
    orderList: Orders
    statusOptions?: StatusOption[]
    paymentMethodOptions?: PaymentMethodOption[]
    loading?: boolean
}

const OrderListProvider = ({
    orderList,
    statusOptions = [],
    paymentMethodOptions = [],
    loading,
    children,
}: OrderListProviderProps) => {
    const setOrderList = useOrderListStore((state) => state.setOrderList)
    const setStatusOptions = useOrderListStore(
        (state) => state.setStatusOptions,
    )
    const setPaymentMethodOptions = useOrderListStore(
        (state) => state.setPaymentMethodOptions,
    )

    const setInitialLoading = useOrderListStore(
        (state) => state.setInitialLoading,
    )

    useEffect(() => {
        setOrderList(orderList)
        setStatusOptions(statusOptions)
        setPaymentMethodOptions(paymentMethodOptions)

        setInitialLoading(loading ?? false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderList, statusOptions, paymentMethodOptions, loading])

    return <>{children}</>
}

export default OrderListProvider
