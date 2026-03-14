'use client'

import { useEffect } from 'react'
import { useOrderListStore } from '../_store/orderListStore'
import type { Orders, StatusOption, PaymentMethodOption } from '../types'
import type { CommonProps } from '@/@types/common'

interface OrderListProviderProps extends CommonProps {
    orderList: Orders
    statusOptions?: StatusOption[]
    paymentMethodOptions?: PaymentMethodOption[]
}

const OrderListProvider = ({
    orderList,
    statusOptions = [],
    paymentMethodOptions = [],
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

        setInitialLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderList, statusOptions, paymentMethodOptions])

    return <>{children}</>
}

export default OrderListProvider
