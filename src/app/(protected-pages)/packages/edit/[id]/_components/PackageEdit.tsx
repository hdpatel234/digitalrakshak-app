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
import BottomStickyBar from '@/components/template/BottomStickyBar'

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
    price: number
}

const PackageEdit = ({ packageId }: { packageId: string }) => {
    const router = useRouter()
    const [packageName, setPackageName] = useState('')
    const [description, setDescription] = useState('')
    const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([])
    const [packageLoading, setPackageLoading] = useState(true)
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

    const accumulatedCost = useMemo(() => {
        return selectedServiceIds.reduce((total, id) => {
            const service = serviceOptions.find((s) => s.id === id)
            return total + (service?.price || 0)
        }, 0)
    }, [selectedServiceIds, serviceOptions])

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
            price: Number(record.price ?? record.base_price ?? 0),
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

    useEffect(() => {
        const fetchPackage = async () => {
            try {
                const response = await fetch(`/api/client/packages/${packageId}`)
                const payload = await response.json()
                if (payload.status && payload.data) {
                    setPackageName(payload.data.name || '')
                    setDescription(payload.data.description || '')
                    // Assuming payload.data.services is an array of service objects or IDs
                    if (Array.isArray(payload.data.services)) {
                        setSelectedServiceIds(payload.data.services.map((s: any) => String(s.id || s)))
                    }
                }
            } catch (error) {
                console.error('Failed to fetch package details', error)
            } finally {
                setPackageLoading(false)
            }
        }
        fetchPackage()
    }, [packageId])

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

            const response = await fetch(`/api/client/packages/${packageId}`, {
                method: 'PUT',
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
                        {payload.message || 'Failed to update package.'}
                </Notification>,
                { placement: 'top-center' },
            )
            return
        }

        toast.push(
            <Notification type="success">
                {payload.message || 'Package updated successfully.'}
            </Notification>,
            { placement: 'top-center' },
        )
        router.push('/packages/list')
    } catch {
        toast.push(
            <Notification type="danger">
                Failed to update package.
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
                        <h3>Edit Package</h3>
                    </div>
                    <Form onSubmit={handleFormSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        </div>

                        <FormItem
                            label={`Services (${selectedServicesCount} selected)`}
                            asterisk
                            invalid={Boolean(servicesError)}
                            errorMessage={servicesError}
                        >
                            <div className="max-h-[400px] overflow-y-auto border border-gray-100 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-800/50 rounded-xl p-5 shadow-inner">
                                {serviceLoading && (
                                    <div className="flex items-center justify-center p-8">
                                        <p className="text-sm font-medium text-gray-500">
                                            Loading services...
                                        </p>
                                    </div>
                                )}

                                {!serviceLoading && serviceOptions.length === 0 && (
                                    <div className="flex items-center justify-center p-8">
                                        <p className="text-sm font-medium text-gray-500">
                                            No services available.
                                        </p>
                                    </div>
                                )}

                                {!serviceLoading && serviceOptions.length > 0 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                                        {serviceOptions.map((service) => {
                                            const isSelected = selectedServiceIds.includes(service.id)
                                            return (
                                                <div
                                                    key={service.id}
                                                    className={`group relative p-4 border rounded-xl transition-all duration-200 ${
                                                        isSelected
                                                            ? 'border-indigo-500 bg-indigo-50/80 shadow-sm shadow-indigo-100 dark:border-indigo-500 dark:bg-indigo-900/20 dark:shadow-none'
                                                            : 'border-gray-200 bg-white shadow-sm hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-indigo-500'
                                                    }`}
                                                >
                                                    <Checkbox
                                                        checked={isSelected}
                                                        onChange={(value) =>
                                                            handleServiceToggle(value, service.id)
                                                        }
                                                        className="w-full flex items-start"
                                                    >
                                                        <div className="flex flex-col w-full text-left ltr:ml-3 rtl:mr-3">
                                                            <div className="flex items-start justify-between w-full">
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`font-semibold text-base transition-colors ${isSelected ? 'text-indigo-900 dark:text-indigo-100' : 'text-gray-900 dark:text-gray-100'}`}>
                                                                        {service.name || service.serviceCode}
                                                                    </span>
                                                                    {service.serviceCode && (
                                                                        <span className="text-[11px] font-semibold px-2 py-1 bg-gray-100 text-gray-600 rounded-md dark:bg-gray-800 dark:text-gray-300 whitespace-nowrap">
                                                                            {service.serviceCode}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <span className="font-semibold text-gray-500 text-base">
                                                                    ₹{service.price}
                                                                </span>
                                                            </div>
                                                            {service.category && (
                                                                <span className="text-[11px] font-bold text-indigo-500 mt-1 uppercase tracking-widest">
                                                                    {service.category}
                                                                </span>
                                                            )}
                                                            {service.description && (
                                                                <span className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed" title={service.description}>
                                                                    {service.description}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </Checkbox>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        </FormItem>

                        <div className="mt-4 px-5 py-4 border border-gray-900 dark:border-white rounded-xl flex justify-between items-center shadow-sm">
                            <span className="font-semibold text-gray-500 dark:text-gray-400">
                                Accumulated Per Candidate Cost:
                            </span>
                            <span className="font-bold text-xl text-gray-900 dark:text-white">
                                ₹{accumulatedCost.toFixed(2)}
                            </span>
                        </div>

                        <BottomStickyBar>
                            <div className="flex items-center justify-end">
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
                                    className="w-full"
                                    variant="solid"
                                    type="submit"
                                    loading={isSubmiting || packageLoading}
                                >
                                    Update Package
                                </Button>
                            </div>
                        </BottomStickyBar>
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
                    Are you sure you want to discard your changes? This action
                    cannot be undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default PackageEdit
