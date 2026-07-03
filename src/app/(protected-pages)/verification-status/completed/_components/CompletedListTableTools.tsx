'use client'

import CompletedListSearch from './CompletedListSearch'
import CompletedListTableFilter from './CompletedListTableFilter'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import type { StatusOption } from '../types'

type CompletedListTableToolsProps = {
    statusOptions: StatusOption[]
    selectedStatus: string
}

const CompletedListTableTools = ({
    statusOptions,
    selectedStatus,
}: CompletedListTableToolsProps) => {
    const { onAppendQueryParams } = useAppendQueryParams()

    const handleInputChange = (val: string) => {
        onAppendQueryParams({ query: val, pageIndex: '1' })
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full mb-4">
            <div className="w-full md:flex-1">
                <CompletedListSearch onInputChange={handleInputChange} />
            </div>
            <div className="flex shrink-0">
                <CompletedListTableFilter
                    statusOptions={statusOptions}
                    selectedStatus={selectedStatus}
                />
            </div>
        </div>
    )
}

export default CompletedListTableTools
