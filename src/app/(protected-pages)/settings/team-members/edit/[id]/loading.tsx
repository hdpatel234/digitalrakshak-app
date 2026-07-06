import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Skeleton from '@/components/ui/Skeleton'

export default function Loading() {
    return (
        <Container>
            <AdaptiveCard className="h-full w-full">
                <Skeleton className="h-8 w-48 mb-6" />
                <div className="flex flex-col gap-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="flex items-end gap-4 w-full">
                        <div className="flex flex-col gap-2 w-[150px]">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                    <div className="mt-6">
                        <Skeleton className="h-6 w-32 mb-4" />
                        <div className="flex flex-col gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex flex-col gap-2">
                                    <Skeleton className="h-5 w-40" />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                        {[1, 2, 3, 4].map((j) => (
                                            <div key={j} className="flex items-center gap-2">
                                                <Skeleton className="h-4 w-4 rounded" />
                                                <Skeleton className="h-4 w-24" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>
            </AdaptiveCard>
        </Container>
    )
}
