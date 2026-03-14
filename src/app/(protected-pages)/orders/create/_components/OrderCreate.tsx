'use client'
import { useEffect, useMemo, useState } from 'react'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import Container from '@/components/shared/Container'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import OrderForm from '@/components/view/OrderForm'
import { useRouter } from 'next/navigation'
import { TbTrash } from 'react-icons/tb'
import { useOrderFormStore } from '@/components/view/OrderForm/store/orderFormStore'
import type { OrderFormSchema } from '@/components/view/OrderForm'

type ApiResponsePayload = {
    status?: boolean
    success?: boolean
    message?: string
    data?: unknown
}

const OrderCreate = () => {
    const router = useRouter()

    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)
    const [isDraftSubmitting, setIsDraftSubmitting] = useState(false)

    const {
        selectedProduct,
        selectedCandidates,
        paymentMethodId,
        paymentProviderId,
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

    const mapApiSuccess = (payload: ApiResponsePayload) =>
        payload.status === true || payload.success === true

    const validateSelections = () => {
        const errors = {
            package: '',
            candidates: '',
            paymentProvider: '',
        }
        if (!selectedPackageId) {
            errors.package = 'Please select a package.'
        }

        if (selectedCandidateIds.length === 0) {
            errors.candidates = 'Please select at least one candidate.'
        }

        if (!paymentProviderId) {
            errors.paymentProvider = 'Please select a payment provider.'
        }

        setValidationErrors(errors)
        return !errors.package && !errors.candidates && !errors.paymentProvider
    }

    const submitOrder = async (saveDraft: boolean) => {
        if (!validateSelections()) {
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
            router.push('/orders/list')
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
            <OrderForm onFormSubmit={handleFormSubmit}>
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
