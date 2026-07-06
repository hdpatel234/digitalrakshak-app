'use client'
import { useState, useEffect } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import CustomerForm from '@/components/view/CustomerForm'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Dialog from '@/components/ui/Dialog'
import Checkbox from '@/components/ui/Checkbox'
import Radio from '@/components/ui/Radio'
import { TbTrash, TbPlus, TbSend } from 'react-icons/tb'
import { useRouter, useSearchParams } from 'next/navigation'
import type { CustomerFormSchema } from '@/components/view/CustomerForm'
import { apiCreateCandidate, apiSendCandidateInvite } from '@/services/client/candidates'
import type { AxiosError } from 'axios'

const initialFormValues: CustomerFormSchema = {
    firstName: '',
    lastName: '',
    email: '',
    img: '',
    phoneNumber: '',
    dialCode: '+91',
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
    services?: any[]
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
    const searchParams = useSearchParams()
    const urlPackageId = searchParams?.get('package_id')
    
    const [selectedPackageIds, setSelectedPackageIds] = useState<string[]>(
        urlPackageId ? [urlPackageId] : []
    )
    const [pendingInviteValues, setPendingInviteValues] =
        useState<CustomerFormSchema | null>(null)
    const [dynamicFields, setDynamicFields] = useState<any[]>([])
    const [isFieldsLoading, setIsFieldsLoading] = useState(false)
    const [isPackageSelectionModalOpen, setIsPackageSelectionModalOpen] = useState(!urlPackageId)
    const [selectedServices, setSelectedServices] = useState<any[]>([])

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
            services: Array.isArray(record.services) ? record.services : [],
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
                <Notification type="danger">Failed to fetch packages.</Notification>,
                { placement: 'top-center' },
            )
            setPackageOptions([])
        } finally {
            setIsPackageLoading(false)
        }
    }

    useEffect(() => {
        fetchPackageOptions()
    }, [])

    useEffect(() => {
        const fetchFields = async () => {
            if (selectedPackageIds.length === 0) {
                setDynamicFields([])
                return
            }

            setIsFieldsLoading(true)
            try {
                const allFields = []
                const allServices = []
                for (const pkgId of selectedPackageIds) {
                    const res = await fetch(`/api/client/packages/${pkgId}/services`, {
                        method: 'GET',
                    })
                    const payload = await res.json()
                    const isSuccess = payload.status === true || payload.success === true
                    if (isSuccess && payload.data && Array.isArray(payload.data.services)) {
                        payload.data.services.forEach((service: any) => {
                            allServices.push(service)
                            if (Array.isArray(service.fields)) {
                                allFields.push(...service.fields)
                            }
                        })
                    }
                }
                
                // Deduplicate fields by field_name
                const uniqueFields = []
                const fieldNames = new Set()
                for (const field of allFields) {
                    if (!fieldNames.has(field.field_name)) {
                        fieldNames.add(field.field_name)
                        uniqueFields.push(field)
                    }
                }
                
                setDynamicFields(uniqueFields)
                setSelectedServices(allServices)
            } catch (err) {
                console.error("Failed to fetch dynamic fields and services", err)
            } finally {
                setIsFieldsLoading(false)
            }
        }

        fetchFields()
    }, [selectedPackageIds])

    const closePackageSelectionModal = () => {
        setIsPackageSelectionModalOpen(false)
    }

    const closeInviteModal = () => {
        setInviteModalOpen(false)
        setSelectedPackageIds([])
        setPackageOptions([])
        setIsPackageLoading(false)
        setIsInviteSubmitting(false)
        setPendingInviteValues(null)
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

            let successMessage = response.message || 'Candidate created successfully'
            
            if (inviteEnabled) {
                const createdData = response.data as any
                const candidateId = createdData?.id || createdData?.candidate_id || createdData?.candidate?.id
                if (candidateId) {
                    try {
                        await apiSendCandidateInvite(candidateId, {
                            candidate_ids: [candidateId],
                            package_ids: packageIds,
                        })
                        successMessage = 'Candiate added and invite sended succesfully.'
                    } catch (err) {
                        console.error('Failed to send invite', err)
                        successMessage = 'Candidate added, but failed to send invite.'
                    }
                } else {
                    successMessage = 'Candidate added, but unable to send invite directly (ID not found).'
                }
            }

            toast.push(
                <Notification type="success">
                    {successMessage}
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

        const isInvite = submitAction === 'invite'

        await createCandidate(values, {
            isInvite,
            packageIds,
        })
    }

    const handlePackageToggle = (packageId: string) => {
        setSelectedPackageIds([packageId])
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
            <Dialog
                isOpen={isPackageSelectionModalOpen}
                onClose={() => {}}
                onRequestClose={() => {}}
                closable={false}
                width={700}
            >
                <div className="mb-6">
                    <h4 className="mb-2">Select Packages</h4>
                    <p className="text-sm text-gray-500 mb-4">
                        Please choose one or more packages before creating the candidate.
                    </p>

                    <div className="max-h-[360px] overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
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
                                    <Radio
                                        checked={selectedPackageIds.includes(pkg.id)}
                                        onChange={() =>
                                            handlePackageToggle(pkg.id)
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
                                            {pkg.services && pkg.services.length > 0 && (
                                                <div className="mt-2 flex flex-wrap gap-1">
                                                    {pkg.services.map((svc: any) => (
                                                        <span key={svc.service_id} className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-[10px] font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                            {svc.service_name}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </Radio>
                                </div>
                            ))}
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <Button 
                        variant="solid" 
                        onClick={closePackageSelectionModal} 
                        disabled={selectedPackageIds.length === 0}
                    >
                        Continue
                    </Button>
                </div>
            </Dialog>

            <Container>
                {selectedPackageIds.length > 0 && (
                    <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-lg">Selected Packages</h4>
                            <Button size="sm" onClick={() => setIsPackageSelectionModalOpen(true)}>Change</Button>
                        </div>
                        <div className="flex flex-col gap-4">
                            {packageOptions
                                .filter(pkg => selectedPackageIds.includes(pkg.id))
                                .map(pkg => (
                                    <div key={pkg.id}>
                                        <h5 className="font-semibold">{pkg.name} ({pkg.packageCode})</h5>
                                        {selectedServices.length > 0 && (
                                            <div className="mt-2">
                                                <span className="text-sm text-gray-500 font-semibold block mb-1">Included Services:</span>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedServices.filter(s => String(s.package_id) === pkg.id).map(service => (
                                                        <span key={service.service_id} className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                            {service.service_name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                )}
            </Container>

            {isFieldsLoading && (
                <Container>
                    <div className="my-4 text-center text-gray-500">
                        Loading required fields for selected packages...
                    </div>
                </Container>
            )}

            <CustomerForm
                key={formKey}
                newCustomer
                dynamicFields={dynamicFields}
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
                isOpen={false}
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
                                <Radio
                                    checked={selectedPackageIds.includes(pkg.id)}
                                    onChange={() =>
                                        handlePackageToggle(pkg.id)
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
                                        {pkg.services && pkg.services.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-1">
                                                {pkg.services.map((svc: any) => (
                                                    <span key={svc.service_id} className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-[10px] font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                        {svc.service_name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </Radio>
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

