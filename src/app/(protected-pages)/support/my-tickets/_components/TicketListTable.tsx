'use client'

import { useMemo } from 'react'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import { useTicketListStore } from '../_store/ticketListStore'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import { useRouter } from 'next/navigation'
import { TbEye } from 'react-icons/tb'
import dayjs from 'dayjs'
import type { OnSortParam, ColumnDef } from '@/components/shared/DataTable'
import type { Ticket } from './types'

type TicketListTableProps = {
    ticketListTotal: number
    pageIndex?: number
    pageSize?: number
}

const statusColor: Record<
    string,
    {
        bgClass: string
        textClass: string
    }
> = {
    open: {
        bgClass: 'bg-emerald-100 dark:bg-emerald-900/30',
        textClass: 'text-emerald-700 dark:text-emerald-200',
    },
    pending: {
        bgClass: 'bg-warning-subtle',
        textClass: 'text-warning',
    },
    resolved: {
        bgClass: 'bg-blue-100 dark:bg-blue-900/30',
        textClass: 'text-blue-700 dark:text-blue-200',
    },
    closed: {
        bgClass: 'bg-gray-100 dark:bg-gray-700',
        textClass: 'text-gray-600 dark:text-gray-200',
    },
    default: {
        bgClass: 'bg-gray-100 dark:bg-gray-700',
        textClass: 'text-gray-600 dark:text-gray-200',
    },
}

const priorityColor: Record<
    string,
    {
        bgClass: string
        textClass: string
    }
> = {
    low: {
        bgClass: 'bg-emerald-100 dark:bg-emerald-900/30',
        textClass: 'text-emerald-700 dark:text-emerald-200',
    },
    medium: {
        bgClass: 'bg-blue-100 dark:bg-blue-900/30',
        textClass: 'text-blue-700 dark:text-blue-200',
    },
    high: {
        bgClass: 'bg-orange-100 dark:bg-orange-900/30',
        textClass: 'text-orange-700 dark:text-orange-200',
    },
    urgent: {
        bgClass: 'bg-red-100 dark:bg-red-900/30',
        textClass: 'text-red-700 dark:text-red-200',
    },
    default: {
        bgClass: 'bg-gray-100 dark:bg-gray-700',
        textClass: 'text-gray-600 dark:text-gray-200',
    },
}

const TicketColumn = ({ row }: { row: Ticket }) => {
    const router = useRouter()

    const onView = () => {
        router.push(`/support/ticket-details/${row.id}`)
    }

    return (
        <span
            className="cursor-pointer font-bold heading-text hover:text-primary block"
            onClick={onView}
        >
            #{row.ticketNumber}
        </span>
    )
}

const ActionColumn = ({ row }: { row: Ticket }) => {
    const router = useRouter()

    const onView = () => {
        router.push(`/support/ticket-details/${row.id}`)
    }

    return (
        <div className="flex justify-center text-lg gap-1">
            <Tooltip wrapperClass="flex" title="View">
                <span className="cursor-pointer p-2 hover:text-primary" onClick={onView}>
                    <TbEye />
                </span>
            </Tooltip>
        </div>
    )
}

const TicketListTable = ({
    ticketListTotal,
    pageIndex = 1,
    pageSize = 10,
}: TicketListTableProps) => {
    const ticketList = useTicketListStore((state) => state.ticketList)
    const initialLoading = useTicketListStore((state) => state.initialLoading)
    const statusOptions = useTicketListStore((state) => state.statusOptions)

    const { onAppendQueryParams } = useAppendQueryParams()

    const statusLabelMap = useMemo(() => {
        const entries = statusOptions.map((option) => [
            option.key.toLowerCase(),
            option.name,
        ])
        return new Map(entries)
    }, [statusOptions])

    const columns: ColumnDef<Ticket>[] = useMemo(
        () => [
            {
                header: 'Ticket',
                accessorKey: 'ticketNumber',
                cell: (props) => <TicketColumn row={props.row.original} />,
            },
            {
                header: 'Subject',
                accessorKey: 'subject',
                cell: (props) => {
                    const { subject } = props.row.original
                    return <span className="font-semibold block max-w-xs truncate">{subject}</span>
                },
            },
            {
                header: 'Department',
                accessorKey: 'departmentName',
                cell: (props) => {
                    const { departmentName } = props.row.original
                    return (
                        <Tag className="border-none">
                            <span className="font-semibold">
                                {departmentName || '-'}
                            </span>
                        </Tag>
                    )
                },
            },
            {
                header: 'Priority',
                accessorKey: 'priorityName',
                cell: (props) => {
                    const { priorityName } = props.row.original
                    const normalized = priorityName.trim().toLowerCase()
                    const style = priorityColor[normalized] || priorityColor.default
                    
                    return (
                        <Tag className={style.bgClass}>
                            <span className={`capitalize font-semibold ${style.textClass}`}>
                                {priorityName || '-'}
                            </span>
                        </Tag>
                    )
                },
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (props) => {
                    const { status } = props.row.original
                    const normalized = status.trim().toLowerCase()
                    const label = statusLabelMap.get(normalized) || (normalized ? normalized : '-')
                    const style = statusColor[normalized] || statusColor.default
                    
                    return (
                        <div className="">
                            <Tag className={style.bgClass}>
                                <span className={`capitalize font-semibold ${style.textClass}`}>
                                    {label}
                                </span>
                            </Tag>
                        </div>
                    )
                },
            },
            {
                header: 'Last Updated',
                accessorKey: 'createdAt',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="font-semibold block">
                            {dayjs.unix(row.createdAt).format('DD/MM/YYYY')}
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
        [statusLabelMap],
    )

    const handlePaginationChange = (page: number) => {
        onAppendQueryParams({ pageIndex: String(page) })
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
                data={ticketList}
                noData={ticketList.length === 0}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ width: 28, height: 28 }}
                loading={initialLoading}
                pagingData={{
                    total: ticketListTotal,
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

export default TicketListTable
