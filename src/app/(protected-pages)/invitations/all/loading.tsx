import Skeleton from '@/components/ui/Skeleton'
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'

const Loading = () => {
    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                    {/* Header Skeleton */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <Skeleton className="w-48 h-8 rounded-lg" />
                    </div>

                    {/* Table Tools Skeleton */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-2">
                        <div className="flex gap-2 w-full md:w-auto">
                            <Skeleton className="w-full md:w-64 h-10 rounded-lg" />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <Skeleton className="w-full md:w-32 h-10 rounded-lg" />
                            <Skeleton className="w-full md:w-32 h-10 rounded-lg" />
                        </div>
                    </div>

                    {/* Table Skeleton */}
                    <div className="mt-4">
                        <div className="w-full bg-gray-50 dark:bg-gray-800 rounded-t-lg h-12 flex items-center px-4 gap-4">
                            <Skeleton className="w-8 h-4 rounded" />
                            <Skeleton className="w-1/4 h-4 rounded" />
                            <Skeleton className="w-1/4 h-4 rounded" />
                            <Skeleton className="w-1/4 h-4 rounded" />
                            <Skeleton className="w-12 h-4 rounded ml-auto" />
                        </div>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="w-full border-b border-gray-200 dark:border-gray-700 h-16 flex items-center px-4 gap-4">
                                <Skeleton className="w-8 h-4 rounded" />
                                <Skeleton className="w-1/4 h-4 rounded" />
                                <Skeleton className="w-1/4 h-4 rounded" />
                                <Skeleton className="w-1/4 h-4 rounded" />
                                <Skeleton className="w-12 h-8 rounded ml-auto" />
                            </div>
                        ))}
                    </div>

                    {/* Pagination Skeleton */}
                    <div className="flex items-center justify-between mt-4">
                        <Skeleton className="w-32 h-6 rounded" />
                        <div className="flex gap-2">
                            <Skeleton className="w-8 h-8 rounded" />
                            <Skeleton className="w-8 h-8 rounded" />
                            <Skeleton className="w-8 h-8 rounded" />
                        </div>
                    </div>
                </div>
            </AdaptiveCard>
        </Container>
    )
}

export default Loading
