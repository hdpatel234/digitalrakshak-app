import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Skeleton from '@/components/ui/Skeleton'
import TableRowSkeleton from '@/components/shared/loaders/TableRowSkeleton'
import Table from '@/components/ui/Table'

export default function Loading() {
    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <Skeleton className="h-8 w-40" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-4 mt-4">
                        <Skeleton className="h-10 w-full md:w-64" />
                        <Skeleton className="h-10 w-full md:w-48" />
                    </div>
                    <Table>
                        <Table.THead>
                            <Table.Tr>
                                <Table.Th><Skeleton className="h-4 w-24" /></Table.Th>
                                <Table.Th><Skeleton className="h-4 w-32" /></Table.Th>
                                <Table.Th><Skeleton className="h-4 w-24" /></Table.Th>
                                <Table.Th><Skeleton className="h-4 w-20" /></Table.Th>
                                <Table.Th><Skeleton className="h-4 w-16" /></Table.Th>
                            </Table.Tr>
                        </Table.THead>
                        <TableRowSkeleton columns={5} rows={10} />
                    </Table>
                </div>
            </AdaptiveCard>
        </Container>
    )
}
