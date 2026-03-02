'use client'

import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import InvitationListTable from './InvitationListTable'
import InvitationListActionTools from './InvitationListActionTools'
import InvitationListTableTools from './InvitationListTableTools'
import InvitationListSelected from './InvitationListSelected'

type ClientContentProps = {
    data: {
        total: number
    }
    params: Record<string, string | string[] | undefined>
}

function ClientContent({ data, params }: ClientContentProps) {
    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Invitations</h3>
                            <InvitationListActionTools />
                        </div>

                        <InvitationListTableTools />

                        <InvitationListTable
                            customerListTotal={data.total}
                            pageIndex={parseInt(params.pageIndex as string) || 1}
                            pageSize={parseInt(params.pageSize as string) || 10}
                        />
                    </div>
                </AdaptiveCard>
            </Container>

            <InvitationListSelected />
        </>
    )
}

export default ClientContent

