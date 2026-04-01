'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import SpaceSignBoard from '@/assets/svg/SpaceSignBoard'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { FormItem } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import Upload from '@/components/ui/Upload'
import toast from '@/components/ui/toast'
import { TbCircleCheck } from 'react-icons/tb'

type InvitationPageField = {
    id: number
    field_name: string
    field_label: string
    field_type: string
    is_required: number
    validation_regex?: string | null
}

type InvitationCandidate = {
    first_name?: string | null
    last_name?: string | null
    email?: string | null
    phone?: string | null
    address?: string | null
    pincode?: string | null
    country_id?: number | string | null
    state_id?: number | string | null
    city_id?: number | string | null
}

type InvitationPayload = {
    candidate?: InvitationCandidate
    fields?: InvitationPageField[]
    form_data?: Record<string, unknown> | null
}

type InvitationApiResponse = {
    status: boolean
    message: string
    data: InvitationPayload | []
}

type LocationOption = {
    id: number
    name: string
}

type SelectOption = {
    label: string
    value: string
}

type LocationApiResponse = {
    status: boolean
    data?: LocationOption[]
    message?: string
}

type InvitationFormProps = {
    token: string
}

type SubmitApiResponse = {
    status: boolean
    message?: string
    data?: unknown
}

type ResumeParsePhone = {
    countryCode?: string | null
    number?: string | null
    full?: string | null
}

type ResumeParsePersonalInformation = {
    fullName?: string | null
    firstName?: string | null
    middleName?: string | null
    lastName?: string | null
    dateOfBirth?: string | null
    email?: string | null
    phone?: ResumeParsePhone | null
    website?: string | null
    linkedin?: string | null
    github?: string | null
}

type ResumeParseAddressBlock = {
    tehsil?: string | null
    district?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    pincode?: string | null
    full?: string | null
}

type ResumeParseData = {
    personalInformation?: ResumeParsePersonalInformation | null
    address?: {
        residential?: ResumeParseAddressBlock | null
        permanent?: ResumeParseAddressBlock | null
    } | null
    education?: Array<Record<string, unknown>>
    workExperience?: Array<Record<string, unknown>>
}

type ResumeParseResponse = {
    status?: boolean
    success?: boolean
    message?: string
    data?: ResumeParseData
}

const MAX_RESUME_SIZE = 10 * 1024 * 1024
const ACCEPTED_RESUME_EXTENSIONS = ['.pdf', '.doc', '.docx', '.txt']


const fieldTypeToInputType = (fieldType: string) => {
    const normalizedType = String(fieldType || '').toLowerCase()

    if (normalizedType === 'integer' || normalizedType === 'number') {
        return 'text'
    }

    if (normalizedType === 'email') {
        return 'email'
    }

    if (normalizedType === 'date') {
        return 'date'
    }

    return 'text'
}

const toStringValue = (value: unknown) => {
    if (value === null || value === undefined) {
        return ''
    }

    return String(value)
}

const getFirstMatchingValue = (
    sources: Array<Record<string, unknown>>,
    keys: string[],
) => {
    for (const source of sources) {
        for (const key of keys) {
            const current = source[key]
            if (current !== undefined && current !== null && current !== '') {
                return toStringValue(current)
            }
        }
    }

    return ''
}

const normalizeOptionLabel = (value: string) =>
    value.trim().toLowerCase().replace(/\s+/g, ' ')

const resolveOptionValue = (options: SelectOption[], rawHint: string) => {
    const hint = normalizeOptionLabel(rawHint)
    if (!hint) {
        return ''
    }

    const exactMatch = options.find(
        (option) => normalizeOptionLabel(option.label) === hint,
    )
    if (exactMatch) {
        return exactMatch.value
    }

    const partialMatch = options.find((option) => {
        const normalized = normalizeOptionLabel(option.label)
        return normalized.includes(hint) || hint.includes(normalized)
    })

    return partialMatch?.value || ''
}

const splitFullName = (fullName: string) => {
    const trimmed = fullName.trim()
    if (!trimmed) {
        return { firstName: '', lastName: '' }
    }

    const parts = trimmed.split(/\s+/)
    if (parts.length === 1) {
        return { firstName: parts[0], lastName: '' }
    }

    return {
        firstName: parts[0],
        lastName: parts.slice(1).join(' '),
    }
}

const FieldSkeleton = ({ className = '' }: { className?: string }) => (
    <div
        className={`h-11 w-full animate-pulse rounded-md bg-gray-200/80 dark:bg-gray-800/80 ${className}`}
    ></div>
)

const InvitationForm = ({ token }: InvitationFormProps) => {
    const [loading, setLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')
    const [invitationData, setInvitationData] = useState<InvitationPayload | null>(
        null,
    )
    const [invitationLoaded, setInvitationLoaded] = useState(false)
    const [formValues, setFormValues] = useState<Record<string, string>>({})
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [submitSuccessMessage, setSubmitSuccessMessage] = useState('')
    const [resumeFiles, setResumeFiles] = useState<File[]>([])
    const [isParsingResume, setIsParsingResume] = useState(false)
    const [isPrefilling, setIsPrefilling] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [resumeMessage, setResumeMessage] = useState<{
        type: 'success' | 'danger'
        message: string
    } | null>(null)
    const [resumeLocationHints, setResumeLocationHints] = useState({
        country: '',
        state: '',
        city: '',
    })

    const [countries, setCountries] = useState<LocationOption[]>([])
    const [states, setStates] = useState<LocationOption[]>([])
    const [cities, setCities] = useState<LocationOption[]>([])

    const countryId = formValues.country_id || ''
    const stateId = formValues.state_id || ''

    const validateResumeFile = (file: File | null | undefined) => {
        if (!file) {
            return 'Please select a resume file to upload.'
        }

        const name = file.name.toLowerCase()
        const hasValidExtension = ACCEPTED_RESUME_EXTENSIONS.some((ext) =>
            name.endsWith(ext),
        )

        if (!hasValidExtension) {
            return `Allowed file types: ${ACCEPTED_RESUME_EXTENSIONS.join(', ')}`
        }

        if (file.size > MAX_RESUME_SIZE) {
            return 'File size must be 10 MB or less.'
        }

        return true
    }

    useEffect(() => {
        let isMounted = true

        const loadInvitation = async () => {
            setLoading(true)
            setErrorMessage('')
            setInvitationLoaded(false)
            setFieldErrors({})

            try {
                const response = await fetch(
                    `/api/client/invitations/by-token/${encodeURIComponent(token)}`,
                    {
                        method: 'GET',
                        cache: 'no-store',
                    },
                )
                const rawBody = await response.text()

                let payload: InvitationApiResponse | null = null

                try {
                    payload = JSON.parse(rawBody) as InvitationApiResponse
                } catch {
                    console.error('[InvitationForm] Non-JSON response body', {
                        token,
                        status: response.status,
                        statusText: response.statusText,
                        rawBody,
                    })
                    throw new Error('Invalid JSON response from invitation API')
                }

                if (!response.ok) {
                    console.error('[InvitationForm] Invitation API failed', {
                        token,
                        status: response.status,
                        statusText: response.statusText,
                        payload,
                    })
                }

                if (!isMounted) {
                    return
                }

                if (!payload?.status || Array.isArray(payload.data)) {
                    setInvitationData(null)
                    setInvitationLoaded(false)
                    setErrorMessage(
                        payload.message ||
                        'Invitation not found or token is invalid.',
                    )
                    return
                }

                const data = payload.data
                const candidate = data.candidate || {}
                const formData = data.form_data || {}
                const rootData = data as Record<string, unknown>
                const candidateData = candidate as Record<string, unknown>
                const formDataRecord = formData as Record<string, unknown>
                const sources = [candidateData, formDataRecord, rootData]

                const baseValues: Record<string, string> = {
                    first_name: getFirstMatchingValue(sources, [
                        'first_name',
                        'firstname',
                    ]),
                    last_name: getFirstMatchingValue(sources, [
                        'last_name',
                        'lastname',
                    ]),
                    email: getFirstMatchingValue(sources, ['email']),
                    phone: getFirstMatchingValue(sources, ['phone']),
                    address: getFirstMatchingValue(sources, ['address']),
                    pincode: getFirstMatchingValue(sources, ['pincode', 'zip']),
                    country_id: getFirstMatchingValue(sources, [
                        'country_id',
                        'country',
                    ]),
                    state_id: getFirstMatchingValue(sources, [
                        'state_id',
                        'state',
                    ]),
                    city_id: getFirstMatchingValue(sources, ['city_id', 'city']),
                }

                for (const field of data.fields || []) {
                    if (!baseValues[field.field_name]) {
                        baseValues[field.field_name] = getFirstMatchingValue(
                            sources,
                            [field.field_name],
                        )
                    }
                }

                setInvitationData(data)
                setFormValues(baseValues)
                setInvitationLoaded(true)
            } catch (error) {
                console.error('[InvitationForm] Failed to fetch invitation', {
                    token,
                    error,
                })

                if (!isMounted) {
                    return
                }

                setInvitationData(null)
                setInvitationLoaded(false)
                setErrorMessage('Failed to fetch invitation details.')
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        loadInvitation()

        return () => {
            isMounted = false
        }
    }, [token])

    useEffect(() => {
        let isMounted = true

        const loadCountries = async () => {
            if (!invitationLoaded) {
                setCountries([])
                return
            }

            try {
                const response = await fetch('/api/auth/countries', {
                    method: 'GET',
                    cache: 'no-store',
                })
                const payload = (await response.json()) as LocationApiResponse

                if (!isMounted || !payload.status) {
                    return
                }

                setCountries(payload.data || [])
            } catch {
                setCountries([])
            }
        }

        loadCountries()

        return () => {
            isMounted = false
        }
    }, [invitationLoaded])

    useEffect(() => {
        let isMounted = true

        const loadStates = async () => {
            if (!invitationLoaded || !countryId) {
                setStates([])
                return
            }

            try {
                const response = await fetch(
                    `/api/auth/states?country_id=${encodeURIComponent(countryId)}`,
                    {
                        method: 'GET',
                        cache: 'no-store',
                    },
                )
                const payload = (await response.json()) as LocationApiResponse

                if (!isMounted || !payload.status) {
                    return
                }

                setStates(payload.data || [])
            } catch {
                if (isMounted) {
                    setStates([])
                }
            }
        }

        loadStates()

        return () => {
            isMounted = false
        }
    }, [invitationLoaded, countryId])

    useEffect(() => {
        let isMounted = true

        const loadCities = async () => {
            if (!invitationLoaded || !stateId) {
                setCities([])
                return
            }

            try {
                const response = await fetch(
                    `/api/auth/cities?state_id=${encodeURIComponent(stateId)}`,
                    {
                        method: 'GET',
                        cache: 'no-store',
                    },
                )
                const payload = (await response.json()) as LocationApiResponse

                if (!isMounted || !payload.status) {
                    return
                }

                setCities(payload.data || [])
            } catch {
                if (isMounted) {
                    setCities([])
                }
            }
        }

        loadCities()

        return () => {
            isMounted = false
        }
    }, [invitationLoaded, stateId])

    const fields = useMemo(() => invitationData?.fields || [], [invitationData])
    const countryOptions = useMemo<SelectOption[]>(
        () =>
            countries.map((country) => ({
                label: country.name,
                value: String(country.id),
            })),
        [countries],
    )
    const stateOptions = useMemo<SelectOption[]>(
        () =>
            states.map((state) => ({
                label: state.name,
                value: String(state.id),
            })),
        [states],
    )
    const cityOptions = useMemo<SelectOption[]>(
        () =>
            cities.map((city) => ({
                label: city.name,
                value: String(city.id),
            })),
        [cities],
    )

    const handleValueChange = useCallback((name: string, value: string) => {
        setFieldErrors((prev) => {
            if (!prev[name]) {
                return prev
            }

            const next = { ...prev }
            delete next[name]
            return next
        })

        setFormValues((prev) => {
            const next = { ...prev, [name]: value }

            if (name === 'country_id') {
                next.state_id = ''
                next.city_id = ''
                setFieldErrors((current) => {
                    const cloned = { ...current }
                    delete cloned.state_id
                    delete cloned.city_id
                    return cloned
                })
            }

            if (name === 'state_id') {
                next.city_id = ''
                setFieldErrors((current) => {
                    const cloned = { ...current }
                    delete cloned.city_id
                    return cloned
                })
            }

            return next
        })
    }, [])

    const applyResumeLocations = useCallback(() => {
        if (
            resumeLocationHints.country &&
            !formValues.country_id &&
            countryOptions.length > 0
        ) {
            const match = resolveOptionValue(
                countryOptions,
                resumeLocationHints.country,
            )
            if (match) {
                handleValueChange('country_id', match)
            }
        }

        if (
            resumeLocationHints.state &&
            !formValues.state_id &&
            stateOptions.length > 0
        ) {
            const match = resolveOptionValue(
                stateOptions,
                resumeLocationHints.state,
            )
            if (match) {
                handleValueChange('state_id', match)
            }
        }

        if (
            resumeLocationHints.city &&
            !formValues.city_id &&
            cityOptions.length > 0
        ) {
            const match = resolveOptionValue(
                cityOptions,
                resumeLocationHints.city,
            )
            if (match) {
                handleValueChange('city_id', match)
            }
        }
    }, [
        resumeLocationHints,
        formValues,
        countryOptions,
        stateOptions,
        cityOptions,
        handleValueChange,
    ])

    useEffect(() => {
        applyResumeLocations()
    }, [applyResumeLocations])

    const applyResumePrefill = useCallback(
        (data: ResumeParseData) => {
            const personal = data.personalInformation || {}
            const phone = personal.phone || {}
            const address = data.address || {}
            const residential = address.residential || {}
            const permanent = address.permanent || {}
            const addressSources: Array<Record<string, unknown>> = [
                residential as Record<string, unknown>,
                permanent as Record<string, unknown>,
            ]

            const fullName = toStringValue(personal.fullName)
            const nameParts =
                fullName && (!personal.firstName || !personal.lastName)
                    ? splitFullName(fullName)
                    : { firstName: '', lastName: '' }

            const nextValues: Record<string, string> = {}

            const safeSet = (key: string, value: string) => {
                if (value) {
                    nextValues[key] = value
                }
            }

            safeSet(
                'first_name',
                toStringValue(personal.firstName) || nameParts.firstName,
            )
            safeSet(
                'last_name',
                toStringValue(personal.lastName) || nameParts.lastName,
            )
            safeSet('email', toStringValue(personal.email))
            safeSet(
                'phone',
                toStringValue(phone.full) ||
                    toStringValue(phone.number) ||
                    toStringValue(phone.countryCode),
            )
            safeSet(
                'address',
                getFirstMatchingValue(addressSources, [
                    'full',
                    'city',
                    'district',
                    'state',
                    'country',
                    'tehsil',
                ]),
            )
            safeSet(
                'pincode',
                getFirstMatchingValue(addressSources, ['pincode', 'zip']),
            )

            const parsedFieldValues: Record<string, string> = {
                full_name: toStringValue(personal.fullName),
                fullname: toStringValue(personal.fullName),
                date_of_birth: toStringValue(personal.dateOfBirth),
                dateOfBirth: toStringValue(personal.dateOfBirth),
                dob: toStringValue(personal.dateOfBirth),
                website: toStringValue(personal.website),
                linkedin: toStringValue(personal.linkedin),
                github: toStringValue(personal.github),
            }

            for (const field of fields) {
                const parsedValue = parsedFieldValues[field.field_name]
                if (parsedValue) {
                    nextValues[field.field_name] = parsedValue
                }
            }

            if (Object.keys(nextValues).length > 0) {
                setFormValues((prev) => ({
                    ...prev,
                    ...nextValues,
                }))
            }

            setResumeLocationHints({
                country: toStringValue(
                    getFirstMatchingValue(addressSources, ['country']),
                ),
                state: toStringValue(
                    getFirstMatchingValue(addressSources, ['state']),
                ),
                city: toStringValue(
                    getFirstMatchingValue(addressSources, ['city', 'district']),
                ),
            })
        },
        [fields],
    )

    const validateRequiredForm = () => {
        const errors: Record<string, string> = {}

        const requiredBaseFields: Array<{ key: string; label: string }> = [
            { key: 'first_name', label: 'First Name' },
            { key: 'last_name', label: 'Last Name' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' },
            { key: 'address', label: 'Address' },
            { key: 'country_id', label: 'Country' },
            { key: 'state_id', label: 'State' },
            { key: 'city_id', label: 'City' },
            { key: 'pincode', label: 'Pincode' },
        ]

        for (const field of requiredBaseFields) {
            const value = String(formValues[field.key] || '').trim()
            if (!value) {
                errors[field.key] = `${field.label} is required`
            }
        }

        for (const dynamicField of fields) {
            const value = String(formValues[dynamicField.field_name] || '').trim()

            if (!value) {
                errors[dynamicField.field_name] = `${dynamicField.field_label} is required`
                continue
            }

            if (dynamicField.validation_regex) {
                try {
                    const regex = new RegExp(dynamicField.validation_regex)
                    if (!regex.test(value)) {
                        errors[dynamicField.field_name] = `${dynamicField.field_label} format is invalid`
                    }
                } catch {
                    // Ignore invalid regex from API config.
                }
            }
        }

        setFieldErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSubmit = async () => {
        const isValid = validateRequiredForm()
        if (!isValid) {
            return
        }

        const candidateDetails = {
            first_name: String(formValues.first_name || '').trim(),
            last_name: String(formValues.last_name || '').trim(),
            email: String(formValues.email || '').trim(),
            phone: String(formValues.phone || '').trim(),
            address: String(formValues.address || '').trim(),
            country_id: String(formValues.country_id || '').trim(),
            state_id: String(formValues.state_id || '').trim(),
            city_id: String(formValues.city_id || '').trim(),
            pincode: String(formValues.pincode || '').trim(),
        }

        const fieldValues = fields.map((field) => ({
            field_id: field.id,
            value: String(formValues[field.field_name] || '').trim(),
        }))

        const requestPayload = {
            candidate_details: candidateDetails,
            fields: fieldValues,
        }

        try {
            setIsSubmitting(true)

            const response = await fetch(
                `/api/client/invitations/by-token/${encodeURIComponent(token)}`,
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestPayload),
                },
            )

            const payload = (await response.json()) as SubmitApiResponse

            if (!response.ok || !payload.status) {
                toast.push(
                    <Notification type="danger">
                        {payload.message || 'Failed to submit invitation'}
                    </Notification>,
                    { placement: 'top-center' },
                )
                return
            }

            toast.push(
                <Notification type="success">
                    {payload.message || 'Invitation submitted successfully'}
                </Notification>,
                { placement: 'top-center' },
            )
            setSubmitSuccessMessage(
                payload.message || 'Invitation submitted successfully',
            )
            setIsSubmitted(true)
        } catch (error) {
            console.error('[InvitationForm] submit error:', error)
            toast.push(
                <Notification type="danger">
                    Failed to submit invitation
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const submitResume = async (file: File) => {
        if (!token) {
            const message = 'Invitation token is required to parse the resume.'
            setResumeMessage({ type: 'danger', message })
            toast.push(<Notification type="danger">{message}</Notification>, {
                placement: 'top-center',
            })
            return
        }

        try {
            setIsParsingResume(true)
            setIsPrefilling(true)
            setResumeMessage(null)

            const requestFormData = new FormData()
            requestFormData.append('resume', file, file.name)

            const response = await fetch(
                `/api/client/invitations/by-token/${encodeURIComponent(token)}/parse-resume`,
                {
                    method: 'POST',
                    body: requestFormData,
                },
            )

            const payload = (await response.json().catch(() => null)) as
                | ResumeParseResponse
                | null

            const isSuccess =
                response.ok && Boolean(payload?.status ?? payload?.success)
            const message =
                payload?.message ||
                (isSuccess
                    ? 'Resume parsed successfully.'
                    : 'Failed to parse resume.')

            setResumeMessage({
                type: isSuccess ? 'success' : 'danger',
                message,
            })
            toast.push(
                <Notification type={isSuccess ? 'success' : 'danger'}>
                    {message}
                </Notification>,
                { placement: 'top-center' },
            )

            if (isSuccess && payload?.data) {
                applyResumePrefill(payload.data)
            }
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Failed to parse resume.'
            setResumeMessage({ type: 'danger', message })
            toast.push(<Notification type="danger">{message}</Notification>, {
                placement: 'top-center',
            })
        } finally {
            setIsParsingResume(false)
            setIsPrefilling(false)
        }
    }

    const handleResumeUpload = (files: File[]) => {
        setResumeFiles(files)
        setResumeMessage(null)
    }

    const handleProcessResume = async () => {
        const file = resumeFiles[0]
        const validation = validateResumeFile(file)
        if (validation !== true) {
            const message = String(validation)
            setResumeMessage({ type: 'danger', message })
            toast.push(<Notification type="danger">{message}</Notification>, {
                placement: 'top-center',
            })
            return
        }

        setShowForm(true)
        await submitResume(file)
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-400"></div>
            </div>
        )
    }

    if (errorMessage || !invitationData) {
        return (
            <div className="w-full rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center">
                    <SpaceSignBoard height={220} width={220} />
                    <h3 className="mb-2 mt-6">Invalid Invitation</h3>
                    <p className="text-base">
                        {errorMessage ||
                            'Invitation not found or token is invalid.'}
                    </p>
                </div>
            </div>
        )
    }

    if (isSubmitted) {
        return (
            <div className="w-full rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center">
                    <TbCircleCheck className="text-emerald-500" size={96} />
                    <h3 className="mb-2 mt-6">Form Submitted</h3>
                    <p className="text-base">
                        {submitSuccessMessage || 'Invitation submitted successfully.'}
                    </p>
                </div>
            </div>
        )
    }

    if (!showForm) {
        return (
            <div className="w-full max-w-3xl flex flex-col gap-4">
                <Card>
                    <h4>Upload Resume</h4>
                    <p className="mt-1 mb-6 text-sm text-gray-500">
                        Upload your resume to prefill your details before
                        completing the form.
                    </p>

                    <Upload
                        disabled={isParsingResume}
                        draggable
                        accept={ACCEPTED_RESUME_EXTENSIONS.join(',')}
                        uploadLimit={1}
                        fileList={resumeFiles}
                        onChange={handleResumeUpload}
                        onFileRemove={(files) => {
                            setResumeFiles(files)
                            setResumeMessage(null)
                        }}
                        beforeUpload={(files) => validateResumeFile(files?.[0])}
                        tip={
                            <div className="text-xs text-gray-500">
                                Allowed file types: {ACCEPTED_RESUME_EXTENSIONS.join(', ')}. Max size: 10 MB.
                            </div>
                        }
                    />

                    {resumeMessage ? (
                        <div className="mt-4">
                            <Notification type={resumeMessage.type}>
                                {resumeMessage.message}
                            </Notification>
                        </div>
                    ) : null}
                </Card>

                <div className="flex flex-wrap justify-end gap-3">
                    <Button
                        type="button"
                        variant="plain"
                        disabled={isParsingResume}
                        onClick={() => setShowForm(true)}
                    >
                        Skip for now
                    </Button>
                    <Button
                        type="button"
                        variant="solid"
                        loading={isParsingResume}
                        disabled={isParsingResume || resumeFiles.length === 0}
                        onClick={handleProcessResume}
                    >
                        Process Resume
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-3xl flex flex-col gap-4">
            <Card>
                <h4>Candidate Details</h4>
                <p className="mt-1 mb-6 text-sm text-gray-500">
                    Fill your personal details.
                </p>

                <div className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormItem
                            label="First Name"
                            htmlFor="first_name"
                            asterisk
                            invalid={Boolean(fieldErrors.first_name)}
                            errorMessage={fieldErrors.first_name}
                        >
                            {isPrefilling ? (
                                <FieldSkeleton />
                            ) : (
                                <Input
                                    id="first_name"
                                    name="first_name"
                                    type="text"
                                    required
                                    autoComplete="off"
                                    placeholder="First Name"
                                    value={formValues.first_name || ''}
                                    onChange={(event) =>
                                        handleValueChange(
                                            'first_name',
                                            event.target.value,
                                        )
                                    }
                                />
                            )}
                        </FormItem>

                        <FormItem
                            label="Last Name"
                            htmlFor="last_name"
                            asterisk
                            invalid={Boolean(fieldErrors.last_name)}
                            errorMessage={fieldErrors.last_name}
                        >
                            {isPrefilling ? (
                                <FieldSkeleton />
                            ) : (
                                <Input
                                    id="last_name"
                                    name="last_name"
                                    type="text"
                                    required
                                    autoComplete="off"
                                    placeholder="Last Name"
                                    value={formValues.last_name || ''}
                                    onChange={(event) =>
                                        handleValueChange(
                                            'last_name',
                                            event.target.value,
                                        )
                                    }
                                />
                            )}
                        </FormItem>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormItem
                            label="Email"
                            htmlFor="email"
                            asterisk
                            invalid={Boolean(fieldErrors.email)}
                            errorMessage={fieldErrors.email}
                        >
                            {isPrefilling ? (
                                <FieldSkeleton />
                            ) : (
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    autoComplete="off"
                                    placeholder="Email"
                                    value={formValues.email || ''}
                                    readOnly
                                    disabled
                                />
                            )}
                        </FormItem>

                        <FormItem
                            label="Phone"
                            htmlFor="phone"
                            asterisk
                            invalid={Boolean(fieldErrors.phone)}
                            errorMessage={fieldErrors.phone}
                        >
                            {isPrefilling ? (
                                <FieldSkeleton />
                            ) : (
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="text"
                                    required
                                    autoComplete="off"
                                    placeholder="Phone"
                                    value={formValues.phone || ''}
                                    onChange={(event) =>
                                        handleValueChange(
                                            'phone',
                                            event.target.value,
                                        )
                                    }
                                />
                            )}
                        </FormItem>
                    </div>

                    <FormItem
                        label="Address"
                        htmlFor="address"
                        asterisk
                        invalid={Boolean(fieldErrors.address)}
                        errorMessage={fieldErrors.address}
                    >
                        {isPrefilling ? (
                            <FieldSkeleton />
                        ) : (
                            <Input
                                id="address"
                                name="address"
                                type="text"
                                required
                                autoComplete="off"
                                placeholder="Address"
                                value={formValues.address || ''}
                                onChange={(event) =>
                                    handleValueChange(
                                        'address',
                                        event.target.value,
                                    )
                                }
                            />
                        )}
                    </FormItem>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormItem
                            label="Country"
                            htmlFor="country_id"
                            asterisk
                            invalid={Boolean(fieldErrors.country_id)}
                            errorMessage={fieldErrors.country_id}
                        >
                            {isPrefilling ? (
                                <FieldSkeleton />
                            ) : (
                                <Select<SelectOption>
                                    instanceId="country_id"
                                    options={countryOptions}
                                    placeholder="Select Country"
                                    value={countryOptions.find(
                                        (option) =>
                                            option.value ===
                                            (formValues.country_id || ''),
                                    )}
                                    onChange={(option) =>
                                        handleValueChange(
                                            'country_id',
                                            option?.value || '',
                                        )
                                    }
                                />
                            )}
                        </FormItem>

                        <FormItem
                            label="State"
                            htmlFor="state_id"
                            asterisk
                            invalid={Boolean(fieldErrors.state_id)}
                            errorMessage={fieldErrors.state_id}
                        >
                            {isPrefilling ? (
                                <FieldSkeleton />
                            ) : (
                                <Select<SelectOption>
                                    instanceId="state_id"
                                    options={stateOptions}
                                    placeholder="Select State"
                                    isDisabled={!countryId}
                                    value={stateOptions.find(
                                        (option) =>
                                            option.value ===
                                            (formValues.state_id || ''),
                                    )}
                                    onChange={(option) =>
                                        handleValueChange(
                                            'state_id',
                                            option?.value || '',
                                        )
                                    }
                                />
                            )}
                        </FormItem>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormItem
                            label="City"
                            htmlFor="city_id"
                            asterisk
                            invalid={Boolean(fieldErrors.city_id)}
                            errorMessage={fieldErrors.city_id}
                        >
                            {isPrefilling ? (
                                <FieldSkeleton />
                            ) : (
                                <Select<SelectOption>
                                    instanceId="city_id"
                                    options={cityOptions}
                                    placeholder="Select City"
                                    isDisabled={!stateId}
                                    value={cityOptions.find(
                                        (option) =>
                                            option.value ===
                                            (formValues.city_id || ''),
                                    )}
                                    onChange={(option) =>
                                        handleValueChange(
                                            'city_id',
                                            option?.value || '',
                                        )
                                    }
                                />
                            )}
                        </FormItem>

                        <FormItem
                            label="Pincode"
                            htmlFor="pincode"
                            asterisk
                            invalid={Boolean(fieldErrors.pincode)}
                            errorMessage={fieldErrors.pincode}
                        >
                            {isPrefilling ? (
                                <FieldSkeleton />
                            ) : (
                                <Input
                                    id="pincode"
                                    name="pincode"
                                    type="text"
                                    required
                                    autoComplete="off"
                                    placeholder="Pincode"
                                    value={formValues.pincode || ''}
                                    onChange={(event) =>
                                        handleValueChange(
                                            'pincode',
                                            event.target.value,
                                        )
                                    }
                                />
                            )}
                        </FormItem>
                    </div>
                </div>
            </Card>

            {fields.length > 0 ? (
                <Card>
                    <h4>Verification Details</h4>
                    <p className="mt-1 mb-6 text-sm text-gray-500">
                        This details will use for perform verification.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {fields.map((field) => {
                            const value = formValues[field.field_name] || ''
                            const regexHint = field.validation_regex
                                ? `Pattern: ${field.validation_regex}`
                                : ''
                            const requiredHint =
                                field.is_required === 1 ? 'Required field' : ''
                            const helperText = [requiredHint, regexHint]
                                .filter(Boolean)
                                .join(' | ')

                            return (
                                <FormItem
                                    key={field.id}
                                    label={field.field_label}
                                    htmlFor={field.field_name}
                                    asterisk
                                    invalid={Boolean(fieldErrors[field.field_name])}
                                    errorMessage={fieldErrors[field.field_name]}
                                >
                                    {isPrefilling ? (
                                        <FieldSkeleton />
                                    ) : (
                                        <Input
                                            id={field.field_name}
                                            name={field.field_name}
                                            type={fieldTypeToInputType(
                                                field.field_type,
                                            )}
                                            autoComplete="off"
                                            inputMode={
                                                field.field_type === 'integer'
                                                    ? 'numeric'
                                                    : undefined
                                            }
                                            pattern={
                                                field.validation_regex || undefined
                                            }
                                            required
                                            value={value}
                                            placeholder={field.field_label}
                                            onChange={(event) =>
                                                handleValueChange(
                                                    field.field_name,
                                                    event.target.value,
                                                )
                                            }
                                        />
                                    )}
                                    {helperText ? (
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                            {helperText}
                                        </p>
                                    ) : null}
                                </FormItem>
                            )
                        })}
                    </div>
                </Card>
            ) : null}

            <div className="flex justify-end">
                <Button
                    type="button"
                    variant="solid"
                    onClick={handleSubmit}
                    loading={isSubmitting}
                    disabled={isSubmitting || isPrefilling}
                >
                    Submit
                </Button>
            </div>
        </div>
    )
}

export default InvitationForm
