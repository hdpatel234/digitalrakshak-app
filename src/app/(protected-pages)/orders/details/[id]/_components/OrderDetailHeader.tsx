'use client'

import Link from 'next/link'
import Button from '@/components/ui/Button'
import { TbArrowLeft, TbPrinter } from 'react-icons/tb'
import dayjs from 'dayjs'

type OrderDetailHeaderProps = {
    orderNumber: string
    clientOrderNumber: string | null
    orderDate: string
}

const OrderDetailHeader = ({
    orderNumber,
    clientOrderNumber,
    orderDate,
}: OrderDetailHeaderProps) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-5 print:hidden">
            <div className="flex flex-col">
                <Link
                    href="/orders/list"
                    className="group flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-indigo-600 transition-colors duration-200 mb-2"
                >
                    <TbArrowLeft className="text-sm group-hover:-translate-x-0.5 transition-transform duration-200" />
                    Back to Orders List
                </Link>
                <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
                        Order {orderNumber}
                    </h3>
                    {clientOrderNumber && (
                        <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono text-gray-500">
                            Client Ref: {clientOrderNumber}
                        </span>
                    )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Placed on {dayjs(orderDate).format('dddd, DD MMMM YYYY • hh:mm A')}
                </p>
            </div>
            
            {/* Header Actions */}
            <div className="flex items-center gap-2">
                <Button
                    size="sm"
                    className="flex items-center gap-1.5 shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold px-4"
                    onClick={() => window.print()}
                >
                    <TbPrinter className="text-base" /> Print Invoice
                </Button>
            </div>
        </div>
    )
}

export default OrderDetailHeader
