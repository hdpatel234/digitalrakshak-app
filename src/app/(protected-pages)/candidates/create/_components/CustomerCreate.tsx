'use client'
import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import CustomerForm from '@/components/view/CustomerForm'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Dialog from '@/components/ui/Dialog'
import Checkbox from '@/components/ui/Checkbox'
import { TbTrash, TbPlus, TbSend } from 'react-icons/tb'
import { useRouter } from 'next/navigation'
import type { CustomerFormSchema } from '@/components/view/CustomerForm'
import { apiCreateCandidate } from '@/services/client/candidates'
import type { AxiosError } from 'axios'

const initialFormValues: CustomerFormSchema = {
    firstName: '',
    lastName: '',
    email: '',
    img: '',
    phoneNumber: '',
    dialCode: '',
    country: '',
    state: '',
    city: '',
    address: '',
    postcode: '',
    managerEmails: [''],
    tags: [],
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

const CustomerEdit = () => {
    const router = useRouter()

    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false)
    const [inviteModalOpen, setInviteModalOpen] = useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)
    const [isInviteSubmitting, setIsInviteSubmitting] = useState(false)
    const [isPackageLoading, setIsPackageLoading] = useState(false)
    const [formKey, setFormKey] = useState(0)
    const [submitAction, setSubmitAction] = useState<'create' | 'invite'>(
        'create',
    )
    const [packageOptions, setPackageOptions] = useState<PackageOption[]>([])
    const [selectedPackageIds, setSelectedPackageIds] = useState<string[]>([])
    const [pendingInviteValues, setPendingInviteValues] =
        useState<CustomerFormSchema | null>(null)

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

    const closeInviteModal = () => {
        setInviteModalOpen(false)
        setSelectedPackageIds([])
        setPackageOptions([])
        setIsPackageLoading(false)
        setIsInviteSubmitting(false)
        setPendingInviteValues(null)
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
                <Notification type="danger">Failed to fetch packages.</Notification>,
                { placement: 'top-center' },
            )
            setPackageOptions([])
        } finally {
            setIsPackageLoading(false)
        }
    }

    const createCandidate = async (
        values: CustomerFormSchema,
        options?: {
            isInvite?: boolean
            packageIds?: number[]
        },
    ) => {
        try {
            setIsSubmiting(true)
            const inviteEnabled = Boolean(options?.isInvite)
            const packageIds = Array.isArray(options?.packageIds)
                ? options?.packageIds
                : []

            const response = await apiCreateCandidate({
                ...values,
                send_invite: inviteEnabled,
                is_invite: inviteEnabled,
                package_ids: packageIds,
            })

            if (!response.status) {
                toast.push(
                    <Notification type="danger">
                        {response.message || 'Failed to create candidate'}
                    </Notification>,
                    { placement: 'top-center' },
                )
                return false
            }

            toast.push(
                <Notification type="success">
                    {response.message || 'Candidate created successfully'}
                </Notification>,
                { placement: 'top-center' },
            )

            // Remount form to clear all values after successful create.
            setFormKey((prev) => prev + 1)
            if (inviteEnabled) {
                closeInviteModal()
            }
            return true
        } catch (error) {
            const axiosError = error as AxiosError<{
                message?: string
                error?: string
                errors?: Record<string, string[]>
            }>
            const validationErrors = axiosError?.response?.data?.errors
            const firstValidationMessage = validationErrors
                ? Object.values(validationErrors).find(
                      (messages) => Array.isArray(messages) && messages.length,
                  )?.[0]
                : ''

            const message =
                firstValidationMessage ||
                axiosError?.response?.data?.message ||
                axiosError?.response?.data?.error ||
                (error instanceof Error
                    ? error.message
                    : 'Failed to create candidate')

            toast.push(
                <Notification type="danger">{message}</Notification>,
                { placement: 'top-center' },
            )
            return false
        } finally {
            setIsSubmiting(false)
        }
    }

    const handleFormSubmit = async (values: CustomerFormSchema) => {
        if (submitAction === 'invite') {
            setPendingInviteValues(values)
            setSelectedPackageIds([])
            setInviteModalOpen(true)
            await fetchPackageOptions()
            return
        }

        await createCandidate(values)
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
        if (!pendingInviteValues) {
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

        const packageIds = selectedPackageIds
            .map((id) => Number.parseInt(String(id), 10))
            .filter((id) => Number.isInteger(id) && id > 0)

        if (packageIds.length === 0) {
            toast.push(
                <Notification type="danger">
                    Please select valid package(s).
                </Notification>,
                { placement: 'top-center' },
            )
            return
        }

        setIsInviteSubmitting(true)
        await createCandidate(pendingInviteValues, {
            isInvite: true,
            packageIds,
        })
        setIsInviteSubmitting(false)
    }

    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(false)
        toast.push(
            <Notification type="success">Candiate discarded</Notification>,
            { placement: 'top-center' },
        )
        setTimeout(() => {
            router.push('/candidates/list')
        }, 0)
    }

    const handleDiscard = () => {
        setDiscardConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDiscardConfirmationOpen(false)
    }

    return (
        <>
            <CustomerForm
                key={formKey}
                newCustomer
                defaultValues={initialFormValues}
                onFormSubmit={handleFormSubmit}
            >
                <Container>
                    <div className="flex flex-col gap-3 px-4 sm:px-8 sm:flex-row sm:items-center sm:justify-between">
                        <span className="hidden sm:block"></span>
                        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                            <Button
                                className="w-full sm:w-auto"
                                type="button"
                                customColorClass={() =>
                                    'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent'
                                }
                                icon={<TbTrash />}
                                onClick={handleDiscard}
                            >
                                Discard
                            </Button>
                            <Button
                                className="w-full sm:w-auto"
                                variant="solid"
                                type="submit"
                                icon={<TbPlus />}
                                onClick={() => setSubmitAction('create')}
                                loading={
                                    isSubmiting && submitAction === 'create'
                                }
                                disabled={isSubmiting}
                            >
                                Create
                            </Button>
                            <Button
                                className="w-full sm:w-auto"
                                variant="solid"
                                type="submit"
                                icon={<TbSend />}
                                onClick={() => setSubmitAction('invite')}
                                loading={
                                    (isSubmiting && submitAction === 'invite') ||
                                    isInviteSubmitting
                                }
                                disabled={isSubmiting || isInviteSubmitting}
                            >
                                Create & Send Invite
                            </Button>
                        </div>
                    </div>
                </Container>
            </CustomerForm>

            <Dialog
                isOpen={inviteModalOpen}
                onClose={closeInviteModal}
                onRequestClose={closeInviteModal}
                width={700}
            >
                <h4 className="mb-2">Select Packages</h4>
                <p className="text-sm text-gray-500 mb-4">
                    Choose package(s) before sending the invite.
                </p>

                <div className="max-h-[360px] overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    {isPackageLoading && (
                        <p className="text-sm text-gray-500">Loading packages...</p>
                    )}

                    {!isPackageLoading && packageOptions.length === 0 && (
                        <p className="text-sm text-gray-500">No packages available.</p>
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
                        disabled={isInviteSubmitting || isSubmiting}
                        onClick={handleInviteSubmit}
                    >
                        Send Invite
                    </Button>
                </div>
            </Dialog>

            <ConfirmDialog
                isOpen={discardConfirmationOpen}
                type="danger"
                title="Discard changes"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDiscard}
            >
                <p>
                    Are you sure you want discard this? This action can&apos;t
                    be undo.{' '}
                </p>
            </ConfirmDialog>
        </>
    )
}

export default CustomerEdit

