'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'

const VerifyEmploymentPage = () => {
    const params = useParams()
    const tokenValue = typeof params?.token === 'string' ? params.token : (Array.isArray(params?.token) ? params.token[0] : '')

    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [verificationData, setVerificationData] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)
    const [view, setView] = useState<'form' | 'success'>('form')

    const [status, setStatus] = useState<string>('verified')
    const [remarks, setRemarks] = useState<string>('')

    useEffect(() => {
        if (!tokenValue) {
            setError('Verification token is missing.')
            setIsLoading(false)
            return
        }

        const fetchVerificationDetails = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/verifications/employment/${encodeURIComponent(tokenValue)}`, {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' },
                })

                const payload = await response.json()

                if (!response.ok || !payload.status) {
                    setError(payload.message || 'Verification link is invalid or has expired.')
                } else {
                    setVerificationData(payload.data)
                    if (payload.data.verification_status !== 'pending') {
                        setError('This verification has already been processed.')
                    }
                }
            } catch (err: any) {
                setError(err.message || 'Failed to fetch verification details.')
            } finally {
                setIsLoading(false)
            }
        }

        fetchVerificationDetails()
    }, [tokenValue])

    const onFormSubmit = async () => {
        if (!tokenValue) return

        setIsSubmitting(true)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/verifications/employment/${encodeURIComponent(tokenValue)}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status,
                    remarks,
                })
            })

            const payload = await response.json()

            if (!response.ok || !payload.status) {
                toast.push(
                    <Notification type="danger">
                        {payload.message || 'Failed to submit response.'}
                    </Notification>,
                    { placement: 'top-center' }
                )
            } else {
                setView('success')
            }
        } catch (err: any) {
            toast.push(
                <Notification type="danger">
                    {err.message || 'Failed to submit response.'}
                </Notification>,
                { placement: 'top-center' }
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="w-full flex justify-center items-center p-10 h-[50vh]">
                <div className="flex flex-col items-center justify-center gap-4 animate-pulse">
                    <Spinner size={40} className="text-indigo-600" />
                    <div className="text-gray-500 font-medium text-lg tracking-wide">
                        Loading verification details<span className="animate-bounce inline-block">...</span>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="w-full max-w-2xl mx-auto p-6 md:p-10 mt-10">
                <Card className="border border-red-200/80 shadow-sm bg-red-50 dark:bg-red-900/10 dark:border-red-800/80 text-center py-10">
                    <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-4">
                        Oops!
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        {error}
                    </p>
                </Card>
            </div>
        )
    }

    if (view === 'success') {
        return (
            <div className="w-full max-w-2xl mx-auto p-6 md:p-10 mt-10">
                <Card className="border border-emerald-200/80 shadow-sm bg-emerald-50 dark:bg-emerald-900/10 dark:border-emerald-800/80 text-center py-10">
                    <h2 className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400 mb-4">
                        Thank You!
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        Your verification response has been submitted successfully. You can now close this page.
                    </p>
                </Card>
            </div>
        )
    }

    return (
        <div className="w-full py-8 max-w-3xl mx-auto px-4">
            <Card className="mb-6">
                <h3 className="mb-4 text-xl font-semibold">Employment Verification</h3>
                <p className="mb-4 text-gray-600 dark:text-gray-400">
                    You have been requested to verify the employment details for <strong>{verificationData?.candidate_name}</strong>.
                    Please review the details below and provide your response.
                </p>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
                    <h4 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200 border-b pb-2">Candidate Details</h4>
                    
                    {verificationData?.candidate_data && Object.keys(verificationData.candidate_data).length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(verificationData.candidate_data).map(([key, value]) => (
                                <div key={key} className="mb-2">
                                    <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">{key}</span>
                                    <span className="block text-base text-gray-900 dark:text-gray-100">{String(value)}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">No detailed data provided.</p>
                    )}
                </div>

                <div className="border-t pt-6">
                    <h4 className="text-lg font-medium mb-4">Your Response</h4>
                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Verification Status
                            </label>
                            <Select
                                options={[
                                    { value: 'verified', label: 'Verified - Data is correct' },
                                    { value: 'needs_changes', label: 'Needs Changes - Some data is incorrect' },
                                    { value: 'rejected', label: 'Rejected - No record found / completely incorrect' }
                                ]}
                                value={{
                                    value: status,
                                    label: status === 'verified' ? 'Verified - Data is correct' : status === 'needs_changes' ? 'Needs Changes - Some data is incorrect' : 'Rejected - No record found / completely incorrect'
                                }}
                                onChange={(option) => setStatus(option?.value || 'verified')}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Remarks (Optional)
                            </label>
                            <Input
                                textArea
                                placeholder="Enter any remarks, corrections, or additional information here..."
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                            />
                        </div>

                        <div className="mt-4 flex justify-end">
                            <Button
                                variant="solid"
                                loading={isSubmitting}
                                onClick={onFormSubmit}
                            >
                                Submit Response
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default VerifyEmploymentPage
