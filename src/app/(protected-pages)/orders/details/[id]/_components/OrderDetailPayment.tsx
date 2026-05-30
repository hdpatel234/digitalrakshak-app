'use client'

import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import { NumericFormat } from 'react-number-format'
import { TbCreditCard, TbReceipt, TbInfoCircle, TbActivity, TbCheck, TbAlertCircle, TbHelp } from 'react-icons/tb'
import dayjs from 'dayjs'
import type { Order, PaymentMethod, PaymentGateway, Transaction } from '../types'

type OrderDetailPaymentProps = {
    order: Order
    paymentMethod: PaymentMethod | null
    paymentGateway: PaymentGateway | null
    transactions: Transaction[]
}

const paymentStatusColorMap: Record<
    string,
    {
        label: string
        bgClass: string
        textClass: string
    }
> = {
    paid: {
        label: 'Paid',
        bgClass: 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20',
        textClass: 'text-emerald-600 dark:text-emerald-400',
    },
    pending: {
        label: 'Pending',
        bgClass: 'bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20',
        textClass: 'text-amber-600 dark:text-amber-400',
    },
    unpaid: {
        label: 'Unpaid',
        bgClass: 'bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20',
        textClass: 'text-amber-600 dark:text-amber-400',
    },
    failed: {
        label: 'Failed',
        bgClass: 'bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20',
        textClass: 'text-rose-600 dark:text-rose-400',
    },
}

const getPaymentStatusConfig = (status: string) => {
    const s = (status || '').toLowerCase()
    return (
        paymentStatusColorMap[s] || {
            label: status || 'Unknown',
            bgClass: 'bg-slate-50 dark:bg-slate-500/10 border border-slate-200 dark:border-slate-500/20',
            textClass: 'text-slate-600 dark:text-slate-400',
        }
    )
}

const OrderDetailPayment = ({
    order,
    paymentMethod,
    paymentGateway,
    transactions,
}: OrderDetailPaymentProps) => {
    const paymentStatusConfig = getPaymentStatusConfig(order.payment_status)

    return (
        <div className="flex flex-col gap-6">
            {/* Billing Summary & Payment Info */}
            <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 mb-6">
                    <div>
                        <h5 className="font-bold">Payment Summary</h5>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Subtotal, taxes, and general payment transaction configurations.
                        </p>
                    </div>
                    <Tag className={`${paymentStatusConfig.bgClass} ${paymentStatusConfig.textClass} font-bold px-3 py-1 text-xs rounded-full`}>
                        {paymentStatusConfig.label}
                    </Tag>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left: Summary Breakdown */}
                    <div className="flex flex-col gap-4 border-r border-gray-100 dark:border-gray-800 pr-0 md:pr-6">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                            <span className="font-semibold text-gray-800 dark:text-gray-200">
                                <NumericFormat
                                    fixedDecimalScale
                                    prefix="₹"
                                    displayType="text"
                                    value={order.subtotal}
                                    decimalScale={2}
                                    thousandSeparator={true}
                                />
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Discount</span>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                - <NumericFormat
                                    fixedDecimalScale
                                    prefix="₹"
                                    displayType="text"
                                    value={order.discount_amount}
                                    decimalScale={2}
                                    thousandSeparator={true}
                                />
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">
                                Tax ({order.tax_percentage}%)
                            </span>
                            <span className="font-semibold text-gray-800 dark:text-gray-200">
                                <NumericFormat
                                    fixedDecimalScale
                                    prefix="₹"
                                    displayType="text"
                                    value={order.tax_amount}
                                    decimalScale={2}
                                    thousandSeparator={true}
                                />
                            </span>
                        </div>
                        <div className="border-t border-dashed border-gray-100 dark:border-gray-800 my-2 pt-3 flex items-center justify-between">
                            <span className="heading-text font-bold text-gray-900 dark:text-gray-100">
                                Grand Total
                            </span>
                            <span className="heading-text font-bold text-lg text-indigo-600 dark:text-indigo-400">
                                <NumericFormat
                                    fixedDecimalScale
                                    prefix="₹"
                                    displayType="text"
                                    value={order.total_amount}
                                    decimalScale={2}
                                    thousandSeparator={true}
                                />
                            </span>
                        </div>
                    </div>

                    {/* Right: Payment Gateway & Method */}
                    <div className="flex flex-col justify-between">
                        <div>
                            <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                                Payment Details
                            </div>
                            
                            {paymentMethod ? (
                                <div className="flex items-start gap-3 rounded-xl bg-slate-50 dark:bg-gray-800/40 p-3 border border-gray-100 dark:border-gray-800">
                                    <div className="bg-indigo-500 text-white rounded-lg p-2 mt-0.5 shadow-sm">
                                        <TbCreditCard className="text-lg" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-800 dark:text-gray-200 text-sm">
                                            {paymentMethod.method_name} ({paymentMethod.method_code.toUpperCase()})
                                        </div>
                                        <div className="text-xs text-gray-500 mt-0.5">
                                            Category: {paymentMethod.category || 'N/A'}
                                        </div>
                                        {order.payment_reference && (
                                            <div className="text-xs font-mono text-gray-400 dark:text-gray-500 mt-2 bg-white dark:bg-gray-850 px-1.5 py-0.5 rounded border inline-block">
                                                Ref: {order.payment_reference}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-sm text-gray-500 italic py-2 flex items-center gap-2">
                                    <TbInfoCircle /> No payment method config listed.
                                </div>
                            )}

                            {paymentGateway && (
                                <div className="mt-4 flex items-center gap-3">
                                    {paymentGateway.gateway?.logo ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={paymentGateway.gateway.logo}
                                            alt={paymentGateway.gateway.gateway_name}
                                            className="h-7 w-auto object-contain rounded"
                                        />
                                    ) : (
                                        <div className="font-bold text-sm text-gray-500">
                                            {paymentGateway.gateway?.gateway_name || paymentGateway.config_name}
                                        </div>
                                    )}
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            Gateway Provider
                                        </span>
                                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                            {paymentGateway.config_name} •{' '}
                                            <span className="text-[10px] text-gray-400">
                                                {paymentGateway.environment.toUpperCase()}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {order.invoice_number && (
                            <div className="flex items-center justify-between border-t border-dashed border-gray-100 dark:border-gray-800 pt-3 mt-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                    <TbReceipt className="text-base" /> Invoice: #{order.invoice_number}
                                </span>
                                {order.invoice_generated_at && (
                                    <span>
                                        Gen: {dayjs(order.invoice_generated_at).format('DD MMM YYYY, hh:mm A')}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </Card>

            {/* Transactions Ledgers */}
            <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
                    <div>
                        <h5 className="font-bold">Transaction History</h5>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Live system logs of all processing, success and refund transactions.
                        </p>
                    </div>
                    <Tag className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold px-2 py-0.5 text-[10px]">
                        {transactions?.length || 0} Logs
                    </Tag>
                </div>

                <div className="flex flex-col gap-4">
                    {(!transactions || transactions.length === 0) && (
                        <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm italic flex flex-col items-center justify-center gap-2">
                            <TbActivity className="text-2xl opacity-40" />
                            No transactions captured for this order.
                        </div>
                    )}
                    {transactions?.map((tx) => {
                        const isSuccess = tx.status === 'completed' || tx.payment_status === 'success'
                        const isFailed = tx.status === 'failed' || tx.payment_status === 'failed'
                        
                        return (
                            <div
                                key={tx.id}
                                className="rounded-xl border border-gray-100 dark:border-gray-800/80 bg-slate-50/50 dark:bg-gray-800/20 p-4 hover:border-gray-200 dark:hover:border-gray-700 transition-colors duration-200"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    {/* TX Info */}
                                    <div className="flex items-start gap-3">
                                        <div className={`rounded-full p-2 mt-0.5 shadow-sm text-white ${
                                            isSuccess ? 'bg-emerald-500' : isFailed ? 'bg-rose-500' : 'bg-amber-500'
                                        }`}>
                                            {isSuccess ? (
                                                <TbCheck className="text-base" />
                                            ) : isFailed ? (
                                                <TbAlertCircle className="text-base" />
                                            ) : (
                                                <TbHelp className="text-base" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-mono text-xs font-bold text-gray-800 dark:text-gray-200">
                                                    TX: {tx.transaction_uuid.substring(0, 8)}...
                                                </span>
                                                <Tag className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                                                    isSuccess
                                                        ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                                        : isFailed
                                                        ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400'
                                                        : 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400'
                                                }`}>
                                                    {tx.status || tx.payment_status}
                                                </Tag>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                                {tx.gateway_payment_id && (
                                                    <span>
                                                        <strong className="text-gray-400 font-normal">Pay ID:</strong>{' '}
                                                        <span className="font-mono">{tx.gateway_payment_id}</span>
                                                    </span>
                                                )}
                                                {tx.gateway_order_id && (
                                                    <span>
                                                        <strong className="text-gray-400 font-normal">Order ID:</strong>{' '}
                                                        <span className="font-mono">{tx.gateway_order_id}</span>
                                                    </span>
                                                )}
                                                <span>
                                                    <strong className="text-gray-400 font-normal">IP Address:</strong>{' '}
                                                    <span className="font-mono">{tx.ip_address}</span>
                                                </span>
                                                {tx.initiated_at && (
                                                    <span>
                                                        <strong className="text-gray-400 font-normal">Time:</strong>{' '}
                                                        {dayjs(tx.initiated_at).format('DD MMM YYYY, hh:mm A')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* TX Amount */}
                                    <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-center border-t lg:border-t-0 border-gray-100 dark:border-gray-800 pt-3 lg:pt-0">
                                        <span className="text-xs text-gray-400 dark:text-gray-500 lg:hidden">
                                            Net Transaction Amount
                                        </span>
                                        <div className="text-right">
                                            <div className="font-bold text-gray-900 dark:text-gray-100 text-sm lg:text-base">
                                                <NumericFormat
                                                    fixedDecimalScale
                                                    prefix="₹"
                                                    displayType="text"
                                                    value={tx.amount}
                                                    decimalScale={2}
                                                    thousandSeparator={true}
                                                />
                                            </div>
                                            <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                                                Currency: {tx.currency} • Fee: ₹{tx.fee_amount}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </Card>
        </div>
    )
}

export default OrderDetailPayment
