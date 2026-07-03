import Container from '@/components/shared/Container'
import Skeleton from '@/components/ui/Skeleton'

export default function Loading() {
    return (
        <Container>
            <div className="max-w-6xl mx-auto w-full pb-8">
                {/* Header */}
                <div className="mb-8">
                    <Skeleton height={32} width={256} className="mb-2" />
                    <Skeleton height={20} width={384} />
                </div>

                {/* Form fields skeleton */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="md:col-span-2 space-y-6">
                            <div>
                                <Skeleton height={20} width={160} className="mb-2" />
                                <Skeleton height={40} width="100%" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Skeleton height={20} width={128} className="mb-2" />
                                    <Skeleton height={40} width="100%" />
                                </div>
                                <div>
                                    <Skeleton height={20} width={128} className="mb-2" />
                                    <Skeleton height={40} width="100%" />
                                </div>
                            </div>
                            <div>
                                <Skeleton height={20} width={160} className="mb-2" />
                                <Skeleton height={96} width="100%" />
                            </div>
                        </div>
                        <div className="md:col-span-1 border-l border-gray-200 dark:border-gray-700 pl-0 md:pl-6 pt-6 md:pt-0 border-t md:border-t-0">
                            <Skeleton height={24} width={192} className="mb-4" />
                            <div className="space-y-4">
                                <Skeleton height={64} width="100%" />
                                <Skeleton height={64} width="100%" />
                                <Skeleton height={64} width="100%" />
                            </div>
                            <div className="mt-8">
                                <Skeleton height={20} width="100%" className="mb-2" />
                                <Skeleton height={28} width="50%" />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-end gap-3">
                        <Skeleton height={40} width={128} className="rounded-md" />
                        <Skeleton height={40} width={160} className="rounded-md" />
                    </div>
                </div>
            </div>
        </Container>
    )
}
