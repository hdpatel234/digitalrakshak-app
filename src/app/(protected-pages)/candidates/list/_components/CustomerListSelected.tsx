'use client'

import { useState } from 'react'
import StickyFooter from '@/components/shared/StickyFooter'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { useCustomerListStore } from '../_store/customerListStore'
import { TbChecks, TbSend } from 'react-icons/tb'

const CustomerListSelected = () => {
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

    const handleSendInvitation = () => {
        setSendInvitationLoading(true)
        setTimeout(() => {
            toast.push(
                <Notification type="success">
                    Invitation sent successfully!
                </Notification>,
                { placement: 'top-center' },
            )
            setSendInvitationLoading(false)
            setSelectAllCustomer([])
        }, 500)
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
        </>
    )
}

export default CustomerListSelected
