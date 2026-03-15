'use client'

import DebouceInput from '@/components/shared/DebouceInput'
import { TbSearch } from 'react-icons/tb'
import { Ref } from 'react'
import useTranslation from '@/utils/hooks/useTranslation'

type InvitationListSearchProps = {
    onInputChange: (value: string) => void
    ref?: Ref<HTMLInputElement>
}

const InvitationListSearch = (props: InvitationListSearchProps) => {
    const { onInputChange, ref } = props
    const t = useTranslation('invitations')

    return (
        <DebouceInput
            ref={ref}
            placeholder={t('search.placeholder')}
            suffix={<TbSearch className="text-lg" />}
            onChange={(e) => onInputChange(e.target.value)}
        />
    )
}

export default InvitationListSearch

