'use client'

import DebouceInput from '@/components/shared/DebouceInput'
import { TbSearch } from 'react-icons/tb'
import { Ref } from 'react'

type InsufficiencyListSearchProps = {
    onInputChange: (value: string) => void
    ref?: Ref<HTMLInputElement>
}

const InsufficiencyListSearch = (props: InsufficiencyListSearchProps) => {
    const { onInputChange, ref } = props

    return (
        <DebouceInput
            ref={ref}
            placeholder="Search candidates..."
            suffix={<TbSearch className="text-lg" />}
            onChange={(e) => onInputChange(e.target.value)}
        />
    )
}

export default InsufficiencyListSearch
