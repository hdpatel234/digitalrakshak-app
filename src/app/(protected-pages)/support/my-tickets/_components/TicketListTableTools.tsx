'use client'

import Input from '@/components/ui/Input'
import TicketListTableFilter from './TicketListTableFilter'
import { TbSearch } from 'react-icons/tb'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import useDebounce from '@/utils/hooks/useDebounce'
import type { ChangeEvent } from 'react'

const TicketListTableTools = () => {
    const { onAppendQueryParams } = useAppendQueryParams()

    const debouncedSearch = useDebounce((query: string) => {
        onAppendQueryParams({ query, pageIndex: '1' })
    }, 500)

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        debouncedSearch(value)
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <Input
                placeholder="Search tickets"
                suffix={<TbSearch className="text-lg" />}
                onChange={handleInputChange}
            />
            <TicketListTableFilter />
        </div>
    )
}

export default TicketListTableTools
