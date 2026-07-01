import Container from '@/components/shared/Container'

export default function Loading() {
    return (
        <Container>
            <div className="max-w-7xl mx-auto w-full pb-8 animate-pulse">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-2"></div>
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
                    </div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-36"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm flex flex-col h-full bg-white dark:bg-gray-800">
                            <div className="flex justify-between items-start mb-4">
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                            </div>
                            
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-5"></div>
                            
                            <div className="border-b border-gray-200 dark:border-gray-700 w-full mb-4"></div>
                            
                            <div className="flex gap-2 mb-6">
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                            </div>
                            
                            <div className="mt-auto">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                                </div>
                                <div className="flex gap-3 w-full">
                                    <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                                    <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Container>
    )
}
