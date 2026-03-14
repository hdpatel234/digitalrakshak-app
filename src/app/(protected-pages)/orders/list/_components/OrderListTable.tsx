'use client'
import { useMemo } from 'react'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import { useOrderListStore } from '../_store/orderListStore'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import { useRouter } from 'next/navigation'
import {
    TbEye,
    TbCreditCard,
    TbBrandPaypal,
    TbCash,
    TbBuildingBank,
    TbWallet,
    TbDeviceMobile,
    TbQrcode,
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
    number,
    {
        label: string
        bgClass: string
        textClass: string
    }
> = {
    0: {
        label: 'Paid',
        bgClass: 'bg-success-subtle',
        textClass: 'text-success',
    },
    1: {
        label: 'Pending',
        bgClass: 'bg-warning-subtle',
        textClass: 'text-warning',
    },
    2: { label: 'Failed', bgClass: 'bg-error-subtle', textClass: 'text-error' },
}

const OrderColumn = ({ row }: { row: Order }) => {
    const router = useRouter()

    const onView = () => {
        router.push(`/orders/details/${row.id}`)
    }

    return (
        <span
            className="cursor-pointer font-bold heading-text hover:text-primary text-center block"
            onClick={onView}
        >
            #{row.id}
        </span>
    )
}

const ActionColumn = ({ row }: { row: Order }) => {
    const router = useRouter()

    const onView = () => {
        router.push(`/orders/details/${row.id}`)
    }

    const onMakePayment = () => {
        router.push(`/orders/details/${row.id}?action=payment`)
    }

    return (
        <div className="flex justify-center text-lg gap-1">
            <Tooltip wrapperClass="flex" title="View">
                <span className="cursor-pointer p-2" onClick={onView}>
                    <TbEye />
                </span>
            </Tooltip>
            <Tooltip wrapperClass="flex" title="Make payment">
                <span className="cursor-pointer p-2" onClick={onMakePayment}>
                    <TbCreditCard />
                </span>
            </Tooltip>
        </div>
    )
}

const PaymentMethodImage = ({
    paymentMehod,
    className,
}: {
    paymentMehod: string
    className: string
}) => {
    const normalized = paymentMehod
        .toLowerCase()
        .replace(/_/g, '-')
        .replace(/\s+/g, '-')
        .trim()

    switch (normalized) {
        case 'credit-card':
        case 'debit-card':
        case 'card':
            return <TbCreditCard className={className} />
        case 'paypal':
            return <TbBrandPaypal className={className} />
        case 'cash':
            return <TbCash className={className} />
        case 'bank':
        case 'bank-transfer':
        case 'net-banking':
        case 'netbanking':
            return <TbBuildingBank className={className} />
        case 'wallet':
        case 'mobile-wallet':
            return <TbWallet className={className} />
        case 'upi':
        case 'qrcode':
        case 'qr-code':
            return <TbQrcode className={className} />
        case 'mobile':
        case 'mobile-payment':
            return <TbDeviceMobile className={className} />
        default:
            return <TbCreditCard className={className} />
    }
}

const OrderListTable = ({
    orderListTotal,
    pageIndex = 1,
    pageSize = 10,
}: OrderListTableProps) => {
    const orderList = useOrderListStore((state) => state.orderList)
    const initialLoading = useOrderListStore((state) => state.initialLoading)

    const { onAppendQueryParams } = useAppendQueryParams()

    const columns: ColumnDef<Order>[] = useMemo(
        () => [
            {
                header: <span className="block text-center">Order</span>,
                accessorKey: 'id',
                cell: (props) => <OrderColumn row={props.row.original} />,
            },
            {
                header: (
                    <span className="block text-center">Payment Method</span>
                ),
                accessorKey: 'paymentMehod',
                cell: (props) => {
                    const { paymentMehod, paymentIdendifier } =
                        props.row.original
                    return (
                        <span className="flex items-center justify-center gap-2">
                            <PaymentMethodImage
                                className="text-xl"
                                paymentMehod={paymentMehod}
                            />
                            <span className="font-semibold">
                                {paymentIdendifier}
                            </span>
                        </span>
                    )
                },
            },
            {
                header: <span className="block text-center">Total</span>,
                accessorKey: 'totalAmount',
                cell: (props) => {
                    const { totalAmount } = props.row.original
                    return (
                        <NumericFormat
                            className="heading-text font-bold text-center block"
                            displayType="text"
                            value={(
                                Math.round(totalAmount * 100) / 100
                            ).toFixed(2)}
                            prefix={'$'}
                            thousandSeparator={true}
                        />
                    )
                },
            },
            {
                header: <span className="block text-center">Status</span>,
                accessorKey: 'status',
                cell: (props) => {
                    const { status } = props.row.original
                    return (
                        <div className="flex justify-center">
                            <Tag className={orderStatusColor[status].bgClass}>
                                <span
                                    className={`capitalize font-semibold ${orderStatusColor[status].textClass}`}
                                >
                                    {orderStatusColor[status].label}
                                </span>
                            </Tag>
                        </div>
                    )
                },
            },
            {
                header: <span className="block text-center">Date</span>,
                accessorKey: 'date',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="font-semibold text-center block">
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
