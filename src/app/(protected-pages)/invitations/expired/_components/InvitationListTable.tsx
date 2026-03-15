'use client'

import { useState } from 'react'
import DataTable from '@/components/shared/DataTable'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import { useRouter } from 'next/navigation'
import { TbEye, TbRefresh, TbTrash } from 'react-icons/tb'
import { useInvitationListStore } from '../_store/invitationListStore'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { Invitation, InvitationPackage } from '../types'

type InvitationListTableProps = {
    pageIndex?: number
    pageSize?: number
}

const statusColor: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    sent: 'bg-sky-100 text-sky-700',
    viewed: 'bg-emerald-100 text-emerald-700',
    completed: 'bg-indigo-100 text-indigo-700',
    expired: 'bg-red-100 text-red-700',
}

const formatDateTime = (value?: string | null) => {
    if (!value) {
        return '-'
    }

    const date = new Date(value.replace(' ', 'T'))
    if (Number.isNaN(date.getTime())) {
        return value
    }

    return date.toLocaleString()
}

const getPackageList = (invitation: Invitation): InvitationPackage[] => {
    if (Array.isArray(invitation.packages) && invitation.packages.length > 0) {
        return invitation.packages
    }

    if (invitation.package) {
        return [invitation.package]
    }

    if (
        Array.isArray(invitation.form_data?.package_ids) &&
        invitation.form_data.package_ids.length > 0
    ) {
        return invitation.form_data.package_ids.map((id) => ({
            id,
            name: `Package #${id}`,
        }))
    }

    return []
}

const PackageCell = ({ invitation }: { invitation: Invitation }) => {
    const packages = getPackageList(invitation)

    if (packages.length === 0) {
        return <span>-</span>
    }

    const [firstPackage, ...otherPackages] = packages

    return (
        <div className="flex items-center gap-2">
            <span>{firstPackage.name}</span>
            {otherPackages.length > 0 && (
                <Tooltip title={otherPackages.map((pkg) => pkg.name).join(', ')}>
                    <span className="cursor-pointer text-primary font-semibold">
                        +{otherPackages.length}
                    </span>
                </Tooltip>
            )}
        </div>
    )
}

const InvitationListTable = ({
    pageIndex = 1,
    pageSize = 10,
}: InvitationListTableProps) => {
    const router = useRouter()
    const [loadingActionId, setLoadingActionId] = useState<number | null>(null)
    const invitationList = useInvitationListStore((state) => state.invitationList)
    const isInitialLoading = useInvitationListStore((state) => state.initialLoading)
    const pagination = useInvitationListStore((state) => state.pagination)
    const selectedInvitations = useInvitationListStore(
        (state) => state.selectedInvitations,
    )
    const setSelectedInvitation = useInvitationListStore(
        (state) => state.setSelectedInvitation,
    )
    const setSelectAllInvitations = useInvitationListStore(
        (state) => state.setSelectAllInvitations,
    )
    const { onAppendQueryParams } = useAppendQueryParams()

    const reloadData = () => {
        router.refresh()
    }

    const handleViewDetails = (invitation: Invitation) => {
        router.push(`/invitations/details/${invitation.id}`)
    }

    const handleResend = async (invitation: Invitation) => {
        setLoadingActionId(invitation.id)
        try {
            const response = await fetch(
                `/api/client/invitations/${invitation.id}/resend`,
                {
                    method: 'POST',
                },
            )
            const payload = (await response.json()) as {
                status?: boolean
                message?: string
            }

            if (!response.ok || !payload.status) {
                throw new Error(payload.message || 'Failed to resend invitation')
            }

            toast.push(
                <Notification type="success">
                    {payload.message || 'Invitation resent successfully'}
                </Notification>,
                { placement: 'top-center' },
            )
            reloadData()
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : 'Failed to resend invitation'
            toast.push(
                <Notification type="danger">{errorMessage}</Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setLoadingActionId(null)
        }
    }

    const handleDelete = async (invitation: Invitation) => {
        const confirmed = window.confirm(
            `Delete invitation #${invitation.id}? This action cannot be undone.`,
        )
        if (!confirmed) {
            return
        }

        setLoadingActionId(invitation.id)
        try {
            const response = await fetch(`/api/client/invitations/${invitation.id}`, {
                method: 'DELETE',
            })
            const payload = (await response.json()) as {
                status?: boolean
                message?: string
            }

            if (!response.ok || !payload.status) {
                throw new Error(payload.message || 'Failed to delete invitation')
            }

            toast.push(
                <Notification type="success">
                    {payload.message || 'Invitation deleted successfully'}
                </Notification>,
                { placement: 'top-center' },
            )
            reloadData()
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : 'Failed to delete invitation'
            toast.push(
                <Notification type="danger">{errorMessage}</Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setLoadingActionId(null)
        }
    }

    const columns: ColumnDef<Invitation>[] = [
            {
                header: 'Candidate',
                accessorKey: 'candidate.name',
                cell: (props) => props.row.original.candidate?.name || '-',
            },
            {
                header: 'Email',
                accessorKey: 'candidate.email',
                cell: (props) => props.row.original.candidate?.email || '-',
            },
            {
                header: 'Phone',
                accessorKey: 'candidate.phone',
                cell: (props) => props.row.original.candidate?.phone || '-',
            },
            {
                header: 'Packages',
                id: 'packages',
                cell: (props) => <PackageCell invitation={props.row.original} />,
            },
            // {
            //     header: 'Type',
            //     accessorKey: 'invitation_type',
            //     cell: (props) => (
            //         <span className="uppercase">
            //             {props.row.original.invitation_type || '-'}
            //         </span>
            //     ),
            // },
            {
                header: 'Invited At',
                accessorKey: 'invited_at',
                cell: (props) => formatDateTime(props.row.original.invited_at),
            },
            {
                header: 'Expires At',
                accessorKey: 'expires_at',
                cell: (props) => formatDateTime(props.row.original.expires_at),
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (props) => {
                    const status = String(props.row.original.status || '').toLowerCase()
                    return (
                        <Tag className={statusColor[status] || 'bg-gray-100 text-gray-700'}>
                            <span className="capitalize">{status || '-'}</span>
                        </Tag>
                    )
                },
            },
            {
                header: 'Action',
                id: 'action',
                cell: (props) => {
                    const invitation = props.row.original
                    const isLoading = loadingActionId === invitation.id
                    return (
                        <div className="flex items-center gap-2">
                            <Tooltip title="Resend">
                                <div
                                    className={`text-xl select-none font-semibold cursor-pointer ${
                                        isLoading ? 'opacity-50 pointer-events-none' : ''
                                    }`}
                                    role="button"
                                    onClick={() => handleResend(invitation)}
                                >
                                    <TbRefresh
                                        className={isLoading ? 'animate-spin' : ''}
                                    />
                                </div>
                            </Tooltip>
                            <Tooltip title="View">
                                <div
                                    className="text-xl cursor-pointer select-none font-semibold"
                                    role="button"
                                    onClick={() => handleViewDetails(invitation)}
                                >
                                    <TbEye />
                                </div>
                            </Tooltip>
                            <Tooltip title="Delete">
                                <div
                                    className={`text-xl cursor-pointer select-none font-semibold text-error ${
                                        isLoading ? 'opacity-50 pointer-events-none' : ''
                                    }`}
                                    role="button"
                                    onClick={() => handleDelete(invitation)}
                                >
                                    <TbTrash />
                                </div>
                            </Tooltip>
                        </div>
                    )
                },
            },
        ]

    const handlePaginationChange = (page: number) => {
        onAppendQueryParams({
            page: String(page),
        })
    }

    const handleSelectChange = (value: number) => {
        onAppendQueryParams({
            per_page: String(value),
            page: '1',
        })
    }

    const handleSort = (sort: OnSortParam) => {
        const sortMap: Record<string, string> = {
            'candidate.name': 'candidate.name',
            invited_at: 'candidate_invitations.invited_at',
            expires_at: 'candidate_invitations.expires_at',
            invitation_type: 'candidate_invitations.invitation_type',
            status: 'candidate_invitations.status',
        }

        onAppendQueryParams({
            sort_by: sortMap[sort.key] || 'candidate_invitations.created_at',
            sort_direction: sort.order,
            page: '1',
        })
    }

    const handleRowSelect = (checked: boolean, row: Invitation) => {
        setSelectedInvitation(checked, row)
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<Invitation>[]) => {
        if (checked) {
            setSelectAllInvitations(rows.map((row) => row.original))
            return
        }
        setSelectAllInvitations([])
    }

    return (
        <DataTable
            selectable
            columns={columns}
            data={invitationList}
            noData={invitationList.length === 0}
            loading={isInitialLoading}
            pagingData={{
                total: pagination.total || 0,
                pageIndex: pagination.current_page || pageIndex,
                pageSize: pagination.per_page || pageSize,
            }}
            checkboxChecked={(row) =>
                selectedInvitations.some((selected) => selected.id === row.id)
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
