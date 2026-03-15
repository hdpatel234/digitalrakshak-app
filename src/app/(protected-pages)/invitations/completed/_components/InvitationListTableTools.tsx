'use client'

import InvitationListSearch from './InvitationListSearch'
import InvitationTableFilter from './InvitationListTableFilter'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'

const InvitationListTableTools = () => {
    const { onAppendQueryParams } = useAppendQueryParams()

    const handleInputChange = (query: string) => {
        onAppendQueryParams({
            search: query,
            page: '1',
        })
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <InvitationListSearch onInputChange={handleInputChange} />
            <InvitationTableFilter />
        </div>
    )
}

export default InvitationListTableTools

