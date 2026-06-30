'use client'

import { useState } from 'react'
import DataTable from '@/components/shared/DataTable'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import { useRouter } from 'next/navigation'
import { TbRefresh, TbCopy } from 'react-icons/tb'
import Avatar from '@/components/ui/Avatar'
import { useInvitationListStore } from '../_store/invitationListStore'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { Invitation, InvitationPackage } from '../types'

type InvitationListTableProps = {
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
        ['pending', 'in_progress', 'in progress', 'on_hold', 'on hold', 'shortlisted', 'sent'].includes(
            normalized,
        )
    ) {
        return STATUS_TAG_STYLES.warning
    }

    if (
        ['blocked', 'rejected', 'declined', 'failed', 'inactive', 'cancelled', 'canceled', 'expired'].includes(
            normalized,
        )
    ) {
        return STATUS_TAG_STYLES.danger
    }

    if (['new', 'invited', 'interview_scheduled', 'interviewed', 'viewed'].includes(normalized)) {
        return STATUS_TAG_STYLES.info
    }

    return STATUS_TAG_STYLES.muted
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

const NameColumn = ({ row }: { row: Invitation }) => {
    const candidate = row.candidate
    const name = candidate?.name || '-'
    const firstName = candidate?.first_name || name.split(' ')[0] || ''
    const lastName = candidate?.last_name || name.split(' ')[1] || ''
    const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase()
    
    return (
        <div className="flex items-center">
            <Avatar
                size={40}
                shape="circle"
                className="bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-100 font-semibold text-sm"
            >
                {initials}
            </Avatar>
            <div className="ml-3 rtl:mr-3 flex flex-col">
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {name}
                </span>
                <span className="text-xs text-gray-500">{candidate?.email || '-'}</span>
            </div>
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

    const handleCopyLink = async (link: string) => {
        try {
            await navigator.clipboard.writeText(link)
            toast.push(
                <Notification type="success">
                    Link copied to clipboard
                </Notification>,
                { placement: 'top-center' },
            )
        } catch (err) {
            toast.push(
                <Notification type="danger">
                    Failed to copy link
                </Notification>,
                { placement: 'top-center' },
            )
        }
    }

    const columns: ColumnDef<Invitation>[] = [
            {
                header: 'CANDIDATE',
                accessorKey: 'candidate.name',
                cell: (props) => <NameColumn row={props.row.original} />,
            },
            {
                header: 'PHONE',
                accessorKey: 'candidate.phone',
                cell: (props) => props.row.original.candidate?.phone || '-',
            },
            {
                header: 'PACKAGES',
                id: 'packages',
                cell: (props) => <PackageCell invitation={props.row.original} />,
            },
            {
                header: 'INVITED AT',
                accessorKey: 'invited_at',
                cell: (props) => (
                    <span className="whitespace-nowrap">
                        {formatDateTime(props.row.original.invited_at)}
                    </span>
                ),
            },
            {
                header: 'EXPIRES AT',
                accessorKey: 'expires_at',
                cell: (props) => (
                    <span className="whitespace-nowrap">
                        {formatDateTime(props.row.original.expires_at)}
                    </span>
                ),
            },
            {
                header: 'STATUS',
                accessorKey: 'status',
                cell: (props) => {
                    const status = String(props.row.original.status || '').toLowerCase()
                    return (
                        <Tag className={getStatusTagClass(status)}>
                            <span className="capitalize">{status || '-'}</span>
                        </Tag>
                    )
                },
            },
            {
                header: 'ACTIONS',
                id: 'action',
                cell: (props) => {
                    const invitation = props.row.original
                    const isLoading = loadingActionId === invitation.id
                    const isCompleted = String(invitation.status || '').toLowerCase() === 'completed'
                    return (
                        <div className="flex items-center gap-3">
                            <Tooltip title="Resend">
                                <div
                                    className={`text-xl select-none font-semibold ${
                                        (isLoading || isCompleted) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                    }`}
                                    role="button"
                                    onClick={() => !isCompleted && !isLoading && handleResend(invitation)}
                                >
                                    <TbRefresh
                                        className={isLoading ? 'animate-spin' : ''}
                                    />
                                </div>
                            </Tooltip>
                            {invitation.form_link && (
                                <Tooltip title="Copy Link">
                                    <div
                                        className="text-xl cursor-pointer select-none font-semibold"
                                        role="button"
                                        onClick={() => handleCopyLink(invitation.form_link!)}
                                    >
                                        <TbCopy />
                                    </div>
                                </Tooltip>
                            )}
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
