import Container from '@/components/shared/Container'
import AddTeamMemberForm from '../../_components/AddTeamMemberForm'

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;

    return (
        <Container>
            <AddTeamMemberForm userId={params.id} />
        </Container>
    )
}
