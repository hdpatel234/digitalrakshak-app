'use client'

import { useState, useEffect, Suspense, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import Checkbox from '@/components/ui/Checkbox'
import Container from '@/components/shared/Container'
import Upload from '@/components/ui/Upload'
import DatePicker from '@/components/ui/DatePicker'
import Logo from '@/components/template/Logo'
import Footer from '@/components/template/Footer'
import { Form, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import { Controller, useWatch } from 'react-hook-form'
import Select, { Option as DefaultOption } from '@/components/ui/Select'
import { components } from 'react-select'
import type { ControlProps, OptionProps } from 'react-select'
import Avatar from '@/components/ui/Avatar'
import useSWR from 'swr'
import ApiService from '@/services/ApiService'
import { apiGetPostalCodeLocation } from '@/services/auth/postalCodes'

const ACCEPTED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.txt']
const MAX_RESUME_SIZE = 10 * 1024 * 1024

const validationSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    phoneNumber: z.string().min(1, 'Phone number is required'),
    country: z.string().min(1, 'Country is required'),
    state: z.string().min(1, 'State is required'),
    city: z.string().min(1, 'City is required'),
    postcode: z.string().min(1, 'Zip/Postal code is required'),
    address: z.string().min(1, 'Address is required'),
}).catchall(z.any())

type CandidateFormSchema = z.infer<typeof validationSchema>

type FieldConfig = {
    id: number
    field_name: string
    field_label: string
    field_type: string
    is_required: number | boolean
    section?: string
    value?: string
}

type SelectOption = {
    label: string
    value: string
    flagCode?: string
}

const { Control } = components

const CountrySelectOption = (props: OptionProps<SelectOption>) => {
    return (
        <DefaultOption<SelectOption>
            {...props}
            customLabel={(data, label) => (
                <span className="flex items-center gap-2">
                    <Avatar
                        shape="circle"
                        size={20}
                        src={`/img/countries/${data.flagCode}.png`}
                    />
                    <span>{label as string}</span>
                </span>
            )}
        />
    )
}

const CountrySelectControl = ({ children, ...props }: ControlProps<SelectOption>) => {
    const selected = props.getValue()[0]
    return (
        <Control {...props}>
            {selected?.flagCode && (
                <Avatar
                    className="ltr:ml-4 rtl:mr-4"
                    shape="circle"
                    size={20}
                    src={`/img/countries/${selected.flagCode}.png`}
                />
            )}
            {children}
        </Control>
    )
}

const InvitationContent = () => {
    const params = useParams()
    const tokenValue = typeof params?.token === 'string' ? params.token : (Array.isArray(params?.token) ? params.token[0] : '')

    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [invitationData, setInvitationData] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)
    const [view, setView] = useState<'consent' | 'form' | 'success'>('consent')
    const [termsAccepted, setTermsAccepted] = useState(false)
    const [termsError, setTermsError] = useState(false)

    // Resume states
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [isParsingResume, setIsParsingResume] = useState(false)
    const [parsedResumeData, setParsedResumeData] = useState<any>(null)
    const [resumeProcessed, setResumeProcessed] = useState(false)

    useEffect(() => {
        if (!tokenValue) {
            setError('This page is broken. Invitation token is missing.')
            setIsLoading(false)
            return
        }

        const fetchInvitation = async () => {
            try {
                const response = await fetch(`/api/client/invitations/by-token/${encodeURIComponent(tokenValue)}`, {
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
                `/api/client/invitations/by-token/${encodeURIComponent(tokenValue)}/parse-resume`,
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
                setResumeProcessed(true)
                toast.push(<Notification type="success">Resume parsed successfully. Form details have been pre-filled.</Notification>, { placement: 'top-center' })
            }
        } catch (err: any) {
            toast.push(<Notification type="danger">{err.message || 'Failed to parse resume.'}</Notification>, { placement: 'top-center' })
        } finally {
            setIsParsingResume(false)
        }
    }

    const defaultValues = useMemo(() => {
        const defaults: any = {
            firstName: parsedResumeData?.first_name || invitationData?.candidate?.first_name || '',
            lastName: parsedResumeData?.last_name || invitationData?.candidate?.last_name || '',
            email: parsedResumeData?.email || invitationData?.candidate?.email || '',
            phoneNumber: parsedResumeData?.phone || invitationData?.candidate?.phone || '',
            country: parsedResumeData?.country_id?.toString() || invitationData?.candidate?.country_id?.toString() || '',
            state: parsedResumeData?.state_id?.toString() || invitationData?.candidate?.state_id?.toString() || '',
            city: parsedResumeData?.city_id?.toString() || invitationData?.candidate?.city_id?.toString() || '',
            address: parsedResumeData?.address || invitationData?.candidate?.address || '',
            postcode: parsedResumeData?.pincode || invitationData?.candidate?.pincode || '',
        }

        if (invitationData?.fields && Array.isArray(invitationData.fields)) {
            invitationData.fields.forEach((field: FieldConfig) => {
                let val = field.value
                if (parsedResumeData && parsedResumeData.fields && parsedResumeData.fields[field.field_name] !== undefined) {
                    val = parsedResumeData.fields[field.field_name]
                }
                if (val !== undefined && val !== null) {
                    defaults[field.field_name] = val
                }
            })
        }
        return defaults
    }, [parsedResumeData, invitationData])

    // Build a dynamic Zod schema that includes the dynamic fields
    const dynamicZodSchema = useMemo(() => {
        let schema = validationSchema
        if (invitationData?.fields && Array.isArray(invitationData.fields)) {
            const dynamicShape: Record<string, any> = {}
            invitationData.fields.forEach((f: FieldConfig) => {
                if (f.section === 'Consent Form') return
                
                if (f.field_type === 'file') {
                    if (f.is_required) {
                        dynamicShape[f.field_name] = z.any().refine(
                            (val) => val instanceof File || (Array.isArray(val) && val.length > 0) || (val !== undefined && val !== null && val !== ''),
                            { message: `${f.field_label} is required` }
                        )
                    } else {
                        dynamicShape[f.field_name] = z.any().optional()
                    }
                } else {
                    if (f.is_required) {
                        dynamicShape[f.field_name] = z.string().min(1, `${f.field_label} is required`)
                    } else {
                        dynamicShape[f.field_name] = z.string().optional()
                    }
                }
            })
            if (Object.keys(dynamicShape).length > 0) {
                schema = validationSchema.extend(dynamicShape).catchall(z.any()) as any
            }
        }
        return schema
    }, [invitationData?.fields])

    const {
        register,
        handleSubmit,
        reset,
        setError: setFormError,
        setValue,
        control,
        formState: { errors }
    } = useForm<CandidateFormSchema>({
        resolver: zodResolver(dynamicZodSchema),
        defaultValues,
    })

    const countryValue = useWatch({ control, name: 'country' })
    const stateValue = useWatch({ control, name: 'state' })
    const cityValue = useWatch({ control, name: 'city' })
    const postcodeValue = useWatch({ control, name: 'postcode' })

    const { data: countriesData } = useSWR<any>(
        '/api/auth/countries',
        () => ApiService.fetchDataWithAxios<any>({ url: '/auth/countries', method: 'get' }),
        { revalidateOnFocus: false, revalidateIfStale: false, revalidateOnReconnect: false }
    )

    const { data: statesData, isLoading: isStatesLoading } = useSWR<any>(
        countryValue ? `/api/auth/states?country_id=${countryValue}` : null,
        () => ApiService.fetchDataWithAxios<any>({ url: '/auth/states', method: 'get', params: { country_id: countryValue } }),
        { revalidateOnFocus: false, revalidateIfStale: false, revalidateOnReconnect: false }
    )

    const { data: citiesData, isLoading: isCitiesLoading } = useSWR<any>(
        stateValue ? `/api/auth/cities?state_id=${stateValue}` : null,
        () => ApiService.fetchDataWithAxios<any>({ url: '/auth/cities', method: 'get', params: { state_id: stateValue } }),
        { revalidateOnFocus: false, revalidateIfStale: false, revalidateOnReconnect: false }
    )

    const countryOptions = useMemo(
        () =>
            (countriesData?.data || []).map((country: any) => ({
                label: country.name,
                value: String(country.id),
                flagCode: country.isoCode2,
            })),
        [countriesData],
    )

    const stateOptions = useMemo(
        () =>
            (statesData?.data || []).map((state: any) => ({
                label: state.name,
                value: String(state.id),
            })),
        [statesData],
    )

    const cityOptions = useMemo(
        () =>
            (citiesData?.data || []).map((city: any) => ({
                label: city.name,
                value: String(city.id),
            })),
        [citiesData],
    )

    useEffect(() => {
        if (!countryValue) {
            setValue('state', '')
            setValue('city', '')
            return
        }
        if (stateValue && stateOptions.length > 0 && !stateOptions.some((option) => option.value === stateValue)) {
            setValue('state', '')
            setValue('city', '')
        }
    }, [countryValue, setValue, stateOptions, stateValue])

    useEffect(() => {
        if (!stateValue) {
            setValue('city', '')
            return
        }
        if (cityValue && cityOptions.length > 0 && !cityOptions.some((option) => option.value === cityValue)) {
            setValue('city', '')
        }
    }, [cityOptions, cityValue, setValue, stateValue])

    // Auto-fill Location from Postal Code
    useEffect(() => {
        if (postcodeValue && String(postcodeValue).trim().length === 6) {
            const fetchLocation = async () => {
                try {
                    const response = await apiGetPostalCodeLocation<any>({ postal_code: String(postcodeValue).trim() })
                    if (response?.status && response?.data) {
                        const { country_id, state_id, city_id } = response.data
                        if (country_id) setValue('country', String(country_id))
                        if (state_id) setValue('state', String(state_id))
                        if (city_id) setValue('city', String(city_id))
                    }
                } catch (error) {
                    // console.error('Failed to auto-fill location by pincode', error)
                }
            }
            fetchLocation()
        }
    }, [postcodeValue, setValue])

    useEffect(() => {
        reset(defaultValues)
    }, [defaultValues, reset])

    const onFormSubmit = async (values: CandidateFormSchema) => {
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

            const formData = new FormData()

            formData.append('candidate_details[first_name]', values.firstName)
            formData.append('candidate_details[last_name]', values.lastName)
            formData.append('candidate_details[email]', values.email)
            formData.append('candidate_details[phone]', values.phoneNumber)
            formData.append('candidate_details[address]', values.address)
            formData.append('candidate_details[country_id]', values.country)
            formData.append('candidate_details[state_id]', values.state)
            formData.append('candidate_details[city_id]', values.city)
            formData.append('candidate_details[pincode]', values.postcode)

            if (invitationData?.fields && Array.isArray(invitationData.fields)) {
                let fieldIndex = 0;
                invitationData.fields.forEach((field: FieldConfig) => {
                    const value = values[field.field_name];
                    if (value !== undefined && value !== null && value !== '') {
                        formData.append(`fields[${fieldIndex}][field_id]`, String(field.id))
                        if (field.field_type === 'file' && value instanceof File) {
                            formData.append(`fields[${fieldIndex}][value]`, value)
                        } else {
                            formData.append(`fields[${fieldIndex}][value]`, value)
                        }
                        fieldIndex++;
                    }
                })
            }

            const response = await fetch(`/api/client/invitations/by-token/${encodeURIComponent(tokenValue)}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                body: formData
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
                <div className="flex flex-col items-center justify-center gap-4 animate-pulse">
                    <Spinner size={40} className="text-indigo-600" />
                    <div className="text-gray-500 font-medium text-lg tracking-wide">
                        Checking invitation<span className="animate-bounce inline-block">...</span>
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
                            Candidate Verification
                        </h2>

                        <div className="text-gray-600 dark:text-gray-300 leading-relaxed text-left">
                            <p className="mb-4">
                                Hello <strong>{invitationData?.candidate?.first_name || 'Candidate'}</strong>,
                            </p>
                            <p className="mb-4">
                                You have been invited by <strong>{invitationData?.package?.[0]?.client_name || 'our organization'}</strong> to securely provide your personal and professional details for background verification.
                            </p>

                            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-2">Instructions for Step 2:</h4>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>In the next step, you can choose to manually fill out the form or <strong>upload your resume</strong> to automatically pre-fill your information.</li>
                                <li>Ensure you have any necessary documents ready, as you may need to fill in information corresponding to them.</li>
                                <li>Review all the details carefully, agree to the terms and conditions, and submit the form.</li>
                            </ul>

                            {invitationData?.services && invitationData.services.length > 0 && (
                                <div className="mt-6">
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Required Checks:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {invitationData.services.map((service: any) => (
                                            <span key={service.id} className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
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
                                onClick={() => setView('form')}
                            >
                                Continue to Form
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        )
    }

    // Dynamic field grouping by section
    const groupedFields: Record<string, FieldConfig[]> = {}
    if (invitationData?.fields && Array.isArray(invitationData.fields)) {
        invitationData.fields.forEach((field: FieldConfig) => {
            // Ignore Consent Form section for candidate form (it shouldn't be asked)
            if (field.section === 'Consent Form') return

            let section = field.section

            // Fallback to finding the service if section is missing
            if (!section || section === 'Additional Info') {
                const f = field as any
                const svc = invitationData?.services?.find((s: any) =>
                    String(s.service_id || s.id) === String(f.service_id) ||
                    String(s.package_service_id) === String(f.package_service_id)
                )
                if (svc && svc.service_name) {
                    section = svc.service_name
                }
            }

            section = section || 'Additional Info'

            if (!groupedFields[section]) {
                groupedFields[section] = []
            }
            groupedFields[section].push(field)
        })
    }

    // Sort sections to match client side logic order
    const predefinedOrder = ['Identity', 'Employment', 'Education', 'Additional Info']
    const sortedSections = Object.keys(groupedFields).sort((a, b) => {
        const indexA = predefinedOrder.indexOf(a)
        const indexB = predefinedOrder.indexOf(b)
        if (indexA === -1 && indexB === -1) return 0
        if (indexA === -1) return 1
        if (indexB === -1) return -1
        return indexA - indexB
    })

    return (
        <div className="w-full py-8 max-w-3xl mx-auto px-4">
            {/* Resume Upload Section */}
            {/* {!resumeProcessed && (
                <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col gap-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Alternative: Upload Resume
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                Save time! Upload your resume to automatically pre-fill your details below. You can also just fill out the form manually.
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

                        <div className="flex flex-col sm:flex-row justify-end items-center gap-3">
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
                </div>
            )} */}

            <Form
                onSubmit={handleSubmit(onFormSubmit)}
                className="flex flex-col gap-4"
            >
                {/* Basic Details */}
                <Card>
                    <h3 className="mb-4 text-lg font-semibold">Basic Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 pb-2">
                        <FormItem
                            label="First Name"
                            asterisk
                            invalid={Boolean(errors.firstName)}
                            errorMessage={errors.firstName?.message as string}
                        >
                            <Input
                                placeholder="Enter First Name"
                                {...register('firstName')}
                            />
                        </FormItem>
                        <FormItem
                            label="Last Name"
                            asterisk
                            invalid={Boolean(errors.lastName)}
                            errorMessage={errors.lastName?.message as string}
                        >
                            <Input
                                placeholder="Enter Last Name"
                                {...register('lastName')}
                            />
                        </FormItem>
                        <FormItem
                            label="Email"
                            asterisk
                            invalid={Boolean(errors.email)}
                            errorMessage={errors.email?.message as string}
                        >
                            <Input
                                type="email"
                                placeholder="Email"
                                disabled
                                className="bg-gray-100 cursor-not-allowed"
                                {...register('email')}
                            />
                        </FormItem>
                        <FormItem
                            label="Phone Number"
                            asterisk
                            invalid={Boolean(errors.phoneNumber)}
                            errorMessage={errors.phoneNumber?.message as string}
                        >
                            <Input
                                placeholder="Enter Phone Number"
                                {...register('phoneNumber')}
                            />
                        </FormItem>
                    </div>
                </Card>

                {/* Address */}
                <Card className="mt-5">
                    <h3 className="mb-4 text-lg font-semibold">Address Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 pb-2">
                        <FormItem
                            label="Country"
                            asterisk
                            invalid={Boolean(errors.country)}
                            errorMessage={errors.country?.message as string}
                        >
                            <Controller
                                name="country"
                                control={control}
                                render={({ field }) => (
                                    <Select<SelectOption>
                                        instanceId="country"
                                        options={countryOptions}
                                        components={{
                                            Option: CountrySelectOption,
                                            Control: CountrySelectControl,
                                        }}
                                        placeholder="Select Country"
                                        value={countryOptions.find(
                                            (option: any) => option.value === field.value,
                                        )}
                                        onChange={(option) => {
                                            field.onChange(option?.value || '')
                                            setValue('state', '')
                                            setValue('city', '')
                                        }}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label="State"
                            asterisk
                            invalid={Boolean(errors.state)}
                            errorMessage={errors.state?.message as string}
                        >
                            <Controller
                                name="state"
                                control={control}
                                render={({ field }) => (
                                    <Select<SelectOption>
                                        instanceId="state"
                                        options={stateOptions}
                                        placeholder="Select State"
                                        isDisabled={!countryValue}
                                        isLoading={isStatesLoading}
                                        value={stateOptions.find(
                                            (option: any) => option.value === field.value,
                                        )}
                                        onChange={(option) => {
                                            field.onChange(option?.value || '')
                                            setValue('city', '')
                                        }}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label="City"
                            asterisk
                            invalid={Boolean(errors.city)}
                            errorMessage={errors.city?.message as string}
                        >
                            <Controller
                                name="city"
                                control={control}
                                render={({ field }) => (
                                    <Select<SelectOption>
                                        instanceId="city"
                                        options={cityOptions}
                                        placeholder="Select City"
                                        isDisabled={!stateValue}
                                        isLoading={isCitiesLoading}
                                        value={cityOptions.find(
                                            (option: any) => option.value === field.value,
                                        )}
                                        onChange={(option) =>
                                            field.onChange(option?.value || '')
                                        }
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label="Zip / Postal Code"
                            asterisk
                            invalid={Boolean(errors.postcode)}
                            errorMessage={errors.postcode?.message as string}
                        >
                            <Input
                                type="number"
                                placeholder="Enter Zip / Postal Code"
                                {...register('postcode')}
                            />
                        </FormItem>
                    </div>

                    <div className="mt-4 pb-2">
                        <FormItem
                            label="Address"
                            asterisk
                            invalid={Boolean(errors.address)}
                            errorMessage={errors.address?.message as string}
                        >
                            <Input
                                placeholder="Enter full address"
                                {...register('address')}
                            />
                        </FormItem>
                    </div>
                </Card>

                {/* Dynamic Sections */}
                {sortedSections.map((section) => {
                    const fields = groupedFields[section]
                    return (
                        <Card key={section} className="mt-5">
                            <h3 className="mb-4 text-lg font-semibold">{section}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 pb-2">
                                {fields.map((field) => (
                                    <FormItem
                                        key={field.id}
                                        label={field.field_label}
                                        asterisk={!!field.is_required}
                                        invalid={Boolean(errors[field.field_name as keyof CandidateFormSchema])}
                                        errorMessage={errors[field.field_name as keyof CandidateFormSchema]?.message as string}
                                    >
                                        {field.field_type === 'date' ? (
                                            <Controller
                                                name={field.field_name}
                                                control={control}
                                                render={({ field: { value, onChange } }) => (
                                                    <DatePicker
                                                        value={value ? new Date(value) : null}
                                                        onChange={(date) => {
                                                            onChange(date ? date.toISOString().split('T')[0] : '')
                                                        }}
                                                        placeholder={`Select ${field.field_label}`}
                                                    />
                                                )}
                                            />
                                        ) : field.field_type === 'file' ? (
                                            <Controller
                                                name={field.field_name}
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <Upload
                                                        draggable
                                                        uploadLimit={1}
                                                        onChange={(files) => onChange(files[0] || null)}
                                                        fileList={value ? [value] : []}
                                                    >
                                                        <div className="text-center">
                                                            <p className="font-semibold">
                                                                <span className="text-gray-800 dark:text-white">
                                                                    Drop your file here, or{' '}
                                                                </span>
                                                                <span className="text-blue-500">browse</span>
                                                            </p>
                                                        </div>
                                                    </Upload>
                                                )}
                                            />
                                        ) : (
                                            <Input
                                                type={field.field_type === 'number' ? 'number' : 'text'}
                                                placeholder={`Enter ${field.field_label}`}
                                                {...register(field.field_name)}
                                            />
                                        )}
                                    </FormItem>
                                ))}
                            </div>
                        </Card>
                    )
                })}

                {/* Consent & Submit */}
                <Card className="mt-5">
                    <div className="flex flex-col gap-4">
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
                    </div>
                </Card>

                <div className="flex justify-center gap-3 mt-2">
                    <Button
                        className="w-full sm:w-auto min-w-[200px]"
                        variant="solid"
                        type="submit"
                        loading={isSubmitting}
                        disabled={isSubmitting}
                    >
                        Submit Details
                    </Button>
                </div>
            </Form>
        </div>
    )
}

const Page = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-sm h-16 px-6 md:px-10 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 z-10">
                <div className="flex items-center gap-2">
                    <Logo type="full" logoWidth={140} />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow">
                <Suspense fallback={
                    <div className="w-full flex justify-center items-center p-10 h-[50vh]">
                        <div className="flex flex-col items-center justify-center gap-4 animate-pulse">
                            <Spinner size={40} className="text-indigo-600" />
                            <div className="text-gray-500 font-medium text-lg tracking-wide">
                                Loading<span className="animate-bounce inline-block">...</span>
                            </div>
                        </div>
                    </div>
                }>
                    <InvitationContent />
                </Suspense>
            </main>

            {/* Footer */}
            <Footer pageContainerType="contained" className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700" />
        </div>
    )
}

export default Page
