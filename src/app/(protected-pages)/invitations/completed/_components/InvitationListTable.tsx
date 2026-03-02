'use client'

import { useMemo } from 'react'
import Avatar from '@/components/ui/Avatar'
import Tag from '@/components/ui/Tag'
import DataTable from '@/components/shared/DataTable'
import { useInvitationListStore } from '../_store/invitationListStore'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import { useRouter } from 'next/navigation'
import { TbEye, TbUser } from 'react-icons/tb'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { Customer } from '../types'

type InvitationListTableProps = {
    customerListTotal: number
    pageIndex?: number
    pageSize?: number
}

const statusColor: Record<string, string> = {
    sent: 'bg-blue-200 dark:bg-blue-200 text-gray-900 dark:text-gray-900',
    viewed: 'bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900',
    expired: 'bg-amber-200 dark:bg-amber-200 text-gray-900 dark:text-gray-900',
}

const NameColumn = ({ row }: { row: Customer }) => {
    return (
        <div className="flex items-center">
            <Avatar
                size={40}
                shape="circle"
                src={row.img}
                icon={<TbUser />}
                alt={row.name}
            />
            <span className="ml-2 rtl:mr-2 font-semibold text-gray-900 dark:text-gray-100">
                {row.name}
            </span>
        </div>
    )
}

const InvitationListTable = ({
    customerListTotal,
    pageIndex = 1,
    pageSize = 10,
}: InvitationListTableProps) => {
    const router = useRouter()
    const customerList = useInvitationListStore((state) => state.customerList)
    const selectedCustomer = useInvitationListStore(
        (state) => state.selectedCustomer,
    )
    const isInitialLoading = useInvitationListStore(
        (state) => state.initialLoading,
    )
    const setSelectedCustomer = useInvitationListStore(
        (state) => state.setSelectedCustomer,
    )
    const setSelectAllCustomer = useInvitationListStore(
        (state) => state.setSelectAllCustomer,
    )

    const { onAppendQueryParams } = useAppendQueryParams()

    const handleViewDetails = (invitation: Customer) => {
        router.push(`/invitations/details/${invitation.id}`)
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
                header: 'Address',
                accessorKey: 'personalInfo.address',
            },
            {
                header: 'Country',
                accessorKey: 'personalInfo.country',
            },
            {
                header: 'State',
                accessorKey: 'personalInfo.state',
            },
            {
                header: 'City',
                accessorKey: 'personalInfo.city',
            },
            {
                header: 'Pin Code',
                accessorKey: 'personalInfo.pinCode',
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
                header: 'Action',
                id: 'action',
                cell: (props) => (
                    <div
                        className="group inline-flex items-center gap-2 text-xl cursor-pointer select-none font-semibold"
                        role="button"
                        onClick={() => handleViewDetails(props.row.original)}
                    >
                        <TbEye />
                        <span className="text-xs font-medium opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                            View
                        </span>
                    </div>
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
            // selectable
            columns={columns}
            data={customerList}
            noData={customerList.length === 0}
            skeletonAvatarColumns={[0]}
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

export default InvitationListTable

