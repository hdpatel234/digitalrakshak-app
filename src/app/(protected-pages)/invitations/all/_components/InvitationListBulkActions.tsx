'use client'

import { useState } from 'react'
import StickyFooter from '@/components/shared/StickyFooter'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { useInvitationListStore } from '../_store/invitationListStore'
import { useRouter } from 'next/navigation'
import { TbChecks } from 'react-icons/tb'

const InvitationListBulkActions = () => {
    const router = useRouter()
    const selectedInvitations = useInvitationListStore(
        (state) => state.selectedInvitations,
    )
    const setSelectAllInvitations = useInvitationListStore(
        (state) => state.setSelectAllInvitations,
    )

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

    const clearSelection = () => {
        setSelectAllInvitations([])
    }

    const handleBulkResend = async () => {
        setIsSubmitting(true)
        try {
            const results = await Promise.all(
                selectedInvitations.map(async (invitation) => {
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
                    return Boolean(response.ok && payload.status)
                }),
            )

            const successCount = results.filter(Boolean).length
            toast.push(
                <Notification type={successCount > 0 ? 'success' : 'danger'}>
                    {successCount > 0
                        ? `${successCount} invitation(s) resent successfully.`
                        : 'Failed to resend selected invitations.'}
                </Notification>,
                { placement: 'top-center' },
            )
            clearSelection()
            router.refresh()
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleBulkDelete = async () => {
        setIsSubmitting(true)
        try {
            const results = await Promise.all(
                selectedInvitations.map(async (invitation) => {
                    const response = await fetch(
                        `/api/client/invitations/${invitation.id}`,
                        {
                            method: 'DELETE',
                        },
                    )
                    const payload = (await response.json()) as {
                        status?: boolean
                    }
                    return Boolean(response.ok && payload.status)
                }),
            )

            const successCount = results.filter(Boolean).length
            toast.push(
                <Notification type={successCount > 0 ? 'success' : 'danger'}>
                    {successCount > 0
                        ? `${successCount} invitation(s) deleted successfully.`
                        : 'Failed to delete selected invitations.'}
                </Notification>,
                { placement: 'top-center' },
            )
            clearSelection()
            router.refresh()
        } finally {
            setIsSubmitting(false)
            setDeleteDialogOpen(false)
        }
    }

    if (selectedInvitations.length === 0) {
        return null
    }

    return (
        <>
            <StickyFooter
                className="flex items-center justify-between py-4 bg-white dark:bg-gray-800"
                stickyClass="-mx-4 sm:-mx-8 border-t border-gray-200 dark:border-gray-700 px-8"
                defaultClass="container mx-auto px-8 rounded-xl border border-gray-200 dark:border-gray-600 mt-4"
            >
                <div className="container mx-auto">
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <span className="text-lg text-primary">
                                <TbChecks />
                            </span>
                            <span className="font-semibold">
                                {selectedInvitations.length} invitation(s)
                                selected
                            </span>
                        </span>
                        <div className="flex items-center gap-2">
                            <Button size="sm" onClick={clearSelection}>
                                Clear
                            </Button>
                            <Button
                                size="sm"
                                variant="solid"
                                loading={isSubmitting}
                                onClick={handleBulkResend}
                            >
                                Resend Selected
                            </Button>
                            <Button
                                size="sm"
                                customColorClass={() =>
                                    'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error'
                                }
                                loading={isSubmitting}
                                onClick={() => setDeleteDialogOpen(true)}
                            >
                                Delete Selected
                            </Button>
                        </div>
                    </div>
                </div>
            </StickyFooter>

            <ConfirmDialog
                isOpen={deleteDialogOpen}
                type="danger"
                title="Delete selected invitations"
                onClose={() => setDeleteDialogOpen(false)}
                onRequestClose={() => setDeleteDialogOpen(false)}
                onCancel={() => setDeleteDialogOpen(false)}
                onConfirm={handleBulkDelete}
            >
                <p>This action cannot be undone.</p>
            </ConfirmDialog>
        </>
    )
}

export default InvitationListBulkActions
