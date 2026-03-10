'use client'
import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import CustomerForm from '@/components/view/CustomerForm'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { TbTrash, TbPlus, TbSend } from 'react-icons/tb'
import { useRouter } from 'next/navigation'
import type { CustomerFormSchema } from '@/components/view/CustomerForm'
import { apiCreateCandidate } from '@/services/client/candidates'

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

const CustomerEdit = () => {
    const router = useRouter()

    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)
    const [formKey, setFormKey] = useState(0)
    const [submitAction, setSubmitAction] = useState<'create' | 'invite'>(
        'create',
    )

    const handleFormSubmit = async (values: CustomerFormSchema) => {
        try {
            setIsSubmiting(true)
            const response = await apiCreateCandidate({
                ...values,
                send_invite: submitAction === 'invite',
            })

            if (!response.status) {
                toast.push(
                    <Notification type="danger">
                        {response.message || 'Failed to create candidate'}
                    </Notification>,
                    { placement: 'top-center' },
                )
                return
            }

            toast.push(
                <Notification type="success">
                    {response.message || 'Candidate created successfully'}
                </Notification>,
                { placement: 'top-center' },
            )

            // Remount form to clear all values after successful create.
            setFormKey((prev) => prev + 1)
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Failed to create candidate'

            toast.push(
                <Notification type="danger">{message}</Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setIsSubmiting(false)
        }
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
                                className="ltr:ml-3 rtl:mr-3"
                                variant="solid"
                                type="submit"
                                icon={<TbSend />}
                                onClick={() => setSubmitAction('invite')}
                                loading={
                                    isSubmiting && submitAction === 'invite'
                                }
                                disabled={isSubmiting}
                            >
                                Create & Send Invite
                            </Button>
                        </div>
                    </div>
                </Container>
            </CustomerForm>
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
