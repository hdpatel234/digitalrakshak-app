import PackageEdit from './_components/PackageEdit'

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params

    return <PackageEdit packageId={params.id} />
}
