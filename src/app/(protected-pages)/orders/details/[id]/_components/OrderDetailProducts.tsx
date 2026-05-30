'use client'

import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import Avatar from '@/components/ui/Avatar'
import { NumericFormat } from 'react-number-format'
import { TbUser, TbMail, TbPhone } from 'react-icons/tb'
import type { Candidate } from '../types'

type OrderDetailProductsProps = {
    candidates: Candidate[]
}

const statusColorMap: Record<
    string,
    {
        label: string
        bgClass: string
        textClass: string
    }
> = {
    completed: {
        label: 'Completed',
        bgClass: 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20',
        textClass: 'text-emerald-600 dark:text-emerald-400',
    },
    pending: {
        label: 'Pending',
        bgClass: 'bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20',
        textClass: 'text-amber-600 dark:text-amber-400',
    },
    processing: {
        label: 'Processing',
        bgClass: 'bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20',
        textClass: 'text-blue-600 dark:text-blue-400',
    },
    'in-progress': {
        label: 'In Progress',
        bgClass: 'bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20',
        textClass: 'text-blue-600 dark:text-blue-400',
    },
}

const getStatusColor = (status: string) => {
    const s = status.toLowerCase()
    return (
        statusColorMap[s] || {
            label: status,
            bgClass: 'bg-slate-50 dark:bg-slate-500/10 border border-slate-200 dark:border-slate-500/20',
            textClass: 'text-slate-600 dark:text-slate-400',
        }
    )
}

const OrderDetailProducts = ({ candidates }: OrderDetailProductsProps) => {
    return (
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h5 className="font-bold">Candidates Ordered</h5>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        List of candidates registered and screened under this order context.
                    </p>
                </div>
                <Tag className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-semibold px-2.5 py-1 text-xs">
                    {candidates?.length || 0} Candidates
                </Tag>
            </div>
            
            <div className="flex flex-col gap-4">
                {(!candidates || candidates.length === 0) && (
                    <div className="text-center py-6 text-gray-400 dark:text-gray-500 text-sm">
                        No candidates listed for this order.
                    </div>
                )}
                {candidates?.map((candidateItem) => {
                    const profile = candidateItem.candidate
                    const fullName = profile
                        ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
                        : ''
                    const displayName = fullName || `Candidate #${candidateItem.candidate_id}`
                    const email = profile?.email || null
                    const phone = profile?.phone || null
                    const statusConfig = getStatusColor(candidateItem.status)

                    // Initials for avatar
                    const initials = profile
                        ? `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase()
                        : `#${candidateItem.candidate_id}`

                    return (
                        <div
                            key={candidateItem.id}
                            className="rounded-xl border border-gray-100 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-800/40 p-4 hover:bg-slate-50 dark:hover:bg-gray-800/80 transition-colors duration-200"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3.5">
                                    <Avatar
                                        shape="round"
                                        size={48}
                                        className="bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-sm shadow-sm"
                                    >
                                        {initials || <TbUser className="text-xl" />}
                                    </Avatar>
                                    <div>
                                        <div className="heading-text font-bold text-gray-900 dark:text-gray-100 text-sm sm:text-base flex items-center gap-2 flex-wrap">
                                            {displayName}
                                            <Tag className={`${statusConfig.bgClass} ${statusConfig.textClass} text-[10px] font-bold px-2 py-0.5 rounded-full capitalize`}>
                                                {statusConfig.label}
                                            </Tag>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                            {email && (
                                                <span className="flex items-center gap-1">
                                                    <TbMail className="text-sm text-gray-400" />
                                                    {email}
                                                </span>
                                            )}
                                            {phone && (
                                                <span className="flex items-center gap-1">
                                                    <TbPhone className="text-sm text-gray-400" />
                                                    {phone}
                                                </span>
                                            )}
                                            {!email && !phone && (
                                                <span className="text-slate-400 dark:text-slate-500 italic">
                                                    No profile contact details available
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-gray-100 dark:border-gray-800 pt-3 sm:pt-0">
                                    <span className="text-xs text-gray-400 dark:text-gray-500 sm:hidden">
                                        Verification Cost
                                    </span>
                                    <div className="text-right">
                                        <div className="heading-text font-bold text-gray-900 dark:text-gray-100 text-base">
                                            <NumericFormat
                                                fixedDecimalScale
                                                prefix="₹"
                                                displayType="text"
                                                value={candidateItem.total_amount}
                                                decimalScale={2}
                                                thousandSeparator={true}
                                            />
                                        </div>
                                        <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                                            Subtotal: ₹{candidateItem.subtotal}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </Card>
    )
}

export default OrderDetailProducts
