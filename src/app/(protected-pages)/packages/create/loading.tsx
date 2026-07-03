import Container from '@/components/shared/Container'
import Skeleton from '@/components/ui/Skeleton'

export default function Loading() {
    return (
        <Container>
            <div className="max-w-4xl mx-auto w-full pb-8">
                {/* Header */}
                <div className="mb-8">
                    <Skeleton height={32} width={192} className="mb-2" />
                    <Skeleton height={16} width={384} />
                </div>

                {/* Form fields skeleton */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                    <div className="space-y-6">
                        <div>
                            <Skeleton height={20} width={128} className="mb-2" />
                            <Skeleton height={40} width="100%" />
                        </div>
                        
                        <div>
                            <Skeleton height={20} width={160} className="mb-2" />
                            <Skeleton height={96} width="100%" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Skeleton height={20} width={112} className="mb-2" />
                                <Skeleton height={40} width="100%" />
                            </div>
                            <div>
                                <Skeleton height={20} width={112} className="mb-2" />
                                <Skeleton height={40} width="100%" />
                            </div>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6 flex justify-end gap-3">
                            <Skeleton height={40} width={96} className="rounded-md" />
                            <Skeleton height={40} width={128} className="rounded-md" />
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    )
}
