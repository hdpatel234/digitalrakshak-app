'use client'

import { useMemo } from 'react'
import Tag from '@/components/ui/Tag'
import DataTable from '@/components/shared/DataTable'
import { useTransactionListStore } from '../_store/transactionListStore'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import dayjs from 'dayjs'
import { NumericFormat } from 'react-number-format'
import type { OnSortParam, ColumnDef } from '@/components/shared/DataTable'
import type { Transaction } from '../types'

type TransactionListTableProps = {
    transactionListTotal: number
    pageIndex?: number
    pageSize?: number
}

const statusColorMap: Record<
    string,
    {
        bgClass: string
        textClass: string
    }
> = {
    completed: {
        bgClass: 'bg-success-subtle',
        textClass: 'text-success',
    },
    failed: {
        bgClass: 'bg-error-subtle',
        textClass: 'text-error',
    },
    pending: {
        bgClass: 'bg-warning-subtle',
        textClass: 'text-warning',
    },
    default: {
        bgClass: 'bg-gray-100 dark:bg-gray-700',
        textClass: 'text-gray-600 dark:text-gray-200',
    },
}

const TransactionListTable = ({
    transactionListTotal,
    pageIndex = 1,
    pageSize = 10,
}: TransactionListTableProps) => {
    const transactionList = useTransactionListStore((state) => state.transactionList)
    const initialLoading = useTransactionListStore((state) => state.initialLoading)
    const statusOptions = useTransactionListStore((state) => state.statusOptions)

    const { onAppendQueryParams } = useAppendQueryParams()

    const statusLabelMap = useMemo(() => {
        const entries: [string, string][] = statusOptions.map((option) => [
            option.key.toLowerCase(),
            option.name,
        ])
        return new Map(entries)
    }, [statusOptions])

    const columns: ColumnDef<Transaction>[] = useMemo(
        () => [
            {
                header: 'Invoice ID',
                accessorKey: 'invoiceId',
                cell: (props) => {
                    const { invoice, invoiceId } = props.row.original
                    const invoiceNumber = (invoice as any)?.invoice_number
                    return (
                        <span className="font-bold heading-text block">
                            {invoiceNumber ? `#${invoiceNumber}` : invoiceId || 'N/A'}
                        </span>
                    )
                },
            },
            {
                header: 'Transaction ID',
                accessorKey: 'transactionUuid',
                cell: (props) => {
                    const {
                        gatewayPaymentId,
                        gatewayTransactionId,
                        transactionUuid,
                    } = props.row.original
                    return (
                        <span className="font-bold heading-text block">
                            {gatewayPaymentId ||
                                gatewayTransactionId ||
                                transactionUuid ||
                                'N/A'}
                        </span>
                    )
                },
            },
            {
                header: 'Amount',
                accessorKey: 'amount',
                cell: (props) => {
                    const { amount, currency } = props.row.original
                    return (
                        <NumericFormat
                            className="heading-text font-bold block"
                            displayType="text"
                            value={(
                                Math.round(Number(amount) * 100) / 100
                            ).toFixed(2)}
                            prefix={currency === 'INR' ? '₹' : '$'}
                            thousandSeparator={true}
                        />
                    )
                },
            },
            {
                header: 'Gateway',
                accessorKey: 'gatewayConfig',
                cell: (props) => {
                    const { gatewayConfig } = props.row.original
                    return (
                        <span className="font-semibold block">
                            {(gatewayConfig?.config_name as string) || 'N/A'}
                        </span>
                    )
                },
            },
            {
                header: 'Method',
                accessorKey: 'paymentMethod',
                cell: (props) => (
                    <span className="font-semibold block capitalize">
                        {props.row.original.paymentMethod ||
                            (props.row.original.methodType
                                ?.method_name as string) ||
                            'N/A'}
                    </span>
                ),
            },
            {
                header: 'Date',
                accessorKey: 'createdAt',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="font-semibold block">
                            {dayjs(row.createdAt).format('DD/MM/YYYY hh:mm A')}
                        </span>
                    )
                },
            },
            {
                header: 'Payment Status',
                accessorKey: 'paymentStatus',
                cell: (props) => {
                    const { paymentStatus } = props.row.original
                    const normalized = (paymentStatus || '')
                        .trim()
                        .toLowerCase()
                    const label =
                        statusLabelMap.get(normalized) ||
                        (normalized ? normalized : '-')
                    const style =
                        statusColorMap[normalized] || statusColorMap.default
                    return (
                        <div className="">
                            <Tag className={style.bgClass}>
                                <span
                                    className={`capitalize font-semibold ${style.textClass}`}
                                >
                                    {label}
                                </span>
                            </Tag>
                        </div>
                    )
                },
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [statusLabelMap],
    )

    const handlePaginationChange = (page: number) => {
        onAppendQueryParams({
            pageIndex: String(page),
        })
    }

    const handleSelectChange = (value: number) => {
        onAppendQueryParams({
            pageSize: String(value),
            pageIndex: '1',
        })
    }

    const handleSort = (sort: OnSortParam) => {
        onAppendQueryParams({
            order: sort.order,
            sortKey: sort.key,
        })
    }

    return (
        <>
            <DataTable
                columns={columns}
                data={transactionList}
                noData={transactionList.length === 0}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ width: 28, height: 28 }}
                loading={initialLoading}
                pagingData={{
                    total: transactionListTotal,
                    pageIndex,
                    pageSize,
                }}
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                onSort={handleSort}
            />
        </>
    )
}

export default TransactionListTable
