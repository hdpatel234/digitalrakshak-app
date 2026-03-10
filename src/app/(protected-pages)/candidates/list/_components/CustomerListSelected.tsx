'use client'

import { useState } from 'react'
import StickyFooter from '@/components/shared/StickyFooter'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import Dialog from '@/components/ui/Dialog'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { useCustomerListStore } from '../_store/customerListStore'
import { useRouter } from 'next/navigation'
import { TbChecks, TbSend } from 'react-icons/tb'
import type { Customer } from '../types'

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

const CustomerListSelected = () => {
    const router = useRouter()
    const customerList = useCustomerListStore((state) => state.customerList)
    const setCustomerList = useCustomerListStore(
        (state) => state.setCustomerList,
    )
    const selectedCustomer = useCustomerListStore(
        (state) => state.selectedCustomer,
    )
    const setSelectAllCustomer = useCustomerListStore(
        (state) => state.setSelectAllCustomer,
    )

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [sendInvitationLoading, setSendInvitationLoading] = useState(false)
    const [inviteModalOpen, setInviteModalOpen] = useState(false)
    const [packageOptions, setPackageOptions] = useState<PackageOption[]>([])
    const [selectedPackageIds, setSelectedPackageIds] = useState<string[]>([])
    const [isPackageLoading, setIsPackageLoading] = useState(false)
    const [createdSelectedCandidates, setCreatedSelectedCandidates] = useState<
        Partial<Customer>[]
    >([])
    const hasCreatedSelectedCandidates = selectedCustomer.some(
        (candidate) =>
            String(candidate.status || '').trim().toLowerCase() === 'created',
    )

    const handleDelete = () => {
        setDeleteConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
    }

    const handleConfirmDelete = () => {
        const newCustomerList = customerList.filter((customer) => {
            return !selectedCustomer.some(
                (selected) => selected.id === customer.id,
            )
        })
        setSelectAllCustomer([])
        setCustomerList(newCustomerList)
        setDeleteConfirmationOpen(false)
    }

    const closeInviteModal = () => {
        setInviteModalOpen(false)
        setSelectedPackageIds([])
        setPackageOptions([])
        setIsPackageLoading(false)
        setSendInvitationLoading(false)
        setCreatedSelectedCandidates([])
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

    const handleSendInvitation = async () => {
        const eligibleCandidates = selectedCustomer.filter(
            (candidate) =>
                String(candidate.status || '')
                    .trim()
                    .toLowerCase() === 'created',
        )

        if (eligibleCandidates.length === 0) {
            toast.push(
                <Notification type="danger">
                    Please select candidate(s) with created status.
                </Notification>,
                { placement: 'top-center' },
            )
            return
        }

        setCreatedSelectedCandidates(eligibleCandidates)
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

    const handleBulkInviteSubmit = async () => {
        if (selectedPackageIds.length === 0) {
            toast.push(
                <Notification type="danger">
                    Please select at least one package.
                </Notification>,
                { placement: 'top-center' },
            )
            return
        }

        const candidateIds = Array.from(
            new Set(
                createdSelectedCandidates
                    .map((candidate) =>
                        Number.parseInt(String(candidate.id || ''), 10),
                    )
                    .filter((id) => Number.isInteger(id)),
            ),
        )
        const packageIds = Array.from(
            new Set(
                selectedPackageIds
                    .map((id) => Number.parseInt(String(id), 10))
                    .filter((id) => Number.isInteger(id)),
            ),
        )

        if (candidateIds.length === 0) {
            toast.push(
                <Notification type="danger">
                    No valid candidate found for invite.
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

        setSendInvitationLoading(true)
        try {
            const response = await fetch('/api/client/candidates/bulk-invite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    candidate_ids: candidateIds,
                    package_ids: packageIds,
                }),
            })
            const payload = ((await response.json()) as ApiResponsePayload) || {}
            const isSuccess =
                payload.status === true || payload.success === true

            if (!response.ok || !isSuccess) {
                toast.push(
                    <Notification type="danger">
                        {payload.message || 'Failed to send invitations.'}
                    </Notification>,
                    { placement: 'top-center' },
                )
                return
            }

            toast.push(
                <Notification type="success">
                    {payload.message || 'Invitations sent successfully.'}
                </Notification>,
                { placement: 'top-center' },
            )
            closeInviteModal()
            setSelectAllCustomer([])
            router.refresh()
        } catch {
            toast.push(
                <Notification type="danger">
                    Failed to send invitations.
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setSendInvitationLoading(false)
        }
    }

    return (
        <>
            {selectedCustomer.length > 0 && (
                <StickyFooter
                    className=" flex items-center justify-between py-4 bg-white dark:bg-gray-800"
                    stickyClass="-mx-4 sm:-mx-8 border-t border-gray-200 dark:border-gray-700 px-8"
                    defaultClass="container mx-auto px-8 rounded-xl border border-gray-200 dark:border-gray-600 mt-4"
                >
                    <div className="container mx-auto">
                        <div className="flex items-center justify-between">
                            <span>
                                {selectedCustomer.length > 0 && (
                                    <span className="flex items-center gap-2">
                                        <span className="text-lg text-primary">
                                            <TbChecks />
                                        </span>
                                        <span className="font-semibold flex items-center gap-1">
                                            <span className="heading-text">
                                                {selectedCustomer.length}{' '}
                                                Candidates
                                            </span>
                                            <span>selected</span>
                                        </span>
                                    </span>
                                )}
                            </span>

                            <div className="flex items-center">
                                {hasCreatedSelectedCandidates && (
                                    <Button
                                        size="sm"
                                        className="ltr:mr-3 rtl:ml-3"
                                        variant="solid"
                                        icon={<TbSend />}
                                        loading={sendInvitationLoading}
                                        onClick={handleSendInvitation}
                                    >
                                        Send Invitation
                                    </Button>
                                )}
                                <Button
                                    size="sm"
                                    type="button"
                                    customColorClass={() =>
                                        'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error'
                                    }
                                    onClick={handleDelete}
                                >
                                    Remove
                                </Button>
                            </div>
                        </div>
                    </div>
                </StickyFooter>
            )}
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Remove candidates"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    Are you sure you want to remove these candidates? This
                    action can&apos;t be undone.
                </p>
            </ConfirmDialog>

            <Dialog
                isOpen={inviteModalOpen}
                onClose={closeInviteModal}
                onRequestClose={closeInviteModal}
                width={700}
            >
                <h4 className="mb-2">Send Bulk Invitation</h4>
                <p className="text-sm text-gray-500 mb-4">
                    Select package(s) for {createdSelectedCandidates.length}{' '}
                    candidate(s) with created status.
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
                        loading={sendInvitationLoading}
                        onClick={handleBulkInviteSubmit}
                    >
                        Invite
                    </Button>
                </div>
            </Dialog>
        </>
    )
}

export default CustomerListSelected
