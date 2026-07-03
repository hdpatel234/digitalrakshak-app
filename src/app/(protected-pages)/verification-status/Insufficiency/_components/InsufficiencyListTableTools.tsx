'use client'

import InsufficiencyListSearch from './InsufficiencyListSearch'
import InsufficiencyListTableFilter from './InsufficiencyListTableFilter'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import type { StatusOption } from '../types'

type InsufficiencyListTableToolsProps = {
    statusOptions: StatusOption[]
    selectedStatus: string
}

const InsufficiencyListTableTools = ({
    statusOptions,
    selectedStatus,
}: InsufficiencyListTableToolsProps) => {
    const { onAppendQueryParams } = useAppendQueryParams()

    const handleInputChange = (val: string) => {
        onAppendQueryParams({ query: val, pageIndex: '1' })
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full mb-4">
            <div className="w-full md:flex-1">
                <InsufficiencyListSearch onInputChange={handleInputChange} />
            </div>
            <div className="flex shrink-0">
                <InsufficiencyListTableFilter
                    statusOptions={statusOptions}
                    selectedStatus={selectedStatus}
                />
            </div>
        </div>
    )
}

export default InsufficiencyListTableTools
