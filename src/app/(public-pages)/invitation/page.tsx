'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import CustomerForm from '@/components/view/CustomerForm'
import type { CustomerFormSchema } from '@/components/view/CustomerForm/types'
import { FieldConfig } from '@/components/view/CustomerForm/CustomerForm'
import Checkbox from '@/components/ui/Checkbox'
import Container from '@/components/shared/Container'
import Upload from '@/components/ui/Upload'

const ACCEPTED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.txt']
const MAX_RESUME_SIZE = 10 * 1024 * 1024

const InvitationContent = () => {
    const searchParams = useSearchParams()
    const tokenValue = searchParams.get('token')

    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [invitationData, setInvitationData] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)
    const [view, setView] = useState<'consent' | 'resume' | 'form' | 'success'>('consent')
    const [termsAccepted, setTermsAccepted] = useState(false)
    const [termsError, setTermsError] = useState(false)
    
    // Resume states
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [isParsingResume, setIsParsingResume] = useState(false)
    const [parsedResumeData, setParsedResumeData] = useState<any>(null)

    useEffect(() => {
        if (!tokenValue) {
            setError('This page is broken. Invitation token is missing.')
            setIsLoading(false)
            return
        }

        const fetchInvitation = async () => {
            try {
                const response = await fetch(`/api/client/invitations/${encodeURIComponent(tokenValue)}`, {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' },
                })

                const payload = await response.json()

                if (!response.ok || !payload.status) {
                    setError(payload.message || 'Invitation is invalid or has expired.')
                } else {
                    setInvitationData(payload.data)
                }
            } catch (err: any) {
                setError(err.message || 'Failed to fetch invitation details.')
            } finally {
                setIsLoading(false)
            }
        }

        fetchInvitation()
    }, [tokenValue])

    const validateResumeFile = (file: File | null | undefined) => {
        if (!file) return 'Please select a resume file to upload.'

        const name = file.name.toLowerCase()
        const hasValidExtension = ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext))

        if (!hasValidExtension) {
            return `Allowed file types: ${ACCEPTED_EXTENSIONS.join(', ')}`
        }

        if (file.size > MAX_RESUME_SIZE) {
            return 'File size must be 10 MB or less.'
        }

        return true
    }

    const processResume = async () => {
        const file = selectedFiles[0]
        if (!file) {
            toast.push(<Notification type="danger">Please select a file to process.</Notification>, { placement: 'top-center' })
            return
        }
        
        if (!tokenValue) return

        setIsParsingResume(true)
        const requestFormData = new FormData()
        requestFormData.append('resume', file)

        try {
            const response = await fetch(
                `/api/client/invitations/${encodeURIComponent(tokenValue)}/parse-resume`,
                {
                    method: 'POST',
                    body: requestFormData,
                }
            )

            const payload = await response.json()

            if (!response.ok || !payload.status) {
                toast.push(<Notification type="danger">{payload.message || 'Failed to parse resume.'}</Notification>, { placement: 'top-center' })
            } else {
                setParsedResumeData(payload.data)
                toast.push(<Notification type="success">Resume parsed successfully.</Notification>, { placement: 'top-center' })
                setView('form')
            }
        } catch (err: any) {
            toast.push(<Notification type="danger">{err.message || 'Failed to parse resume.'}</Notification>, { placement: 'top-center' })
        } finally {
            setIsParsingResume(false)
        }
    }

    const handleFormSubmit = async (values: CustomerFormSchema) => {
        if (!termsAccepted) {
            setTermsError(true)
            toast.push(
                <Notification type="danger">
                    Please agree with the terms and conditions to continue.
                </Notification>,
                { placement: 'top-center' }
            )
            return
        }

        if (!tokenValue) return

        setIsSubmitting(true)
        setTermsError(false)

        try {
            // Extract the standard fields and candidate details
            const candidateDetails = {
                first_name: values.firstName,
                last_name: values.lastName,
                email: values.email,
                phone: values.phoneNumber,
                address: values.address,
                country_id: values.country,
                state_id: values.state,
                city_id: values.city,
                pincode: values.postcode,
            }

            // Extract dynamic field values
            const dynamicFieldsInput: any[] = []
            
            if (invitationData?.fields && Array.isArray(invitationData.fields)) {
                invitationData.fields.forEach((field: FieldConfig) => {
                    if (values[field.field_name as keyof CustomerFormSchema] !== undefined) {
                        dynamicFieldsInput.push({
                            field_id: field.id,
                            value: values[field.field_name as keyof CustomerFormSchema]
                        })
                    }
                })
            }

            const response = await fetch(`/api/client/invitations/${encodeURIComponent(tokenValue)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    candidate_details: candidateDetails,
                    fields: dynamicFieldsInput
                })
            })

            const payload = await response.json()

            if (!response.ok || !payload.status) {
                toast.push(
                    <Notification type="danger">
                        {payload.message || 'Failed to submit details.'}
                    </Notification>,
                    { placement: 'top-center' }
                )
            } else {
                setView('success')
            }
        } catch (err: any) {
            toast.push(
                <Notification type="danger">
                    {err.message || 'Failed to submit details.'}
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
                <div className="text-gray-500 font-medium text-lg">Checking invitation...</div>
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
                        Your details have been submitted successfully. You can now close this page.
                    </p>
                </Card>
            </div>
        )
    }

    if (view === 'consent') {
        return (
            <div className="w-full max-w-3xl mx-auto p-6 md:p-10 mt-10">
                <Card className="border border-gray-200/80 shadow-sm dark:border-gray-700/80 p-8">
                    <div className="flex flex-col gap-6 text-center">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            Invitation to Provide Details
                        </h2>
                        
                        <div className="text-gray-600 dark:text-gray-300 leading-relaxed text-left">
                            <p className="mb-4">
                                Hello <strong>{invitationData?.candidate?.first_name || 'Candidate'}</strong>,
                            </p>
                            <p className="mb-4">
                                You have been invited by <strong>{invitationData?.package?.[0]?.client_name || 'our organization'}</strong> to securely provide your personal and professional details for verification purposes.
                            </p>
                            
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-2">What you need to do:</h4>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Review and fill out the detailed form with your information.</li>
                                <li>You will have the option to upload your resume to prefill your details automatically.</li>
                                <li>Ensure you have any necessary documents ready, as you may need to fill in information corresponding to them.</li>
                                <li>Review the terms and conditions and submit the form.</li>
                            </ul>
                            
                            {invitationData?.services && invitationData.services.length > 0 && (
                                <div className="mt-6">
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Required Information:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {invitationData.services.map((service: any) => (
                                            <span key={service.id} className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                {service.service_name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex justify-center">
                            <Button 
                                variant="solid" 
                                className="w-full sm:w-auto min-w-[200px]"
                                onClick={() => setView('resume')}
                            >
                                Continue
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        )
    }

    if (view === 'resume') {
        return (
            <div className="w-full max-w-3xl mx-auto p-6 md:p-10 mt-10">
                <Card className="border border-gray-200/80 shadow-sm dark:border-gray-700/80 p-8">
                    <div className="flex flex-col gap-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Upload Resume
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300">
                                Upload your resume to prefill your details before completing the form.
                            </p>
                        </div>
                        
                        <Upload
                            draggable
                            accept={ACCEPTED_EXTENSIONS.join(',')}
                            uploadLimit={1}
                            fileList={selectedFiles}
                            onChange={(files) => {
                                const validation = validateResumeFile(files?.[0])
                                if (validation !== true) {
                                    toast.push(<Notification type="danger">{String(validation)}</Notification>, { placement: 'top-center' })
                                    return
                                }
                                setSelectedFiles(files)
                            }}
                            onFileRemove={(files) => {
                                setSelectedFiles(files)
                            }}
                            tip={
                                <div className="text-xs text-gray-500 mt-2">
                                    Allowed file types: {ACCEPTED_EXTENSIONS.join(', ')}. Max size: 10 MB.
                                </div>
                            }
                        />

                        <div className="mt-4 flex flex-col sm:flex-row justify-end items-center gap-3">
                            <Button 
                                variant="plain" 
                                onClick={() => setView('form')}
                                disabled={isParsingResume}
                            >
                                Skip for now
                            </Button>
                            <Button 
                                variant="solid"
                                loading={isParsingResume}
                                disabled={selectedFiles.length === 0 || isParsingResume}
                                onClick={processResume}
                            >
                                Process Resume
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        )
    }

    // Map candidate data to default values
    const defaultValues: CustomerFormSchema = {
        firstName: parsedResumeData?.first_name || invitationData?.candidate?.first_name || '',
        lastName: parsedResumeData?.last_name || invitationData?.candidate?.last_name || '',
        email: parsedResumeData?.email || invitationData?.candidate?.email || '',
        phoneNumber: parsedResumeData?.phone || invitationData?.candidate?.phone || '',
        dialCode: '+91', // Default dial code, adjust as needed
        country: parsedResumeData?.country_id?.toString() || invitationData?.candidate?.country_id?.toString() || '',
        state: parsedResumeData?.state_id?.toString() || invitationData?.candidate?.state_id?.toString() || '',
        city: parsedResumeData?.city_id?.toString() || invitationData?.candidate?.city_id?.toString() || '',
        address: parsedResumeData?.address || invitationData?.candidate?.address || '',
        postcode: parsedResumeData?.pincode || invitationData?.candidate?.pincode || '',
        img: '',
        tags: [],
        managerEmails: [''],
        askConsent: true, // Always true for candidate self-filling
    }

    // Populate dynamic fields default values if available in formData or parsed resume data
    if (invitationData?.fields && Array.isArray(invitationData.fields)) {
        invitationData.fields.forEach((field: FieldConfig) => {
            let val = field.value
            if (parsedResumeData && parsedResumeData.fields && parsedResumeData.fields[field.field_name] !== undefined) {
                val = parsedResumeData.fields[field.field_name]
            }
            if (val !== undefined && val !== null) {
                (defaultValues as any)[field.field_name] = val
            }
        })
    }

    return (
        <div className="w-full py-8">
            <CustomerForm
                newCustomer
                dynamicFields={invitationData?.fields || []}
                defaultValues={defaultValues}
                onFormSubmit={handleFormSubmit}
            >
                <Container>
                    <div className="flex flex-col gap-4 px-4 sm:px-8 mt-6 pb-10">
                        <div className={`p-4 rounded-lg border ${termsError ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'} dark:bg-gray-800 dark:border-gray-700`}>
                            <Checkbox 
                                checked={termsAccepted}
                                onChange={(val) => {
                                    setTermsAccepted(val)
                                    if (val) setTermsError(false)
                                }}
                            >
                                <span className={`text-sm ${termsError ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'}`}>
                                    I agree with the terms and conditions and data usage.
                                </span>
                            </Checkbox>
                        </div>
                        
                        <div className="flex justify-end gap-3">
                            <Button 
                                type="button"
                                onClick={() => setView('resume')}
                                disabled={isSubmitting}
                            >
                                Back
                            </Button>
                            <Button
                                className="w-full sm:w-auto min-w-[150px]"
                                variant="solid"
                                type="submit"
                                loading={isSubmitting}
                                disabled={isSubmitting}
                            >
                                Submit Details
                            </Button>
                        </div>
                    </div>
                </Container>
            </CustomerForm>
        </div>
    )
}

const Page = () => {
    return (
        <Suspense fallback={
            <div className="w-full flex justify-center items-center p-10 h-[50vh]">
                <div className="text-gray-500 font-medium text-lg">Loading...</div>
            </div>
        }>
            <InvitationContent />
        </Suspense>
    )
}

export default Page
