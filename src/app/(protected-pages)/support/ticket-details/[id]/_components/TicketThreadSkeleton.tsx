import React from 'react'
import Skeleton from '@/components/ui/Skeleton'
import Card from '@/components/ui/Card'

const TicketThreadSkeleton = () => {
    return (
        <div className="flex flex-col gap-6">
            {[1, 2, 3].map((item) => (
                <div
                    key={item}
                    className={`flex gap-4 w-full ${
                        item % 2 === 0 ? 'flex-row-reverse' : 'flex-row'
                    }`}
                >
                    <div className="flex-shrink-0">
                        <Skeleton variant="circle" width={40} height={40} />
                    </div>
                    <div
                        className={`flex flex-col w-full max-w-[85%] sm:max-w-[75%] ${
                            item % 2 === 0 ? 'items-end' : 'items-start'
                        }`}
                    >
                        <div
                            className={`flex items-center gap-2 mb-1 ${
                                item % 2 === 0 ? 'flex-row-reverse' : 'flex-row'
                            }`}
                        >
                            <Skeleton width={100} height={12} />
                            <Skeleton width={60} height={10} />
                        </div>
                        <Card className="w-full border-none shadow-sm">
                            <div className="flex flex-col gap-2">
                                <Skeleton width="90%" height={12} />
                                <Skeleton width="70%" height={12} />
                                <Skeleton width="40%" height={12} />
                            </div>
                        </Card>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default TicketThreadSkeleton
