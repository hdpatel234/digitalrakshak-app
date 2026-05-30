'use client'

import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import Timeline from '@/components/ui/Timeline'
import Badge from '@/components/ui/Badge'
import { TbCalendarCheck, TbCircleCheck, TbLoader, TbAlertCircle } from 'react-icons/tb'
import dayjs from 'dayjs'
import type { Order } from '../types'

type OrderDetailsActivitiesProps = {
    order: Order
}

const statusTextMap: Record<
    string,
    {
        label: string
        bgClass: string
        textClass: string
    }
> = {
    processing: {
        label: 'Processing',
        bgClass: 'bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20',
        textClass: 'text-blue-600 dark:text-blue-400',
    },
    completed: {
        label: 'Fulfilled',
        bgClass: 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20',
        textClass: 'text-emerald-600 dark:text-emerald-400',
    },
    cancelled: {
        label: 'Cancelled',
        bgClass: 'bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20',
        textClass: 'text-rose-600 dark:text-rose-400',
    },
}

const getOrderStatusConfig = (status: string) => {
    const s = (status || '').toLowerCase()
    return (
        statusTextMap[s] || {
            label: status,
            bgClass: 'bg-slate-50 dark:bg-slate-500/10 border border-slate-200 dark:border-slate-500/20',
            textClass: 'text-slate-600 dark:text-slate-400',
        }
    )
}

const OrderDetailsActivities = ({ order }: OrderDetailsActivitiesProps) => {
    const statusConfig = getOrderStatusConfig(order.status)
    const isCancelled = order.status.toLowerCase() === 'cancelled'
    const isCompleted = order.status.toLowerCase() === 'completed'
    const isProcessing = order.status.toLowerCase() === 'processing'

    // Formulate key milestone event logs
    const milestones = [
        {
            title: 'Order Placed',
            description: 'Order created and registered under billing configs.',
            time: order.order_date,
            isDone: true,
            iconClass: 'bg-indigo-500',
            icon: <TbCalendarCheck className="text-white text-sm" />,
        },
        {
            title: 'Payment & Invoiced',
            description: order.invoice_number
                ? `Invoice #${order.invoice_number} generated. Payment reference: ${order.payment_reference || 'N/A'}`
                : 'Payment processed and verified.',
            time: order.processed_at,
            isDone: !!order.processed_at,
            iconClass: 'bg-emerald-500',
            icon: <TbCircleCheck className="text-white text-sm" />,
        },
        {
            title: 'Verification Screening',
            description: isProcessing
                ? 'Candidate background screening profiles are actively in progress.'
                : isCompleted
                ? 'All background checks and verifications have finished.'
                : 'Verification screening initialization.',
            time: order.processed_at, // Started at processing time
            isDone: isProcessing || isCompleted,
            iconClass: isProcessing ? 'bg-blue-500 animate-pulse' : 'bg-emerald-500',
            icon: isProcessing ? (
                <TbLoader className="text-white text-sm animate-spin" />
            ) : (
                <TbCircleCheck className="text-white text-sm" />
            ),
        },
    ]

    // Cancelled milestone if applicable
    if (isCancelled) {
        milestones.push({
            title: 'Order Cancelled',
            description: order.cancellation_reason || 'This order was cancelled by support or client context.',
            time: order.cancelled_at,
            isDone: true,
            iconClass: 'bg-rose-500',
            icon: <TbAlertCircle className="text-white text-sm" />,
        })
    } else {
        milestones.push({
            title: 'Order Completed',
            description: isCompleted
                ? 'All candidate verifications finished successfully. Reports compiled.'
                : 'Waiting for candidate screening reports completion.',
            time: order.completed_at,
            isDone: isCompleted,
            iconClass: isCompleted ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700',
            icon: <TbCircleCheck className="text-white text-sm" />,
        })
    }

    return (
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 mb-6">
                <div>
                    <h5 className="font-bold">Order Tracking Timeline</h5>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Real-time verification progress and workflow processing timeline milestones.
                    </p>
                </div>
                <Tag className={`${statusConfig.bgClass} ${statusConfig.textClass} font-bold px-2.5 py-1 text-xs rounded-full`}>
                    {statusConfig.label}
                </Tag>
            </div>

            <div className="mt-4 px-2">
                <Timeline>
                    {milestones.map((milestone, idx) => {
                        const hasTime = !!milestone.time
                        const timeText = hasTime
                            ? dayjs(milestone.time).format('DD MMMM YYYY • hh:mm A')
                            : 'Awaiting Milestone'

                        return (
                            <Timeline.Item
                                key={idx}
                                media={
                                    <div className="flex mt-1">
                                        <Badge
                                            className={`flex items-center justify-center rounded-full w-6 h-6 shadow-sm ${
                                                milestone.isDone
                                                    ? milestone.iconClass
                                                    : 'bg-slate-200 dark:bg-slate-800 text-gray-400 dark:text-gray-600'
                                            }`}
                                            innerClass="hidden"
                                        >
                                            {milestone.isDone ? (
                                                milestone.icon
                                            ) : (
                                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600" />
                                            )}
                                        </Badge>
                                    </div>
                                }
                            >
                                <div className="ml-1">
                                    <div className={`text-sm font-bold heading-text ${
                                        milestone.isDone 
                                            ? 'text-gray-900 dark:text-gray-100' 
                                            : 'text-gray-400 dark:text-gray-600'
                                    }`}>
                                        {milestone.title}
                                    </div>
                                    <p className={`text-xs mt-1 ${
                                        milestone.isDone 
                                            ? 'text-gray-650 dark:text-gray-400' 
                                            : 'text-gray-400 dark:text-gray-600 italic'
                                    }`}>
                                        {milestone.description}
                                    </p>
                                    <div className="text-[10px] font-mono text-gray-400 dark:text-gray-500 mt-1.5 uppercase tracking-wide">
                                        {timeText}
                                    </div>
                                </div>
                            </Timeline.Item>
                        )
                    })}
                </Timeline>
            </div>
        </Card>
    )
}

export default OrderDetailsActivities
