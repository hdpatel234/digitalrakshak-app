'use client'

import DebouceInput from '@/components/shared/DebouceInput'
import { TbSearch } from 'react-icons/tb'
import { Ref } from 'react'

type InProgressListSearchProps = {
    onInputChange: (value: string) => void
    ref?: Ref<HTMLInputElement>
}

const InProgressListSearch = (props: InProgressListSearchProps) => {
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

export default InProgressListSearch
