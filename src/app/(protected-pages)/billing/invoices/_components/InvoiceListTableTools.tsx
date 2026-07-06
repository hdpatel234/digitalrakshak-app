'use client'

import DebouceInput from '@/components/shared/DebouceInput'
import InvoiceListTableFilter from './InvoiceListTableFilter'
import { TbSearch } from 'react-icons/tb'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import { useSearchParams } from 'next/navigation'
import type { ChangeEvent } from 'react'

const InvoiceListTableTools = () => {
    const { onAppendQueryParams } = useAppendQueryParams()
    const searchParams = useSearchParams()

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        onAppendQueryParams({
            search: event.target.value,
        })
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <DebouceInput
                value={searchParams.get('search') || ''}
                placeholder="Search"
                suffix={<TbSearch className="text-lg" />}
                onChange={handleInputChange}
            />
            <InvoiceListTableFilter />
        </div>
    )
}

export default InvoiceListTableTools
