'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Checkbox from '@/components/ui/Checkbox'
import { Form, FormItem } from '@/components/ui/Form'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { TbTrash } from 'react-icons/tb'
import { useRouter } from 'next/navigation'

type ApiResponsePayload = {
    status?: boolean
    success?: boolean
    message?: string
    data?: unknown
}

type ServiceOption = {
    id: string
    name: string
    serviceCode: string
    category: string
    description: string
}

const ProductCreate = () => {
    const router = useRouter()
    const [packageName, setPackageName] = useState('')
    const [description, setDescription] = useState('')
    const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([])
    const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([])
    const [serviceLoading, setServiceLoading] = useState(false)
    const [packageNameError, setPackageNameError] = useState('')
    const [servicesError, setServicesError] = useState('')

    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)

    const selectedServicesCount = useMemo(
        () => selectedServiceIds.length,
        [selectedServiceIds],
    )

    const mapServiceOption = (item: unknown): ServiceOption => {
        const record =
            item && typeof item === 'object'
                ? (item as Record<string, unknown>)
                : {}

        return {
            id: String(record.id ?? ''),
            name: String(record.service_name ?? record.name ?? ''),
            serviceCode: String(record.service_code ?? ''),
            category: String(record.service_category_name ?? ''),
            description: String(record.description ?? ''),
        }
    }

    const fetchServices = useCallback(async () => {
        setServiceLoading(true)
        try {
            const response = await fetch('/api/client/services?page=1&limit=200', {
                method: 'GET',
                cache: 'no-store',
            })
            const payload = ((await response.json()) as ApiResponsePayload) || {}
            const isSuccess =
                payload.status === true || payload.success === true

            if (!response.ok || !isSuccess) {
                toast.push(
                    <Notification type="danger">
                        {payload.message || 'Failed to fetch services.'}
                    </Notification>,
                    { placement: 'top-center' },
                )
                setServiceOptions([])
                return
            }

            const dataRecord =
                payload.data && typeof payload.data === 'object'
                    ? (payload.data as Record<string, unknown>)
                    : {}
            const listValue = dataRecord.list
            const list = Array.isArray(listValue) ? listValue : []
            const mappedList = list
                .map(mapServiceOption)
                .filter((item) => item.id.length > 0)

            setServiceOptions(mappedList)
        } catch {
            toast.push(
                <Notification type="danger">
                    Failed to fetch services.
                </Notification>,
                { placement: 'top-center' },
            )
            setServiceOptions([])
        } finally {
            setServiceLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchServices()
    }, [fetchServices])

    const handleServiceToggle = (checked: boolean, serviceId: string) => {
        setSelectedServiceIds((prev) => {
            if (checked) {
                if (prev.includes(serviceId)) {
                    return prev
                }
                return [...prev, serviceId]
            }

            return prev.filter((id) => id !== serviceId)
        })
        if (servicesError) {
            setServicesError('')
        }
    }

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const trimmedPackageName = packageName.trim()

        if (!trimmedPackageName) {
            setPackageNameError('Package name is required.')
        } else {
            setPackageNameError('')
        }

        if (selectedServiceIds.length === 0) {
            setServicesError('Please select at least one service.')
        } else {
            setServicesError('')
        }

        if (!trimmedPackageName || selectedServiceIds.length === 0) {
            return
        }

        try {
            setIsSubmiting(true)

            const normalizedServiceIds = selectedServiceIds.map((id) => {
                const parsedId = Number.parseInt(id, 10)
                return Number.isInteger(parsedId) ? parsedId : id
            })

            const response = await fetch('/api/client/packages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    package_name: trimmedPackageName,
                    description: description.trim(),
                    service_ids: normalizedServiceIds,
                }),
            })

            const payload = ((await response.json()) as ApiResponsePayload) || {}
            const isSuccess =
                payload.status === true || payload.success === true

            if (!response.ok || !isSuccess) {
                toast.push(
                    <Notification type="danger">
                        {payload.message || 'Failed to create package.'}
                    </Notification>,
                    { placement: 'top-center' },
                )
                return
            }

            toast.push(
                <Notification type="success">
                    {payload.message || 'Package created successfully.'}
                </Notification>,
                { placement: 'top-center' },
            )
            router.push('/packages/list')
        } catch {
            toast.push(
                <Notification type="danger">
                    Failed to create package.
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setIsSubmiting(false)
        }
    }

    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(false)
        toast.push(
            <Notification type="success">Package discarded.</Notification>,
            { placement: 'top-center' },
        )
        router.push('/packages/list')
    }

    const handleDiscard = () => {
        setDiscardConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDiscardConfirmationOpen(false)
    }

    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="mb-4">
                        <h3>Create Package</h3>
                    </div>
                    <Form onSubmit={handleFormSubmit}>
                        <FormItem
                            label="Package Name"
                            asterisk
                            invalid={Boolean(packageNameError)}
                            errorMessage={packageNameError}
                        >
                            <Input
                                placeholder="Enter package name"
                                value={packageName}
                                onChange={(event) => {
                                    setPackageName(event.target.value)
                                    if (packageNameError) {
                                        setPackageNameError('')
                                    }
                                }}
                            />
                        </FormItem>
                        <FormItem label="Description">
                            <Input
                                placeholder="Enter description (optional)"
                                value={description}
                                onChange={(event) =>
                                    setDescription(event.target.value)
                                }
                            />
                        </FormItem>

                        <FormItem
                            label={`Services (${selectedServicesCount} selected)`}
                            asterisk
                            invalid={Boolean(servicesError)}
                            errorMessage={servicesError}
                        >
                            <div className="max-h-[360px] overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                {serviceLoading && (
                                    <p className="text-sm text-gray-500">
                                        Loading services...
                                    </p>
                                )}

                                {!serviceLoading && serviceOptions.length === 0 && (
                                    <p className="text-sm text-gray-500">
                                        No services available.
                                    </p>
                                )}

                                {!serviceLoading &&
                                    serviceOptions.map((service) => (
                                        <div
                                            key={service.id}
                                            className="py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                                        >
                                            <Checkbox
                                                checked={selectedServiceIds.includes(
                                                    service.id,
                                                )}
                                                onChange={(value) =>
                                                    handleServiceToggle(
                                                        value,
                                                        service.id,
                                                    )
                                                }
                                            >
                                                <div className="flex flex-col">
                                                    <span className="font-semibold">
                                                        {service.name ||
                                                            service.serviceCode}
                                                    </span>
                                                    {service.serviceCode && (
                                                        <span className="text-xs text-gray-500">
                                                            {service.serviceCode}
                                                        </span>
                                                    )}
                                                    {service.category && (
                                                        <span className="text-xs text-gray-500 mt-1">
                                                            {service.category}
                                                        </span>
                                                    )}
                                                    {service.description && (
                                                        <span className="text-xs text-gray-500 mt-1">
                                                            {service.description}
                                                        </span>
                                                    )}
                                                </div>
                                            </Checkbox>
                                        </div>
                                    ))}
                            </div>
                        </FormItem>

                        <div className="flex items-center justify-end mt-6">
                            <Button
                                className="ltr:mr-3 rtl:ml-3"
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
                                variant="solid"
                                type="submit"
                                loading={isSubmiting}
                            >
                                Create Package
                            </Button>
                        </div>
                    </Form>
                </AdaptiveCard>
            </Container>
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

export default ProductCreate
