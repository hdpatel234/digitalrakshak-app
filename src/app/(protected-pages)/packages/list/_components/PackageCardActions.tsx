'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { TbEdit, TbTrash, TbShoppingCart } from 'react-icons/tb'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'

type PackageCardActionsProps = {
    pkgId: string
    availableCandidates: number
    isEditable: boolean
}

export default function PackageCardActions({
    pkgId,
    availableCandidates,
    isEditable,
}: PackageCardActionsProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [dialogIsOpen, setDialogIsOpen] = useState(false)
    const router = useRouter()

    const handleDeleteClick = () => {
        setDialogIsOpen(true)
    }

    const handleDeleteConfirm = async () => {
        setDialogIsOpen(false)
        setIsDeleting(true)
        try {
            const res = await fetch(`/api/client/packages/${pkgId}`, {
                method: 'DELETE',
            })
            const data = await res.json()
            if (data.status) {
                toast.push(
                    <Notification type="success" title="Success">
                        {data.message || 'Package deleted successfully.'}
                    </Notification>,
                    { placement: 'top-center' }
                )
                router.refresh()
            } else {
                toast.push(
                    <Notification type="danger" title="Error">
                        {data.message || 'Failed to delete package.'}
                    </Notification>,
                    { placement: 'top-center' }
                )
            }
        } catch (error) {
            console.error('Error deleting package:', error)
            toast.push(
                <Notification type="danger" title="Error">
                    An error occurred while deleting the package.
                </Notification>,
                { placement: 'top-center' }
            )
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className="flex gap-2 w-full mt-2">
            {availableCandidates === 0 ? (
                <button
                    disabled
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 rounded-xl font-medium shadow-sm text-sm text-center cursor-not-allowed transition-all"
                >
                    <TbShoppingCart className="text-lg" />
                    <span>Order</span>
                </button>
            ) : (
                <Link
                    href={`/orders/create?package_id=${pkgId}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg text-sm text-center transform hover:-translate-y-0.5"
                >
                    <TbShoppingCart className="text-lg" />
                    <span>Order</span>
                </Link>
            )}

            {isEditable && (
                <div className="flex gap-2">
                    <Link
                        href={`/packages/edit/${pkgId}`}
                        className="inline-flex items-center justify-center px-3 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm hover:shadow text-sm hover:text-indigo-600 dark:hover:text-indigo-400 group"
                        title="Edit Package"
                    >
                        <TbEdit className="text-lg group-hover:scale-110 transition-transform" />
                    </Link>
                    <button
                        onClick={handleDeleteClick}
                        disabled={isDeleting}
                        className="inline-flex items-center justify-center px-3 py-2.5 bg-white dark:bg-gray-800 text-red-500 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800 transition-all shadow-sm hover:shadow text-sm group disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete Package"
                    >
                        {isDeleting ? (
                            <span className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                            <TbTrash className="text-lg group-hover:scale-110 transition-transform" />
                        )}
                    </button>
                </div>
            )}

            <ConfirmDialog
                isOpen={dialogIsOpen}
                type="danger"
                title="Delete package"
                confirmButtonProps={{ color: 'red-600', className: 'bg-red-600 hover:bg-red-700 focus:ring-red-500' }}
                onClose={() => setDialogIsOpen(false)}
                onRequestClose={() => setDialogIsOpen(false)}
                onCancel={() => setDialogIsOpen(false)}
                onConfirm={handleDeleteConfirm}
                confirmText="Delete"
            >
                <p>Are you sure you want to delete this package?</p>
            </ConfirmDialog>
        </div>
    )
}
