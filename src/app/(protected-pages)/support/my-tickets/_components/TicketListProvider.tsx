'use client'

import { useEffect } from 'react'
import { useTicketListStore } from '../_store/ticketListStore'
import type {
    Tickets,
    StatusOption,
    DepartmentOption,
    PriorityOption,
} from './types'
import type { CommonProps } from '@/@types/common'

interface TicketListProviderProps extends CommonProps {
    ticketList: Tickets
    statusOptions?: StatusOption[]
    departmentOptions?: DepartmentOption[]
    priorityOptions?: PriorityOption[]
}

const TicketListProvider = ({
    ticketList,
    statusOptions = [],
    departmentOptions = [],
    priorityOptions = [],
    children,
}: TicketListProviderProps) => {
    const setTicketList = useTicketListStore((state) => state.setTicketList)
    const setStatusOptions = useTicketListStore(
        (state) => state.setStatusOptions,
    )
    const setDepartmentOptions = useTicketListStore(
        (state) => state.setDepartmentOptions,
    )
    const setPriorityOptions = useTicketListStore(
        (state) => state.setPriorityOptions,
    )
    const setInitialLoading = useTicketListStore(
        (state) => state.setInitialLoading,
    )

    useEffect(() => {
        setTicketList(ticketList)
        setStatusOptions(statusOptions)
        setDepartmentOptions(departmentOptions)
        setPriorityOptions(priorityOptions)

        setInitialLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ticketList, statusOptions, departmentOptions, priorityOptions])

    return <>{children}</>
}

export default TicketListProvider
