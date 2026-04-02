'use client'
import { useMemo, useState } from 'react'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import DataTable from '@/components/shared/DataTable'
import { useInvoiceListStore } from '../_store/invoiceListStore'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import { TbCloudDownload } from 'react-icons/tb'
import dayjs from 'dayjs'
import { NumericFormat } from 'react-number-format'
import type { OnSortParam, ColumnDef } from '@/components/shared/DataTable'
import type { Invoice } from '../types'

type InvoiceListTableProps = {
    invoiceListTotal: number
    pageIndex?: number
    pageSize?: number
}

const invoiceStatusColor: Record<
    string,
    {
        bgClass: string
        textClass: string
    }
> = {
    unpaid: {
        bgClass: 'bg-error-subtle',
        textClass: 'text-error',
    },
    paid: {
        bgClass: 'bg-success-subtle',
        textClass: 'text-success',
    },
    sent: {
        bgClass: 'bg-blue-100 dark:bg-blue-900/30',
        textClass: 'text-blue-700 dark:text-blue-200',
    },
    default: {
        bgClass: 'bg-gray-100 dark:bg-gray-700',
        textClass: 'text-gray-600 dark:text-gray-200',
    },
}

const ActionColumn = ({ row }: { row: Invoice }) => {
    const [downloading, setDownloading] = useState(false)

    const onDownload = async () => {
        try {
            setDownloading(true)
            const response = await fetch(`/api/client/invoices/${row.id}/pdf`, {
                method: 'GET',
            })

            if (!response.ok) {
                let errorMessage = 'Failed to download invoice PDF'
                try {
                    const errorJson = await response.json()
                    if (errorJson?.message) {
                        errorMessage = errorJson.message
                    }
                } catch {
                    // Ignore json parsing error if the content is not json
                }
                toast.push(
                    <Notification type="danger" title="Download Failed">
                        {errorMessage}
                    </Notification>,
                    { placement: 'top-center' }
                )
                return
            }

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `Invoice_${row.invoiceNumber || row.id}.pdf`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
        } catch (error) {
            toast.push(
                <Notification type="danger" title="Error">
                    Something went wrong while downloading.
                </Notification>,
                { placement: 'top-center' }
            )
        } finally {
            setDownloading(false)
        }
    }

    return (
        <div className="flex justify-center text-lg gap-1">
            <Tooltip wrapperClass="flex" title="Download PDF file">
                <span
                    className={`cursor-pointer p-2 text-primary hover:opacity-80 ${downloading ? 'opacity-50 pointer-events-none' : ''}`}
                    onClick={onDownload}
                >
                    <TbCloudDownload />
                </span>
            </Tooltip>
        </div>
    )
}

const InvoiceListTable = ({
    invoiceListTotal,
    pageIndex = 1,
    pageSize = 10,
}: InvoiceListTableProps) => {
    const invoiceList = useInvoiceListStore((state) => state.invoiceList)
    const initialLoading = useInvoiceListStore((state) => state.initialLoading)
    const statusOptions = useInvoiceListStore((state) => state.statusOptions)

    const { onAppendQueryParams } = useAppendQueryParams()

    const statusLabelMap = useMemo(() => {
        const entries: [string, string][] = statusOptions.map((option) => [
            option.key.toLowerCase(),
            option.name,
        ])
        return new Map(entries)
    }, [statusOptions])

    const columns: ColumnDef<Invoice>[] = useMemo(
        () => [
            {
                header: 'Invoice',
                accessorKey: 'invoiceNumber',
                cell: (props) => (
                    <span className="font-bold heading-text block">
                        #{props.row.original.invoiceNumber}
                    </span>
                ),
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
                                Math.round(Number(totalAmount) * 100) / 100
                            ).toFixed(2)}
                            prefix={'₹'}
                            thousandSeparator={true}
                        />
                    )
                },
            },
            {
                header: 'Date',
                accessorKey: 'createdAt',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="font-semibold block">
                            {dayjs(row.createdAt).format('DD/MM/YYYY')}
                        </span>
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
                        invoiceStatusColor[normalized] ||
                        invoiceStatusColor.default
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
                header: <span className="block text-center">Actions</span>,
                id: 'action',
                cell: (props) => <ActionColumn row={props.row.original} />,
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                data={invoiceList}
                noData={invoiceList.length === 0}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ width: 28, height: 28 }}
                loading={initialLoading}
                pagingData={{
                    total: invoiceListTotal,
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

export default InvoiceListTable
