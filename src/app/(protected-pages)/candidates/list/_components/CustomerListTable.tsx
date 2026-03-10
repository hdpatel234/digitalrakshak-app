'use client'

import { useMemo } from 'react'
import Avatar from '@/components/ui/Avatar'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import { useCustomerListStore } from '../_store/customerListStore'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TbEye, TbSend } from 'react-icons/tb'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { Customer } from '../types'
import { HiOutlineUser } from 'react-icons/hi'

type CustomerListTableProps = {
    customerListTotal: number
    pageIndex?: number
    pageSize?: number
}

const statusColor: Record<string, string> = {
    active: 'bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900',
    blocked: 'bg-red-200 dark:bg-red-200 text-gray-900 dark:text-gray-900',
}

const DEFAULT_AVATAR = ''

const NameColumn = ({ row }: { row: Customer }) => {
    return (
        <div className="flex items-center">
            <Avatar
                size={40}
                icon={<HiOutlineUser />}
                shape="circle"
                src={row.img?.trim() ? row.img : DEFAULT_AVATAR}
            />
            <Link
                className={`hover:text-primary ml-2 rtl:mr-2 font-semibold text-gray-900 dark:text-gray-100`}
                href={`/candidates/details/${row.id}`}
            >
                {row.name}
            </Link>
        </div>
    )
}

const ActionColumn = ({
    onSendInvitation,
    onViewDetail,
}: {
    onSendInvitation: () => void
    onViewDetail: () => void
}) => {
    return (
        <div className="flex items-center gap-3">
            <Tooltip title="Send Invitation">
                <div
                    className={`text-xl cursor-pointer select-none font-semibold`}
                    role="button"
                    onClick={onSendInvitation}
                >
                    <TbSend />
                </div>
            </Tooltip>
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

const CustomerListTable = ({
    customerListTotal,
    pageIndex = 1,
    pageSize = 10,
}: CustomerListTableProps) => {
    const router = useRouter()

    const customerList = useCustomerListStore((state) => state.customerList)
    const selectedCustomer = useCustomerListStore(
        (state) => state.selectedCustomer,
    )
    const isInitialLoading = useCustomerListStore(
        (state) => state.initialLoading,
    )
    const setSelectedCustomer = useCustomerListStore(
        (state) => state.setSelectedCustomer,
    )
    const setSelectAllCustomer = useCustomerListStore(
        (state) => state.setSelectAllCustomer,
    )

    const { onAppendQueryParams } = useAppendQueryParams()

    const handleViewDetails = (customer: Customer) => {
        router.push(`/candidates/details/${customer.id}`)
    }

    const handleSendInvitation = (customer: Customer) => {
        router.push(`/candidates/edit/${customer.id}?sendInvite=true`)
    }

    const columns: ColumnDef<Customer>[] = useMemo(
        () => [
            {
                header: 'Name',
                accessorKey: 'name',
                cell: (props) => {
                    const row = props.row.original
                    return <NameColumn row={row} />
                },
            },
            {
                header: 'Email',
                accessorKey: 'email',
            },
            {
                header: 'location',
                accessorKey: 'personalInfo.location',
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex items-center">
                            <Tag className={statusColor[row.status]}>
                                <span className="capitalize">{row.status}</span>
                            </Tag>
                        </div>
                    )
                },
            },
            {
                header: '',
                id: 'action',
                cell: (props) => (
                    <ActionColumn
                        onSendInvitation={() =>
                            handleSendInvitation(props.row.original)
                        }
                        onViewDetail={() =>
                            handleViewDetails(props.row.original)
                        }
                    />
                ),
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

    const handleRowSelect = (checked: boolean, row: Customer) => {
        setSelectedCustomer(checked, row)
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<Customer>[]) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            setSelectAllCustomer(originalRows)
        } else {
            setSelectAllCustomer([])
        }
    }

    return (
        <DataTable
            selectable
            columns={columns}
            data={customerList}
            noData={customerList.length === 0}
            skeletonAvatarColumns={[1]}
            skeletonAvatarProps={{ width: 28, height: 28 }}
            loading={isInitialLoading}
            pagingData={{
                total: customerListTotal,
                pageIndex,
                pageSize,
            }}
            checkboxChecked={(row) =>
                selectedCustomer.some((selected) => selected.id === row.id)
            }
            onPaginationChange={handlePaginationChange}
            onSelectChange={handleSelectChange}
            onSort={handleSort}
            onCheckBoxChange={handleRowSelect}
            onIndeterminateCheckBoxChange={handleAllRowSelect}
        />
    )
}

export default CustomerListTable
