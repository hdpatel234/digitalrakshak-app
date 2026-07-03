'use client'

import { useMemo, useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import { useInProgressListStore } from '../_store/inProgressListStore'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TbEye } from 'react-icons/tb'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { Customer, CandidateService } from '../types'
import { HiOutlineUser } from 'react-icons/hi'

type InProgressListTableProps = {
    customerListTotal: number
    pageIndex?: number
    pageSize?: number
}

const STATUS_TAG_STYLES = {
    success: 'bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900',
    warning: 'bg-amber-200 dark:bg-amber-200 text-gray-900 dark:text-gray-900',
    danger: 'bg-red-200 dark:bg-red-200 text-gray-900 dark:text-gray-900',
    info: 'bg-sky-200 dark:bg-sky-200 text-gray-900 dark:text-gray-900',
    muted: 'bg-gray-200 dark:bg-gray-200 text-gray-900 dark:text-gray-900',
} as const

const SERVICE_STATUS_STYLES: Record<string, string> = {
    completed: STATUS_TAG_STYLES.success,
    'in-progress': STATUS_TAG_STYLES.warning,
    pending: STATUS_TAG_STYLES.info,
    error: STATUS_TAG_STYLES.danger,
}

const ActionColumn = ({
    row,
    onViewDetail,
}: {
    row: Customer
    onViewDetail: () => void
}) => {
    return (
        <div className="flex items-center gap-3">
            <Tooltip title="View">
                <div
                    className={`text-xl cursor-pointer select-none font-semibold`}
                    role="button"
                    onClick={onViewDetail}
                >
                    <TbEye />
                </div>
            </Tooltip>
        </div>
    )
}

const InProgressListTable = ({
    customerListTotal,
    pageIndex = 1,
    pageSize = 10,
}: InProgressListTableProps) => {
    const router = useRouter()

    const customerList = useInProgressListStore((state) => state.customerList)
    const isInitialLoading = useInProgressListStore(
        (state) => state.initialLoading,
    )

    const { onAppendQueryParams } = useAppendQueryParams()

    const handleViewDetails = (customer: Customer) => {
        router.push(`/candidates/details/${customer.id}`)
    }

    const columns: ColumnDef<Customer>[] = useMemo(
        () => [
            {
                header: 'Candidate',
                accessorKey: 'name',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex items-center gap-3">
                            <Avatar
                                shape="circle"
                                src={row.img}
                                icon={<HiOutlineUser />}
                            />
                            <div>
                                <Link
                                    href={`/candidates/details/${row.id}`}
                                    className="font-semibold text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400"
                                >
                                    {row.name}
                                </Link>
                                <div className="text-sm text-gray-500">
                                    {row.email}
                                </div>
                            </div>
                        </div>
                    )
                },
            },
            {
                header: 'Package',
                accessorKey: 'package',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                            {row.package || '-'}
                        </span>
                    )
                },
            },
            {
                header: 'Current Processes / Services',
                accessorKey: 'candidateServices',
                cell: (props) => {
                    const row = props.row.original
                    const services = row.candidateServices || []
                    
                    if (services.length === 0) {
                        return <span className="text-gray-400">-</span>
                    }

                    return (
                        <div className="flex flex-wrap gap-2">
                            {services.map((service: CandidateService, index: number) => {
                                const svcStatus = (service.status || 'pending').toLowerCase()
                                const styleClass = SERVICE_STATUS_STYLES[svcStatus] || SERVICE_STATUS_STYLES.pending
                                return (
                                    <Tag key={index} className={styleClass}>
                                        {service.service_name || `Service ${service.service_id || index}`} ({svcStatus})
                                    </Tag>
                                )
                            })}
                        </div>
                    )
                },
            },
            {
                header: 'Overall Status',
                accessorKey: 'status',
                cell: (props) => {
                    const row = props.row.original
                    const status = (row.status || 'active').toLowerCase()
                    const tagStyle = status === 'completed'
                            ? STATUS_TAG_STYLES.success
                            : status === 'in-progress'
                              ? STATUS_TAG_STYLES.warning
                              : status === 'error'
                                ? STATUS_TAG_STYLES.danger
                                : STATUS_TAG_STYLES.info

                    return (
                        <Tag className={`capitalize ${tagStyle}`}>
                            {status}
                        </Tag>
                    )
                },
            },
            {
                header: 'Assigned Date',
                accessorKey: 'assignedDate',
                cell: (props) => {
                    const row = props.row.original
                    return <span>{row.assignedDate || '-'}</span>
                },
            },
            {
                header: 'Action',
                id: 'action',
                cell: (props) => (
                    <ActionColumn
                        row={props.row.original}
                        onViewDetail={() => handleViewDetails(props.row.original)}
                    />
                ),
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    )

    const handlePaginationChange = (page: number) => {
        onAppendQueryParams({ pageIndex: String(page) })
    }

    const handleSelectChange = (val: number) => {
        onAppendQueryParams({ pageSize: String(val), pageIndex: '1' })
    }

    const handleSort = ({ order, key }: OnSortParam) => {
        onAppendQueryParams({ sort: key, order: order })
    }

    return (
        <DataTable
            columns={columns}
            data={customerList}
            noData={customerList.length === 0}
            loading={isInitialLoading}
            skeletonAvatarColumns={[0]}
            skeletonAvatarProps={{ width: 28, height: 28 }}
            pagingData={{
                total: customerListTotal,
                pageIndex,
                pageSize,
            }}
            onPaginationChange={handlePaginationChange}
            onSelectChange={handleSelectChange}
            onSort={handleSort}
        />
    )
}

export default InProgressListTable
