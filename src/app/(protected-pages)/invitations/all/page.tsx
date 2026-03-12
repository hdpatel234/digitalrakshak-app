import InvitationListProvider from './_components/InvitationListProvider'
import type { PageProps } from '@/@types/common'
import ClientContent from './_components/ClientContent'

export default async function Page({ searchParams }: PageProps) {
    const params = await searchParams

    return (
        <InvitationListProvider params={params}>
            <ClientContent params={params} />
        </InvitationListProvider>
    )
}

