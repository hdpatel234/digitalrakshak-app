'use client'

import InProgressListSearch from './InProgressListSearch'
import InProgressListTableFilter from './InProgressListTableFilter'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import type { StatusOption } from '../types'

type InProgressListTableToolsProps = {
    statusOptions: StatusOption[]
    selectedStatus: string
}

const InProgressListTableTools = ({
    statusOptions,
    selectedStatus,
}: InProgressListTableToolsProps) => {
    const { onAppendQueryParams } = useAppendQueryParams()

    const handleInputChange = (val: string) => {
        onAppendQueryParams({ query: val, pageIndex: '1' })
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full mb-4">
            <div className="w-full md:flex-1">
                <InProgressListSearch onInputChange={handleInputChange} />
            </div>
            <div className="flex shrink-0">
                <InProgressListTableFilter
                    statusOptions={statusOptions}
                    selectedStatus={selectedStatus}
                />
            </div>
        </div>
    )
}

export default InProgressListTableTools
