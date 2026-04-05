'use client'

import { useMemo, useState } from 'react'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import Avatar from '@/components/ui/Avatar'
import { useTeamListStore } from '../_store/teamListStore'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import { TbPencil, TbTrash } from 'react-icons/tb'
import dayjs from 'dayjs'
import type { OnSortParam, ColumnDef } from '@/components/shared/DataTable'
import type { TeamMember } from './types'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { apiDeleteTeamMember } from '@/services/client/settings/users'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'

type TeamListTableProps = {
    teamListTotal: number
    pageIndex?: number
    pageSize?: number
}

const statusColor: Record<
    string,
    {
        bgClass: string
        textClass: string
        label: string
    }
> = {
    '1': {
        bgClass: 'bg-emerald-100 dark:bg-emerald-900/30',
        textClass: 'text-emerald-700 dark:text-emerald-200',
        label: 'Active',
    },
    '0': {
        bgClass: 'bg-red-100 dark:bg-red-900/30',
        textClass: 'text-red-700 dark:text-red-200',
        label: 'Inactive',
    },
}

const NameColumn = ({ row }: { row: TeamMember }) => {
    return (
        <div className="flex items-center gap-2">
            <Avatar shape="circle" size={30} src={row.avatar || ''} />
            <span className="font-bold heading-text">
                {row.first_name} {row.last_name}
            </span>
        </div>
    )
}

import { useRouter } from 'next/navigation'

const ActionColumn = ({ row }: { row: TeamMember }) => {
    const router = useRouter()
    const [dialogOpen, setDialogOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const onEdit = () => {
        router.push(`/settings/team-members/edit/${row.id}`)
    }

    const onDelete = () => {
        setDialogOpen(true)
    }

    const handleConfirmDelete = async () => {
        setIsDeleting(true)
        try {
            const response = await apiDeleteTeamMember<any>(String(row.id))

            if (response && response.status) {
                toast.push(
                    <Notification title="Success" type="success">
                        {response.message || 'Team member deleted successfully'}
                    </Notification>,
                    { placement: 'top-end' }
                )
                router.refresh()
            } else {
                toast.push(
                    <Notification title="Error" type="danger">
                        {response?.message || 'Failed to delete team member'}
                    </Notification>,
                    { placement: 'top-end' }
                )
            }
        } catch (error: any) {
            toast.push(
                <Notification title="Error" type="danger">
                    {error?.response?.data?.message || 'An error occurred while deleting'}
                </Notification>,
                { placement: 'top-end' }
            )
        } finally {
            setIsDeleting(false)
            setDialogOpen(false)
        }
    }

    return (
        <>
            <div className="flex justify-center text-lg gap-1">
                <Tooltip wrapperClass="flex" title="Edit">
                    <span
                        className="cursor-pointer p-2 hover:text-primary"
                        onClick={onEdit}
                    >
                        <TbPencil />
                    </span>
                </Tooltip>
                <Tooltip wrapperClass="flex" title="Delete">
                    <span
                        className="cursor-pointer p-2 hover:text-red-500"
                        onClick={onDelete}
                    >
                        <TbTrash />
                    </span>
                </Tooltip>
            </div>
            <ConfirmDialog
                isOpen={dialogOpen}
                type="danger"
                title="Delete Team Member"
                onClose={() => setDialogOpen(false)}
                onRequestClose={() => setDialogOpen(false)}
                onCancel={() => setDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                confirmButtonProps={{ loading: isDeleting }}
            >
                <p>
                    Are you sure you want to delete this team member? This action cannot be undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

const TeamListTable = ({
    teamListTotal,
    pageIndex = 1,
    pageSize = 10,
}: TeamListTableProps) => {
    const teamList = useTeamListStore((state) => state.teamList)
    const initialLoading = useTeamListStore((state) => state.initialLoading)

    const { onAppendQueryParams } = useAppendQueryParams()

    const columns: ColumnDef<TeamMember>[] = useMemo(
        () => [
            {
                header: 'Name',
                accessorKey: 'first_name',
                cell: (props) => <NameColumn row={props.row.original} />,
            },
            {
                header: 'Email',
                accessorKey: 'email',
                cell: (props) => {
                    const { email } = props.row.original
                    return <span className="font-semibold">{email}</span>
                },
            },
            {
                header: 'Phone',
                accessorKey: 'phone',
                cell: (props) => {
                    const { phone, phone_code } = props.row.original
                    return (
                        <span className="font-semibold">
                            {phone_code} {phone}
                        </span>
                    )
                },
            },
            {
                header: 'Last Login',
                accessorKey: 'last_login_at',
                cell: (props) => {
                    const { last_login_at } = props.row.original
                    return (
                        <span className="font-semibold">
                            {last_login_at
                                ? dayjs(last_login_at).format('DD/MM/YYYY HH:mm')
                                : 'Never'}
                        </span>
                    )
                },
            },
            {
                header: 'Status',
                accessorKey: 'is_active',
                cell: (props) => {
                    const { is_active } = props.row.original
                    const style =
                        statusColor[String(is_active)] || statusColor['0']

                    return (
                        <Tag className={style.bgClass}>
                            <span
                                className={`capitalize font-semibold ${style.textClass}`}
                            >
                                {style.label}
                            </span>
                        </Tag>
                    )
                },
            },
            {
                header: () => <span className="block text-center">Actions</span>,
                id: 'action',
                accessorKey: 'id',
                cell: (props) => <ActionColumn row={props.row.original} />,
            },
        ],
        [],
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
        <DataTable
            columns={columns}
            data={teamList}
            noData={teamList.length === 0}
            skeletonAvatarColumns={[0]}
            skeletonAvatarProps={{ width: 28, height: 28 }}
            loading={initialLoading}
            pagingData={{
                total: teamListTotal,
                pageIndex,
                pageSize,
            }}
            onPaginationChange={handlePaginationChange}
            onSelectChange={handleSelectChange}
            onSort={handleSort}
        />
    )
}

export default TeamListTable
