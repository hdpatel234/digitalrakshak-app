import Container from '@/components/shared/Container'
import getCustomers from '@/server/actions/getCustomers'
import type { PageProps } from '@/@types/common'

export default async function Page({ searchParams }: PageProps) {
    const params = await searchParams
    const data = await getCustomers(params)

    return (
        <Container>
        </Container>
    )
}
