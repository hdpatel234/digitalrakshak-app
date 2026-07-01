import Container from '@/components/shared/Container'

export default function Loading() {
    return (
        <Container>
            <div className="max-w-4xl mx-auto w-full pb-8 animate-pulse">
                {/* Header */}
                <div className="mb-8">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
                </div>

                {/* Form fields skeleton */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                    <div className="space-y-6">
                        <div>
                            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
                            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                        </div>
                        
                        <div>
                            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-2"></div>
                            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-28 mb-2"></div>
                                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                            </div>
                            <div>
                                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-28 mb-2"></div>
                                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6 flex justify-end gap-3">
                            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    )
}
