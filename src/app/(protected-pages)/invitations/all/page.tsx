import InvitationListProvider from './_components/InvitationListProvider'
import type { PageProps } from '@/@types/common'
import ClientContent from './_components/ClientContent'
import { invitationsData } from '../_data/invitationsData'

export default async function Page({ searchParams }: PageProps) {
    const params = await searchParams
    const data = {
        list: invitationsData,
        total: invitationsData.length,
    }

    return (
        <InvitationListProvider customerList={data.list}>
            <ClientContent data={data} params={params} />
        </InvitationListProvider>
    )
}

