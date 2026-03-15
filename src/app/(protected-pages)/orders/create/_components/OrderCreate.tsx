'use client'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import Container from '@/components/shared/Container'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import OrderForm from '@/components/view/OrderForm'
import { useRouter, useSearchParams } from 'next/navigation'
import { TbTrash } from 'react-icons/tb'
import { useOrderFormStore } from '@/components/view/OrderForm/store/orderFormStore'
import type { OrderFormSchema } from '@/components/view/OrderForm'
import { startOrderPaymentFlow } from '@/utils/payments/orderPaymentFlow'

type ApiResponsePayload = {
    status?: boolean
    success?: boolean
    message?: string
    data?: unknown
}

const mapApiSuccess = (payload: ApiResponsePayload) =>
    payload.status === true || payload.success === true

const OrderCreate = () => {
    const router = useRouter()

    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)
    const [isDraftSubmitting, setIsDraftSubmitting] = useState(false)

    const {
        selectedProduct,
        selectedCandidates,
        productList,
        candidateList,
        paymentMethodId,
        paymentProviderId,
        setPrefillPaymentProviderId,
        setSelectedProduct,
        setCandidateList,
        setSelectedCandidates,
        setPaymentMethodId,
        setPaymentProviderId,
        setValidationErrors,
    } = useOrderFormStore()

    const selectedPackageId = useMemo(
        () => selectedProduct[0]?.id || '',
        [selectedProduct],
    )
    const selectedCandidateIds = useMemo(
        () => selectedCandidates.map((candidate) => candidate.id),
        [selectedCandidates],
    )

    const searchParams = useSearchParams()
    const editOrderId = String(
        searchParams?.get('orderId') || searchParams?.get('id') || '',
    ).trim()
    const isEditMode = Boolean(editOrderId)
    const hasFetchedEditDetails = useRef(false)
    const [prefillPackageId, setPrefillPackageId] = useState('')
    const [prefillCandidateIds, setPrefillCandidateIds] = useState<string[]>([])
    const [isPrefillLoading, setIsPrefillLoading] = useState(false)

    useEffect(() => {
        setSelectedProduct([])
        setCandidateList([])
        setSelectedCandidates([])
        setPaymentMethodId('')
        setPaymentProviderId('')
        setValidationErrors({
            package: '',
            candidates: '',
            paymentProvider: '',
        })
    }, [
        setCandidateList,
        setPaymentMethodId,
        setPaymentProviderId,
        setSelectedCandidates,
        setSelectedProduct,
        setValidationErrors,
    ])

    useEffect(() => {
        if (!prefillPackageId) {
            return
        }

        const selected = productList.find(
            (product) => product.id === prefillPackageId,
        )

        if (selected) {
            setSelectedProduct([{ ...selected, quantity: 1 }])
            setPrefillPackageId('')
        }
    }, [prefillPackageId, productList, setSelectedProduct])

    useEffect(() => {
        if (prefillCandidateIds.length === 0 || candidateList.length === 0) {
            return
        }

        const selected = candidateList.filter((candidate) =>
            prefillCandidateIds.includes(candidate.id),
        )

        if (selected.length > 0) {
            setSelectedCandidates(selected)
            setPrefillCandidateIds([])
        }
    }, [candidateList, prefillCandidateIds, setSelectedCandidates])

    const getCreateOrderInfo = (data: unknown) => {
        const record =
            data && typeof data === 'object'
                ? (data as Record<string, unknown>)
                : {}
        return {
            orderId: String(
                record.order_id ?? record.orderId ?? record.id ?? '',
            ).trim(),
            providerName: String(
                record.payment_provider_name ??
                    record.payment_provider ??
                    record.gateway_name ??
                    '',
            ).trim(),
            totalAmount: Number(record.total_amount ?? 0) || 0,
            totalAmountInPaise:
                Number(record.total_amount_in_paise ?? 0) || 0,
        }
    }

    const fetchOrderDetails = useCallback(async (orderId: string) => {
        if (!orderId) {
            return
        }

        setIsPrefillLoading(true)
        try {
            const response = await fetch(`/api/client/orders/${orderId}`, {
                method: 'GET',
                cache: 'no-store',
            })
            const payload = ((await response.json()) as ApiResponsePayload) || {}

            if (!response.ok || !mapApiSuccess(payload)) {
                toast.push(
                    <Notification type="danger">
                        {payload.message || 'Failed to fetch order details.'}
                    </Notification>,
                    { placement: 'top-center' },
                )
                return
            }

            const dataRecord =
                payload.data && typeof payload.data === 'object'
                    ? (payload.data as Record<string, unknown>)
                    : {}
            const orderRecord =
                dataRecord.order && typeof dataRecord.order === 'object'
                    ? (dataRecord.order as Record<string, unknown>)
                    : dataRecord
            const paymentGateway =
                dataRecord.payment_gateway &&
                typeof dataRecord.payment_gateway === 'object'
                    ? (dataRecord.payment_gateway as Record<string, unknown>)
                    : {}
            const gateway =
                paymentGateway.gateway &&
                typeof paymentGateway.gateway === 'object'
                    ? (paymentGateway.gateway as Record<string, unknown>)
                    : {}

            const packageId = String(
                orderRecord.package_id ?? orderRecord.packageId ?? '',
            ).trim()
            const paymentMethod = String(
                orderRecord.payment_method_id ??
                    orderRecord.payment_method ??
                    '',
            ).trim()
            const paymentProvider = String(
                orderRecord.payment_provider_id ??
                    orderRecord.payment_provider ??
                    paymentGateway.gateway_id ??
                    paymentGateway.gateway_config_id ??
                    '',
            ).trim()

            const candidateIds: string[] = []
            const rawCandidateIds = orderRecord.candidate_ids
            if (Array.isArray(rawCandidateIds)) {
                rawCandidateIds.forEach((value) => {
                    const id = String(value ?? '').trim()
                    if (id) {
                        candidateIds.push(id)
                    }
                })
            }

            const rawCandidates = Array.isArray(orderRecord.candidates)
                ? orderRecord.candidates
                : Array.isArray(dataRecord.candidates)
                  ? dataRecord.candidates
                  : []

            rawCandidates.forEach((item) => {
                if (!item || typeof item !== 'object') {
                    return
                }
                const candidateRecord = item as Record<string, unknown>
                const nestedCandidate =
                    candidateRecord.candidate &&
                    typeof candidateRecord.candidate === 'object'
                        ? (candidateRecord.candidate as Record<string, unknown>)
                        : {}
                const id = String(
                    candidateRecord.candidate_id ??
                        nestedCandidate.id ??
                        candidateRecord.id ??
                        candidateRecord.invitation_id ??
                        '',
                ).trim()
                if (id && !candidateIds.includes(id)) {
                    candidateIds.push(id)
                }
            })

            if (paymentMethod) {
            setPaymentMethodId(paymentMethod)
            }
            if (paymentProvider) {
                setPrefillPaymentProviderId(paymentProvider)
            }

            if (packageId) {
                const selected = productList.find(
                    (product) => product.id === packageId,
                )
                if (selected) {
                    setSelectedProduct([{ ...selected, quantity: 1 }])
                } else {
                    setPrefillPackageId(packageId)
                }
            }

            if (candidateIds.length > 0) {
                setPrefillCandidateIds(candidateIds)
            }

        } catch {
            toast.push(
                <Notification type="danger">
                    Failed to fetch order details.
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setIsPrefillLoading(false)
        }
    }, [
        mapApiSuccess,
        paymentProviderId,
        productList,
        setPaymentMethodId,
        setPaymentProviderId,
        setSelectedProduct,
    ])

    useEffect(() => {
        if (!isEditMode) {
            return
        }
        if (hasFetchedEditDetails.current) {
            return
        }
        hasFetchedEditDetails.current = true
        fetchOrderDetails(editOrderId)
    }, [editOrderId, fetchOrderDetails, isEditMode])

    const validateSelections = (saveDraft: boolean) => {
        const errors = {
            package: '',
            candidates: '',
            paymentProvider: '',
        }
        if (!selectedPackageId) {
            errors.package = 'Please select a package.'
        }

        if (!saveDraft && selectedCandidateIds.length === 0) {
            errors.candidates = 'Please select at least one candidate.'
        }

        if (!saveDraft && !paymentProviderId) {
            errors.paymentProvider = 'Please select a payment provider.'
        }

        setValidationErrors(errors)
        return !errors.package && !errors.candidates && !errors.paymentProvider
    }

    const submitOrder = async (saveDraft: boolean) => {
        if (!validateSelections(saveDraft)) {
            return
        }

        if (saveDraft) {
            setIsDraftSubmitting(true)
        } else {
            setIsSubmiting(true)
        }

        try {
            const body = {
                package_id: selectedPackageId,
                candidate_ids: selectedCandidateIds,
                payment_method_id: paymentMethodId,
                payment_provider_id: paymentProviderId,
                ...(isEditMode ? { id: editOrderId } : {}),
                ...(saveDraft ? { save_draft: true } : {}),
            }

            const response = await fetch('/api/client/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })

            const payload = ((await response.json()) as ApiResponsePayload) || {}
            const success = mapApiSuccess(payload)

            if (!response.ok || !success) {
                toast.push(
                    <Notification type="danger">
                        {payload.message || 'Failed to submit order.'}
                    </Notification>,
                    { placement: 'top-center' },
                )
                return
            }

            toast.push(
                <Notification type="success">
                    {payload.message ||
                        (saveDraft
                            ? 'Order saved as draft.'
                            : 'Order created successfully.')}
                </Notification>,
                { placement: 'top-center' },
            )
            if (saveDraft) {
                router.push('/orders/list')
                return
            }

            const createInfo = getCreateOrderInfo(payload.data)

            if (!createInfo.orderId) {
                toast.push(
                    <Notification type="info">
                        Order created. Please complete payment from the order
                        list.
                    </Notification>,
                    { placement: 'top-center' },
                )
                router.push('/orders/list')
                return
            }

            const initBody: Record<string, unknown> = {}
            if (createInfo.providerName) {
                initBody.payment_provider_name = createInfo.providerName
            }
            if (createInfo.totalAmount) {
                initBody.total_amount = createInfo.totalAmount
            }
            if (createInfo.totalAmountInPaise) {
                initBody.total_amount_in_paise = createInfo.totalAmountInPaise
            }

            const paymentHandled = await startOrderPaymentFlow({
                orderId: createInfo.orderId,
                initBody,
                onInitError: (message) => {
                    toast.push(
                        <Notification type="danger">{message}</Notification>,
                        { placement: 'top-center' },
                    )
                    router.push(
                        `/orders/details/${createInfo.orderId}?action=payment`,
                    )
                },
                onVerificationSuccess: (message) => {
                    toast.push(
                        <Notification type="success">{message}</Notification>,
                        { placement: 'top-center' },
                    )
                    router.push('/orders/list')
                },
                onVerificationError: (message) => {
                    toast.push(
                        <Notification type="danger">{message}</Notification>,
                        { placement: 'top-center' },
                    )
                    router.push('/orders/list')
                },
                onDismiss: () => {
                    router.push('/orders/list')
                },
            })

            if (paymentHandled) {
                return
            }

            toast.push(
                <Notification type="info">
                    Order created. Please complete payment from the order list.
                </Notification>,
                { placement: 'top-center' },
            )
            router.push(`/orders/details/${createInfo.orderId}?action=payment`)
        } catch {
            toast.push(
                <Notification type="danger">
                    Failed to submit order.
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setIsSubmiting(false)
            setIsDraftSubmitting(false)
        }
    }

    const handleFormSubmit = async (values: OrderFormSchema) => {
        void values
        await submitOrder(false)
    }

    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(false)
        toast.push(
            <Notification type="success">Order discarded!</Notification>,
            { placement: 'top-center' },
        )
        router.push('/orders/list')
    }

    const handleDiscard = () => {
        setDiscardConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDiscardConfirmationOpen(false)
    }

    return (
        <>
            <OrderForm
                onFormSubmit={handleFormSubmit}
                footerStickyMode="fixed"
            >
                <Container>
                    <div className="flex items-center justify-between px-8">
                        <span></span>
                        <div className="flex items-center">
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
                                className="ltr:mr-3 rtl:ml-3"
                                type="button"
                                loading={isDraftSubmitting}
                                onClick={() => submitOrder(true)}
                            >
                                Save as Draft
                            </Button>
                            <Button
                                variant="solid"
                                type="submit"
                                loading={isSubmiting}
                            >
                                Create Order
                            </Button>
                        </div>
                    </div>
                </Container>
            </OrderForm>
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

export default OrderCreate
