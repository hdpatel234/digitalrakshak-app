import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'

export default function Loading() {
    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4 animate-pulse">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                    </div>
                    
                    {/* Toolbar skeleton */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full md:w-64"></div>
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full md:w-48"></div>
                    </div>

                    {/* Table skeleton */}
                    <div className="w-full mt-2">
                        {/* Table header */}
                        <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700 mb-2 gap-4">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/12"></div>
                        </div>
                        {/* Table rows */}
                        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                            <div key={i} className="flex justify-between items-center py-4 border-b border-gray-100 dark:border-gray-800 gap-4">
                                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
                                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
                                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
                                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded flex-shrink-0"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </AdaptiveCard>
        </Container>
    )
}
