'use client'

import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import InvitationListTable from './InvitationListTable'
import InvitationListTableTools from './InvitationListTableTools'
import InvitationListBulkActions from './InvitationListBulkActions'
import useTranslation from '@/utils/hooks/useTranslation'

type ClientContentProps = {
    params: Record<string, string | string[] | undefined>
}

function ClientContent({ params }: ClientContentProps) {
    const t = useTranslation('invitations')
    const page = Number.parseInt(String(params.page || ''), 10)
    const perPage = Number.parseInt(String(params.per_page || ''), 10)

    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>{t('list.pageTitle')}</h3>
                        </div>

                        <InvitationListTableTools />

                        <InvitationListTable
                            pageIndex={Number.isNaN(page) ? 1 : page}
                            pageSize={Number.isNaN(perPage) ? 10 : perPage}
                        />
                    </div>
                </AdaptiveCard>
            </Container>
            <InvitationListBulkActions />
        </>
    )
}

export default ClientContent

