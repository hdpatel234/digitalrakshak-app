import Container from '@/components/shared/Container'
import Skeleton from '@/components/ui/Skeleton'

export default function Loading() {
    return (
        <Container>
            <div className="max-w-7xl mx-auto w-full pb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <Skeleton height={32} width={256} className="mb-2" />
                        <Skeleton height={20} width={384} />
                    </div>
                    <Skeleton height={40} width={144} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm flex flex-col h-full bg-white dark:bg-gray-800">
                            <div className="flex justify-between items-start mb-4">
                                <Skeleton height={24} width="50%" />
                                <Skeleton height={32} width={32} className="rounded-md" />
                            </div>
                            
                            <Skeleton height={16} width="100%" className="mb-2" />
                            <Skeleton height={16} width="75%" className="mb-5" />
                            
                            <div className="border-b border-gray-200 dark:border-gray-700 w-full mb-4"></div>
                            
                            <div className="flex gap-2 mb-6">
                                <Skeleton height={24} width={64} className="rounded-md" />
                                <Skeleton height={24} width={80} className="rounded-md" />
                            </div>
                            
                            <div className="mt-auto">
                                <div className="flex justify-between items-center mb-4">
                                    <Skeleton height={20} width={96} />
                                    <Skeleton height={24} width={80} />
                                </div>
                                <div className="flex gap-3 w-full">
                                    <Skeleton height={36} width="100%" className="rounded-md" />
                                    <Skeleton height={36} width="100%" className="rounded-md" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Container>
    )
}
