'use client'

import DebouceInput from '@/components/shared/DebouceInput'
import { TbSearch } from 'react-icons/tb'
import TeamListTableFilter from './TeamListTableFilter'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import type { ChangeEvent } from 'react'

const TeamListTableTools = () => {
    const { onAppendQueryParams } = useAppendQueryParams()

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        onAppendQueryParams({
            query: event.target.value,
        })
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center gap-2">
            <DebouceInput
                className="w-full md:w-[320px]"
                placeholder="Search"
                suffix={<TbSearch className="text-lg" />}
                onChange={handleInputChange}
            />
            <TeamListTableFilter />
        </div>
    )
}

export default TeamListTableTools
