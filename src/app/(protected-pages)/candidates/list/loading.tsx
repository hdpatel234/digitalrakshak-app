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
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                            <Skeleton className="mb-2 h-8 w-48" />
                            <Skeleton className="h-4 w-64" />
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="h-10 w-24" />
                            <Skeleton className="h-10 w-32" />
                        </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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
                                <Th><Skeleton className="h-4 w-24" /></Th>
                                <Th><Skeleton className="h-4 w-24" /></Th>
                                <Th><Skeleton className="h-4 w-24" /></Th>
                                <Th><Skeleton className="h-4 w-24" /></Th>
                                <Th><Skeleton className="h-4 w-24" /></Th>
                                <Th><Skeleton className="h-4 w-12" /></Th>
                            </Tr>
                        </THead>
                        <TableRowSkeleton
                            columns={7}
                            rows={10}
                            avatarInColumns={[0]}
                            avatarProps={{ width: 40, height: 40 }}
                        />
                    </Table>
                </div>
            </AdaptiveCard>
        </Container>
    )
}
