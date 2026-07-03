'use client'

import { useEffect } from 'react'
import { useInsufficiencyListStore } from '../_store/insufficiencyListStore'
import type { Customer } from '../types'
import type { CommonProps } from '@/@types/common'

interface InsufficiencyListProviderProps extends CommonProps {
    customerList: Customer[]
}

const InsufficiencyListProvider = ({
    customerList,
    children,
}: InsufficiencyListProviderProps) => {
    const setCustomerList = useInsufficiencyListStore(
        (state) => state.setCustomerList,
    )

    const setInitialLoading = useInsufficiencyListStore(
        (state) => state.setInitialLoading,
    )

    useEffect(() => {
        setCustomerList(customerList)

        setInitialLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customerList])

    return <>{children}</>
}

export default InsufficiencyListProvider
