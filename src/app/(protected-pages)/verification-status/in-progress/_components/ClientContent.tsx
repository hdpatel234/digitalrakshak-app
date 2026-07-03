'use client'

import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import InProgressListTable from './InProgressListTable'
import InProgressListTableTools from './InProgressListTableTools'
import type { StatusOption } from '../types'

type ClientContentProps = {
    data: {
        total: number
        statusList?: StatusOption[]
    }
    params: {
        pageIndex?: string | string[]
        pageSize?: string | string[]
        status?: string | string[]
    }
}

function ClientContent({ data, params }: ClientContentProps) {
    const selectedStatus =
        typeof params.status === 'string' ? params.status : ''

    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                            <h3>In Progress Verifications</h3>
                            <p className="text-sm text-gray-500 mt-1">{data.total} candidates currently in progress</p>
                        </div>
                    </div>

                    <InProgressListTableTools
                        statusOptions={data.statusList || []}
                        selectedStatus={selectedStatus}
                    />

                    <InProgressListTable
                        customerListTotal={data.total}
                        pageIndex={parseInt(params.pageIndex as string) || 1}
                        pageSize={parseInt(params.pageSize as string) || 10}
                    />
                </div>
            </AdaptiveCard>
        </Container>
    )
}

export default ClientContent
