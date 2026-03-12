'use client'

import { useMemo, useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import Dialog from '@/components/ui/Dialog'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import DataTable from '@/components/shared/DataTable'
import { useCustomerListStore } from '../_store/customerListStore'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TbEye, TbSend, TbTrash } from 'react-icons/tb'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { Customer } from '../types'
import { HiOutlineUser } from 'react-icons/hi'

type CustomerListTableProps = {
    customerListTotal: number
    pageIndex?: number
    pageSize?: number
}

type PackageOption = {
    id: string
    name: string
    packageCode: string
    description: string
}

type ApiResponsePayload = {
    status?: boolean
    success?: boolean
    message?: string
    data?: unknown
}

const STATUS_TAG_STYLES = {
    success: 'bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900',
    warning: 'bg-amber-200 dark:bg-amber-200 text-gray-900 dark:text-gray-900',
    danger: 'bg-red-200 dark:bg-red-200 text-gray-900 dark:text-gray-900',
    info: 'bg-sky-200 dark:bg-sky-200 text-gray-900 dark:text-gray-900',
    muted: 'bg-gray-200 dark:bg-gray-200 text-gray-900 dark:text-gray-900',
} as const

const getStatusTagClass = (status: string) => {
    const normalized = status.trim().toLowerCase()

    if (
        ['active', 'approved', 'accepted', 'verified', 'hired', 'completed'].includes(
            normalized,
        )
    ) {
        return STATUS_TAG_STYLES.success
    }

    if (
        ['pending', 'in_progress', 'in progress', 'on_hold', 'on hold', 'shortlisted'].includes(
            normalized,
        )
    ) {
        return STATUS_TAG_STYLES.warning
    }

    if (
        ['blocked', 'rejected', 'declined', 'failed', 'inactive', 'cancelled', 'canceled'].includes(
            normalized,
        )
    ) {
        return STATUS_TAG_STYLES.danger
    }

    if (['new', 'invited', 'interview_scheduled', 'interviewed'].includes(normalized)) {
        return STATUS_TAG_STYLES.info
    }

    return STATUS_TAG_STYLES.muted
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
    onDelete,
    canSendInvitation,
}: {
    onSendInvitation: () => void
    onViewDetail: () => void
    onDelete: () => void
    canSendInvitation: boolean
}) => {
    return (
        <div className="flex items-center gap-3">
            {canSendInvitation && (
                <Tooltip title="Send Invitation">
                    <div
                        className={`text-xl cursor-pointer select-none font-semibold`}
                        role="button"
                        onClick={onSendInvitation}
                    >
                        <TbSend />
                    </div>
                </Tooltip>
            )}
            <Tooltip title="View">
                <div
                    className={`text-xl cursor-pointer select-none font-semibold`}
                    role="button"
                    onClick={onViewDetail}
                >
                    <TbEye />
                </div>
            </Tooltip>
            <Tooltip title="Remove">
                <div
                    className={`text-xl cursor-pointer select-none font-semibold text-error`}
                    role="button"
                    onClick={onDelete}
                >
                    <TbTrash />
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
    const [inviteModalOpen, setInviteModalOpen] = useState(false)
    const [selectedCandidate, setSelectedCandidate] = useState<Customer | null>(
        null,
    )
    const [packageOptions, setPackageOptions] = useState<PackageOption[]>([])
    const [selectedPackageIds, setSelectedPackageIds] = useState<string[]>([])
    const [isPackageLoading, setIsPackageLoading] = useState(false)
    const [isInviteSubmitting, setIsInviteSubmitting] = useState(false)
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [candidateToDelete, setCandidateToDelete] = useState<Customer | null>(
        null,
    )

    const customerList = useCustomerListStore((state) => state.customerList)
    const setCustomerList = useCustomerListStore((state) => state.setCustomerList)
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

    const handleOpenDeleteConfirmation = (customer: Customer) => {
        setCandidateToDelete(customer)
        setDeleteConfirmationOpen(true)
    }

    const handleCloseDeleteConfirmation = () => {
        setDeleteConfirmationOpen(false)
        setCandidateToDelete(null)
    }

    const handleConfirmDelete = () => {
        if (!candidateToDelete?.id) {
            handleCloseDeleteConfirmation()
            return
        }

        const updatedCustomerList = customerList.filter(
            (customer) => customer.id !== candidateToDelete.id,
        )

        setCustomerList(updatedCustomerList)
        setSelectedCustomer(false, candidateToDelete)
        handleCloseDeleteConfirmation()
        toast.push(
            <Notification type="success">
                Candidate removed successfully.
            </Notification>,
            { placement: 'top-center' },
        )
    }

    const closeInviteModal = () => {
        setInviteModalOpen(false)
        setSelectedCandidate(null)
        setSelectedPackageIds([])
        setPackageOptions([])
        setIsPackageLoading(false)
        setIsInviteSubmitting(false)
    }

    const mapPackageOption = (item: unknown): PackageOption => {
        const record =
            item && typeof item === 'object'
                ? (item as Record<string, unknown>)
                : {}

        return {
            id: String(record.id ?? ''),
            name: String(record.package_name ?? record.name ?? ''),
            packageCode: String(record.package_code ?? ''),
            description: String(record.description ?? ''),
        }
    }

    const fetchPackageOptions = async () => {
        setIsPackageLoading(true)
        try {
            const response = await fetch('/api/client/packages?page=1&limit=100', {
                method: 'GET',
            })
            const payload = ((await response.json()) as ApiResponsePayload) || {}
            const isSuccess =
                payload.status === true || payload.success === true

            if (!response.ok || !isSuccess) {
                toast.push(
                    <Notification type="danger">
                        {payload.message || 'Failed to fetch packages.'}
                    </Notification>,
                    { placement: 'top-center' },
                )
                setPackageOptions([])
                return
            }

            const dataRecord =
                payload.data && typeof payload.data === 'object'
                    ? (payload.data as Record<string, unknown>)
                    : {}
            const listValue = dataRecord.list
            const list = Array.isArray(listValue) ? listValue : []
            const mappedList = list
                .map(mapPackageOption)
                .filter((item) => item.id.length > 0)

            setPackageOptions(mappedList)
        } catch {
            toast.push(
                <Notification type="danger">
                    Failed to fetch packages.
                </Notification>,
                { placement: 'top-center' },
            )
            setPackageOptions([])
        } finally {
            setIsPackageLoading(false)
        }
    }

    const handleSendInvitation = async (customer: Customer) => {
        setSelectedCandidate(customer)
        setSelectedPackageIds([])
        setInviteModalOpen(true)
        await fetchPackageOptions()
    }

    const handlePackageToggle = (checked: boolean, packageId: string) => {
        setSelectedPackageIds((prev) => {
            if (checked) {
                if (prev.includes(packageId)) {
                    return prev
                }
                return [...prev, packageId]
            }

            return prev.filter((id) => id !== packageId)
        })
    }

    const handleInviteSubmit = async () => {
        if (!selectedCandidate?.id) {
            return
        }

        if (selectedPackageIds.length === 0) {
            toast.push(
                <Notification type="danger">
                    Please select at least one package.
                </Notification>,
                { placement: 'top-center' },
            )
            return
        }

        setIsInviteSubmitting(true)
        try {
            const candidateId = Number.parseInt(String(selectedCandidate.id), 10)
            const packageIds = selectedPackageIds
                .map((id) => Number.parseInt(String(id), 10))
                .filter((id) => Number.isInteger(id))

            if (!Number.isInteger(candidateId)) {
                toast.push(
                    <Notification type="danger">
                        Invalid candidate id.
                    </Notification>,
                    { placement: 'top-center' },
                )
                return
            }

            if (packageIds.length === 0) {
                toast.push(
                    <Notification type="danger">
                        Please select valid package(s).
                    </Notification>,
                    { placement: 'top-center' },
                )
                return
            }

            const response = await fetch(
                `/api/client/candidates/${selectedCandidate.id}/invite`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        candidate_ids: [candidateId],
                        package_ids: packageIds,
                    }),
                },
            )

            const payload = ((await response.json()) as ApiResponsePayload) || {}
            const isSuccess =
                payload.status === true || payload.success === true

            if (!response.ok || !isSuccess) {
                toast.push(
                    <Notification type="danger">
                        {payload.message || 'Failed to send invitation.'}
                    </Notification>,
                    { placement: 'top-center' },
                )
                return
            }

            toast.push(
                <Notification type="success">
                    {payload.message || 'Invitation sent successfully.'}
                </Notification>,
                { placement: 'top-center' },
            )
            closeInviteModal()
            router.refresh()
        } catch {
            toast.push(
                <Notification type="danger">
                    Failed to send invitation.
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setIsInviteSubmitting(false)
        }
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
                            <Tag className={getStatusTagClass(row.status)}>
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
                        onDelete={() =>
                            handleOpenDeleteConfirmation(props.row.original)
                        }
                        canSendInvitation={
                            String(props.row.original.status || '')
                                .trim()
                                .toLowerCase() === 'created'
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
        <>
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

            <Dialog
                isOpen={inviteModalOpen}
                onClose={closeInviteModal}
                onRequestClose={closeInviteModal}
                width={700}
            >
                <h4 className="mb-2">Invite Candidate</h4>
                <p className="text-sm text-gray-500 mb-4">
                    {selectedCandidate?.name
                        ? `Select package(s) for ${selectedCandidate.name}`
                        : 'Select package(s) to invite candidate'}
                </p>

                <div className="max-h-[360px] overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    {isPackageLoading && (
                        <p className="text-sm text-gray-500">
                            Loading packages...
                        </p>
                    )}

                    {!isPackageLoading && packageOptions.length === 0 && (
                        <p className="text-sm text-gray-500">
                            No packages available.
                        </p>
                    )}

                    {!isPackageLoading &&
                        packageOptions.map((pkg) => (
                            <div
                                key={pkg.id}
                                className="py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                            >
                                <Checkbox
                                    checked={selectedPackageIds.includes(pkg.id)}
                                    onChange={(value) =>
                                        handlePackageToggle(value, pkg.id)
                                    }
                                >
                                    <div className="flex flex-col">
                                        <span className="font-semibold">
                                            {pkg.name || pkg.packageCode}
                                        </span>
                                        {pkg.packageCode && (
                                            <span className="text-xs text-gray-500">
                                                {pkg.packageCode}
                                            </span>
                                        )}
                                        {pkg.description && (
                                            <span className="text-xs text-gray-500 mt-1">
                                                {pkg.description}
                                            </span>
                                        )}
                                    </div>
                                </Checkbox>
                            </div>
                        ))}
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <Button onClick={closeInviteModal}>Cancel</Button>
                    <Button
                        variant="solid"
                        loading={isInviteSubmitting}
                        onClick={handleInviteSubmit}
                    >
                        Invite
                    </Button>
                </div>
            </Dialog>

            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Remove candidate"
                onClose={handleCloseDeleteConfirmation}
                onRequestClose={handleCloseDeleteConfirmation}
                onCancel={handleCloseDeleteConfirmation}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    Are you sure you want to remove this candidate? This action
                    can&apos;t be undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default CustomerListTable
