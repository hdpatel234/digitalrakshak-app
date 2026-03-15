'use client'
import { useMemo } from 'react'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import { useOrderListStore } from '../_store/orderListStore'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import { useRouter } from 'next/navigation'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { startOrderPaymentFlow } from '@/utils/payments/orderPaymentFlow'
import {
    TbEye,
    TbCreditCard,
    TbPencil,
} from 'react-icons/tb'
import dayjs from 'dayjs'
import { NumericFormat } from 'react-number-format'
import type { OnSortParam, ColumnDef } from '@/components/shared/DataTable'
import type { Order } from '../types'

type OrderListTableProps = {
    orderListTotal: number
    pageIndex?: number
    pageSize?: number
}

const orderStatusColor: Record<
    string,
    {
        bgClass: string
        textClass: string
    }
> = {
    draft: {
        bgClass: 'bg-gray-100 dark:bg-gray-700',
        textClass: 'text-gray-600 dark:text-gray-200',
    },
    pending: {
        bgClass: 'bg-warning-subtle',
        textClass: 'text-warning',
    },
    confirmed: {
        bgClass: 'bg-blue-100 dark:bg-blue-900/30',
        textClass: 'text-blue-700 dark:text-blue-200',
    },
    processing: {
        bgClass: 'bg-indigo-100 dark:bg-indigo-900/30',
        textClass: 'text-indigo-700 dark:text-indigo-200',
    },
    completed: {
        bgClass: 'bg-success-subtle',
        textClass: 'text-success',
    },
    cancelled: {
        bgClass: 'bg-error-subtle',
        textClass: 'text-error',
    },
    default: {
        bgClass: 'bg-gray-100 dark:bg-gray-700',
        textClass: 'text-gray-600 dark:text-gray-200',
    },
}

const OrderColumn = ({ row }: { row: Order }) => {
    const router = useRouter()

    const onView = () => {
        router.push(`/orders/details/${row.id}`)
    }

    return (
        <span
            className="cursor-pointer font-bold heading-text hover:text-primary block"
            onClick={onView}
        >
            #{row.displayId}
        </span>
    )
}

const ActionColumn = ({ row }: { row: Order }) => {
    const router = useRouter()
    const statusKey = row.status
    const isDraft = statusKey === 'draft'
    const isPending = statusKey === 'pending'

    const onView = () => {
        router.push(`/orders/details/${row.id}`)
    }

    const onEdit = () => {
        router.push(`/orders/create?orderId=${row.id}`)
    }

    const onMakePayment = () => {
        void (async () => {
            const handled = await startOrderPaymentFlow({
                orderId: row.id,
                fetchOrderDetails: true,
                onInitError: (message) => {
                    toast.push(
                        <Notification type="danger">{message}</Notification>,
                        { placement: 'top-center' },
                    )
                },
                onVerificationSuccess: (message) => {
                    toast.push(
                        <Notification type="success">{message}</Notification>,
                        { placement: 'top-center' },
                    )
                    router.push('/orders/list')
                },
                onVerificationError: (message) => {
                    toast.push(
                        <Notification type="danger">{message}</Notification>,
                        { placement: 'top-center' },
                    )
                    router.push('/orders/list')
                },
                onDismiss: () => {
                    router.push('/orders/list')
                },
            })

            if (!handled) {
                router.push(`/orders/details/${row.id}?action=payment`)
            }
        })()
    }

    return (
        <div className="flex justify-center text-lg gap-1">
            <Tooltip wrapperClass="flex" title="View">
                <span className="cursor-pointer p-2" onClick={onView}>
                    <TbEye />
                </span>
            </Tooltip>
            {isDraft && (
                <Tooltip wrapperClass="flex" title="Edit">
                    <span className="cursor-pointer p-2" onClick={onEdit}>
                        <TbPencil />
                    </span>
                </Tooltip>
            )}
            {isPending && (
                <Tooltip wrapperClass="flex" title="Make payment">
                    <span
                        className="cursor-pointer p-2"
                        onClick={onMakePayment}
                    >
                        <TbCreditCard />
                    </span>
                </Tooltip>
            )}
        </div>
    )
}

const OrderListTable = ({
    orderListTotal,
    pageIndex = 1,
    pageSize = 10,
}: OrderListTableProps) => {
    const orderList = useOrderListStore((state) => state.orderList)
    const initialLoading = useOrderListStore((state) => state.initialLoading)
    const statusOptions = useOrderListStore((state) => state.statusOptions)

    const { onAppendQueryParams } = useAppendQueryParams()

    const statusLabelMap = useMemo(() => {
        const entries = statusOptions.map((option) => [
            option.key.toLowerCase(),
            option.name,
        ])
        return new Map(entries)
    }, [statusOptions])

    const columns: ColumnDef<Order>[] = useMemo(
        () => [
            {
                header: 'Order',
                accessorKey: 'id',
                cell: (props) => <OrderColumn row={props.row.original} />,
            },
            {
                header: 'Payment',
                accessorKey: 'paymentId',
                cell: (props) => {
                    const { paymentGatewayName, paymentId, paymentStatus } =
                        props.row.original
                    const isPending =
                        paymentStatus.trim().toLowerCase() === 'pending'
                    if (isPending || !paymentId || paymentId === '-') {
                        return <span className="font-semibold">-</span>
                    }
                    const label = paymentGatewayName
                        ? `${paymentGatewayName} (${paymentId})`
                        : paymentId
                    return <span className="font-semibold">{label}</span>
                },
            },
            {
                header: 'Total',
                accessorKey: 'totalAmount',
                cell: (props) => {
                    const { totalAmount } = props.row.original
                    return (
                        <NumericFormat
                            className="heading-text font-bold block"
                            displayType="text"
                            value={(
                                Math.round(totalAmount * 100) / 100
                            ).toFixed(2)}
                            prefix={'₹'}
                            thousandSeparator={true}
                        />
                    )
                },
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (props) => {
                    const { status } = props.row.original
                    const normalized = status.trim().toLowerCase()
                    const label =
                        statusLabelMap.get(normalized) ||
                        (normalized ? normalized : '-')
                    const style =
                        orderStatusColor[normalized] ||
                        orderStatusColor.default
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
            {
                header: 'Date',
                accessorKey: 'date',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="font-semibold block">
                            {dayjs.unix(row.date).format('DD/MM/YYYY')}
                        </span>
                    )
                },
            },
            {
                header: <span className="block text-center">Actions</span>,
                id: 'action',
                cell: (props) => <ActionColumn row={props.row.original} />,
            },
        ],
        [],
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
                data={orderList}
                noData={orderList.length === 0}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ width: 28, height: 28 }}
                loading={initialLoading}
                pagingData={{
                    total: orderListTotal,
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

export default OrderListTable
