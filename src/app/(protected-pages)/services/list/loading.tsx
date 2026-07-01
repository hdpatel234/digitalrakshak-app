import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'

export default function Loading() {
    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4 animate-pulse">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                    </div>
                    
                    {/* Toolbar skeleton */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full md:w-64"></div>
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full md:w-32"></div>
                    </div>

                    {/* Grid skeleton */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                                </div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                                <div className="flex justify-between items-center mt-auto">
                                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </AdaptiveCard>
        </Container>
    )
}
