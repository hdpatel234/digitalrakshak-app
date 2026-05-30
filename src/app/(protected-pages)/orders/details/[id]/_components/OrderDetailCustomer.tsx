'use client'

import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import IconText from '@/components/shared/IconText'
import { TbReceipt, TbCalendarTime, TbBuilding, TbRefresh, TbCheck, TbAlertTriangle, TbSettings } from 'react-icons/tb'
import dayjs from 'dayjs'
import type { Order } from '../types'

type OrderDetailCustomerProps = {
    order: Order
}

const syncStatusColorMap: Record<
    string,
    {
        label: string
        bgClass: string
        textClass: string
        icon: React.ReactNode
    }
> = {
    synced: {
        label: 'Synced',
        bgClass: 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20',
        textClass: 'text-emerald-600 dark:text-emerald-400',
        icon: <TbCheck className="text-sm" />,
    },
    pending: {
        label: 'Pending Sync',
        bgClass: 'bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20',
        textClass: 'text-amber-600 dark:text-amber-400',
        icon: <TbRefresh className="text-sm animate-spin" />,
    },
    failed: {
        label: 'Sync Failed',
        bgClass: 'bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20',
        textClass: 'text-rose-600 dark:text-rose-400',
        icon: <TbAlertTriangle className="text-sm" />,
    },
}

const getSyncStatusConfig = (status: string) => {
    const s = (status || '').toLowerCase()
    return (
        syncStatusColorMap[s] || {
            label: status || 'Pending',
            bgClass: 'bg-slate-50 dark:bg-slate-500/10 border border-slate-200 dark:border-slate-500/20',
            textClass: 'text-slate-600 dark:text-slate-400',
            icon: <TbRefresh className="text-sm" />,
        }
    )
}

const OrderDetailCustomer = ({ order }: OrderDetailCustomerProps) => {
    const syncConfig = getSyncStatusConfig(order.billing_sync_status)

    return (
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
            <h5 className="font-bold mb-4">Billing & Invoicing</h5>
            
            {/* Sync Banner Status */}
            <div className={`rounded-xl p-4 border mb-5 flex items-start gap-3 ${syncConfig.bgClass}`}>
                <div className={`rounded-full p-1.5 text-white ${
                    order.billing_sync_status === 'synced' 
                        ? 'bg-emerald-500' 
                        : order.billing_sync_status === 'failed' 
                        ? 'bg-rose-500' 
                        : 'bg-amber-500'
                }`}>
                    {syncConfig.icon}
                </div>
                <div>
                    <div className={`font-bold text-xs uppercase tracking-wider ${syncConfig.textClass}`}>
                        Billing {syncConfig.label}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                        {order.billing_sync_status === 'synced'
                            ? 'The invoicing ledger has been successfully generated and synchronized with your external accounting ERP software.'
                            : order.billing_sync_message || 'Awaiting synchronization process queue or manual approval verification.'}
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {/* Client context */}
                <IconText
                    className="text-sm text-gray-600 dark:text-gray-400"
                    icon={<TbBuilding className="text-lg text-gray-400 dark:text-gray-500" />}
                >
                    <div className="flex flex-col ml-1">
                        <span className="text-[10px] text-gray-400 font-normal">Client Reference Context</span>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                            Client Account ID: #{order.client_id}
                        </span>
                    </div>
                </IconText>

                <hr className="border-gray-100 dark:border-gray-800 my-1" />

                {/* Invoice Number */}
                <IconText
                    className="text-sm text-gray-600 dark:text-gray-400"
                    icon={<TbReceipt className="text-lg text-gray-400 dark:text-gray-500" />}
                >
                    <div className="flex flex-col ml-1">
                        <span className="text-[10px] text-gray-400 font-normal">Invoice Reference Code</span>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                            {order.invoice_number ? `INV-${order.invoice_number}` : 'Awaiting Invoice Generation'}
                        </span>
                    </div>
                </IconText>

                <hr className="border-gray-100 dark:border-gray-800 my-1" />

                {/* Billing Configuration */}
                <IconText
                    className="text-sm text-gray-600 dark:text-gray-400"
                    icon={<TbSettings className="text-lg text-gray-400 dark:text-gray-500" />}
                >
                    <div className="flex flex-col ml-1">
                        <span className="text-[10px] text-gray-400 font-normal">Billing Configuration Context</span>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                            Config ID: #{order.billing_config_id}
                        </span>
                    </div>
                </IconText>

                <hr className="border-gray-100 dark:border-gray-800 my-1" />

                {/* Generation Date */}
                <IconText
                    className="text-sm text-gray-600 dark:text-gray-400"
                    icon={<TbCalendarTime className="text-lg text-gray-400 dark:text-gray-500" />}
                >
                    <div className="flex flex-col ml-1">
                        <span className="text-[10px] text-gray-400 font-normal">Invoicing Date</span>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                            {order.invoice_generated_at
                                ? dayjs(order.invoice_generated_at).format('DD MMMM YYYY, hh:mm A')
                                : 'Pending Invoice Generation'}
                        </span>
                    </div>
                </IconText>
            </div>
        </Card>
    )
}

export default OrderDetailCustomer
