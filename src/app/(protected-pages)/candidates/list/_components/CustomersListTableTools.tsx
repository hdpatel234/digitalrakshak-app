'use client'

import CustomerListSearch from './CustomerListSearch'
import CustomerTableFilter from './CustomerListTableFilter'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import type { StatusOption } from '../types'

type CustomersListTableToolsProps = {
    statusOptions: StatusOption[]
    selectedStatus: string
}

const CustomersListTableTools = ({
    statusOptions,
    selectedStatus,
}: CustomersListTableToolsProps) => {
    const { onAppendQueryParams } = useAppendQueryParams()

    const handleInputChange = (query: string) => {
        onAppendQueryParams({
            query,
        })
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <CustomerListSearch onInputChange={handleInputChange} />
            <CustomerTableFilter
                statusOptions={statusOptions}
                selectedStatus={selectedStatus}
            />
        </div>
    )
}

export default CustomersListTableTools
