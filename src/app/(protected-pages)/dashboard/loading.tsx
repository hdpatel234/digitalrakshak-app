import Skeleton from '@/components/ui/Skeleton'
import Container from '@/components/shared/Container'

const Loading = () => {
    return (
        <Container>
            <div className="flex flex-col gap-4">
                {/* DashboardHeader Skeleton */}
                <div className="flex justify-between items-center mb-4">
                    <Skeleton className="w-48 h-8 rounded-lg" />
                    <Skeleton className="w-32 h-10 rounded-lg" />
                </div>
                
                {/* DashboardStats Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="w-full h-[120px] rounded-xl" />
                    ))}
                </div>

                {/* VerificationTrendChart Skeleton */}
                <Skeleton className="w-full h-[400px] rounded-xl" />

                {/* RecentActivity Skeleton */}
                <Skeleton className="w-full h-[300px] rounded-xl" />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        {/* ServiceUsageChart Skeleton */}
                        <Skeleton className="w-full h-[350px] rounded-xl" />
                    </div>
                    <div>
                        {/* MonthSpend Skeleton */}
                        <Skeleton className="w-full h-[350px] rounded-xl" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* ActivePackages Skeleton */}
                    <Skeleton className="w-full h-[400px] rounded-xl" />
                    {/* LatestCandidates Skeleton */}
                    <Skeleton className="w-full h-[400px] rounded-xl" />
                </div>
            </div>
        </Container>
    )
}

export default Loading
