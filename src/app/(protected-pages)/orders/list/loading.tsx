import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Skeleton from '@/components/ui/Skeleton'
import TableRowSkeleton from '@/components/shared/loaders/TableRowSkeleton'
import Table from '@/components/ui/Table'

const { THead, Tr, Th } = Table

export default function Loading() {
    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <Skeleton className="h-8 w-24" />
                        <div className="flex gap-2">
                            <Skeleton className="h-10 w-32" />
                            <Skeleton className="h-10 w-32" />
                        </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4">
                        <div className="flex gap-2">
                            <Skeleton className="h-10 w-24" />
                            <Skeleton className="h-10 w-24" />
                            <Skeleton className="h-10 w-24" />
                        </div>
                        <Skeleton className="h-10 w-64" />
                    </div>

                    <Table>
                        <THead>
                            <Tr>
                                <Th><Skeleton className="h-4 w-24" /></Th>
                                <Th><Skeleton className="h-4 w-32" /></Th>
                                <Th><Skeleton className="h-4 w-20" /></Th>
                                <Th><Skeleton className="h-4 w-20" /></Th>
                                <Th><Skeleton className="h-4 w-32" /></Th>
                                <Th><Skeleton className="h-4 w-12" /></Th>
                            </Tr>
                        </THead>
                        <TableRowSkeleton
                            columns={6}
                            rows={10}
                            avatarInColumns={[0]}
                            avatarProps={{ width: 28, height: 28 }}
                        />
                    </Table>
                </div>
            </AdaptiveCard>
        </Container>
    )
}
