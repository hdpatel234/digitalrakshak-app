import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Skeleton from '@/components/ui/Skeleton'

export default function Loading() {
    return (
        <Container>
            <div className="flex flex-col xl:flex-row gap-4">
                <div className="min-w-[330px] 2xl:min-w-[400px]">
                    <Card className="w-full">
                        <div className="flex flex-col xl:justify-between h-full 2xl:min-w-[360px] mx-auto">
                            <div className="flex xl:flex-col items-center gap-4 mt-6">
                                <Skeleton variant="circle" className="h-[90px] w-[90px]" />
                                <Skeleton className="h-6 w-32" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-y-7 gap-x-4 mt-10">
                                <div><Skeleton className="h-4 w-16 mb-2" /><Skeleton className="h-5 w-48" /></div>
                                <div><Skeleton className="h-4 w-16 mb-2" /><Skeleton className="h-5 w-48" /></div>
                                <div><Skeleton className="h-4 w-16 mb-2" /><Skeleton className="h-5 w-32" /></div>
                                <div><Skeleton className="h-4 w-16 mb-2" /><Skeleton className="h-5 w-40" /></div>
                            </div>
                        </div>
                    </Card>
                </div>
                <Card className="w-full">
                    <div className="flex gap-4 border-b pb-2 mb-4">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-8 w-24" />
                    </div>
                    <div className="p-4 flex flex-col gap-4">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                </Card>
            </div>
        </Container>
    )
}
