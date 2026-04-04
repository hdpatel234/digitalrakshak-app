import Container from '@/components/shared/Container'
import TicketDetailsMain from './_components/TicketDetailsMain'

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = params

    return (
        <Container>
            <TicketDetailsMain id={id} />
        </Container>
    )
}
