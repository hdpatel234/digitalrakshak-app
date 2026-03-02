import CustomerListProvider from './_components/CustomerListProvider'
import getCustomers from '@/server/actions/getCustomers'
import type { PageProps } from '@/@types/common'
import ClientContent from './_components/ClientContent'

export default async function Page({ searchParams }: PageProps) {
    const params = await searchParams
    const data = await getCustomers(params)

    return (
        <CustomerListProvider customerList={data.list}>
            <ClientContent data={data} params={params} />
        </CustomerListProvider>
    )
}
