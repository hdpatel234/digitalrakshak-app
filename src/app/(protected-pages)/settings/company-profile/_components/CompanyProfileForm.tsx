'use client'

import { useMemo, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { HiOutlineOfficeBuilding } from 'react-icons/hi'
import { TbPlus } from 'react-icons/tb'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Upload from '@/components/ui/Upload'
import Avatar from '@/components/ui/Avatar'
import { Form, FormItem } from '@/components/ui/Form'
import useSWR from 'swr'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import Notification from '@/components/ui/Notification'
import { toast } from '@/components/ui/toast'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Skeleton from '@/components/ui/Skeleton'
import { apiGetCountries } from '@/services/auth/countries'
import { apiGetStates } from '@/services/auth/states'
import { apiGetCities } from '@/services/auth/cities'
import { apiGetCompany, apiUpdateCompany } from '@/services/client/settings/company'

type FormSchema = {
    client_id?: number
    company_name: string
    contact_person: string
    logo?: string
    email: string
    phone: string
    gst_number: string
    pan_number: string
    address: string
    country_id: string
    state_id: string
    city_id: string
    pincode: string
}

type LocationOption = {
    label: string
    value: string
}

type CountriesApiResponse = {
    status: boolean
    data: Array<{
        id: number
        name: string
    }>
}

type StatesApiResponse = {
    status: boolean
    data: Array<{
        id: number
        name: string
    }>
}

type CitiesApiResponse = {
    status: boolean
    data: Array<{
        id: number
        name: string
    }>
}

type CompanyApiResponse = {
    status: boolean
    message: string
    data: {
        id: number
        company_name: string
        contact_person?: string
        logo?: string
        email: string
        phone?: string
        gst_number?: string
        pan_number?: string
        address?: string
        country_id?: number
        state_id?: number
        city_id?: number
        pincode?: string
    }
}

const validationSchema = z.object({
    company_name: z.string().min(1, { message: 'Company name required' }),
    contact_person: z.string().optional(),
    email: z
        .string()
        .min(1, { message: 'Email required' })
        .email({ message: 'Invalid email' }),
    phone: z.string().optional(),
    gst_number: z.string().optional(),
    pan_number: z.string().optional(),
    address: z.string().optional(),
    country_id: z.string().optional(),
    state_id: z.string().optional(),
    city_id: z.string().optional(),
    pincode: z.string().optional(),
    logo: z.string().optional(),
})

const CompanyProfileForm = () => {
    const router = useRouter()
    const [logoFile, setLogoFile] = useState<File | null>(null)
    const [removeLogo, setRemoveLogo] = useState(false)

    const { data: companyData, isLoading } = useSWR<CompanyApiResponse>(
        '/api/client/settings/company',
        () => apiGetCompany<CompanyApiResponse>(),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        }
    )

    const { data: countriesData } = useSWR<CountriesApiResponse>(
        '/api/auth/countries',
        () => apiGetCountries<CountriesApiResponse>(),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        }
    )

    const countryOptions: LocationOption[] = useMemo(() => {
        if (!countriesData?.data) return []
        return countriesData.data.map((c) => ({
            label: c.name,
            value: String(c.id),
        }))
    }, [countriesData])

    const {
        handleSubmit,
        formState: { errors, isSubmitting },
        control,
        reset,
        watch,
        setValue,
    } = useForm<FormSchema>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            company_name: '',
            contact_person: '',
            logo: '',
            email: '',
            phone: '',
            gst_number: '',
            pan_number: '',
            address: '',
            country_id: '',
            state_id: '',
            city_id: '',
            pincode: '',
        },
    })

    const selectedCountryId = watch('country_id')
    const selectedStateId = watch('state_id')

    const { data: statesData } = useSWR<StatesApiResponse>(
        selectedCountryId ? `/api/auth/states/${selectedCountryId}` : null,
        () => apiGetStates<StatesApiResponse>(selectedCountryId!),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        }
    )

    const stateOptions: LocationOption[] = useMemo(() => {
        if (!statesData?.data) return []
        return statesData.data.map((s) => ({
            label: s.name,
            value: String(s.id),
        }))
    }, [statesData])

    const { data: citiesData } = useSWR<CitiesApiResponse>(
        selectedStateId ? `/api/auth/cities/${selectedStateId}` : null,
        () => apiGetCities<CitiesApiResponse>(selectedStateId!),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        }
    )

    const cityOptions: LocationOption[] = useMemo(() => {
        if (!citiesData?.data) return []
        return citiesData.data.map((c) => ({
            label: c.name,
            value: String(c.id),
        }))
    }, [citiesData])

    useEffect(() => {
        if (companyData?.data) {
            const u = companyData.data
            reset({
                client_id: u.id,
                company_name: u.company_name || '',
                contact_person: u.contact_person || '',
                logo: u.logo || '',
                email: u.email || '',
                phone: u.phone ? String(u.phone) : '',
                gst_number: u.gst_number || '',
                pan_number: u.pan_number || '',
                address: u.address || '',
                country_id: u.country_id ? String(u.country_id) : '',
                state_id: u.state_id ? String(u.state_id) : '',
                city_id: u.city_id ? String(u.city_id) : '',
                pincode: u.pincode || '',
            })
        }
    }, [companyData, reset])

    const beforeUpload = (files: FileList | null) => {
        let valid: string | boolean = true
        const allowedFileType = ['image/jpeg', 'image/png']
        if (files) {
            const fileArray = Array.from(files)
            for (const file of fileArray) {
                if (!allowedFileType.includes(file.type)) {
                    valid = 'Please upload a .jpeg or .png file!'
                }
            }
        }
        return valid
    }

    const onFormSubmit = async (values: FormSchema) => {
        try {
            const formData = new FormData()
            
            if (values.client_id) formData.append('client_id', String(values.client_id))
            formData.append('company_name', values.company_name)
            formData.append('contact_person', values.contact_person || '')
            formData.append('email', values.email)
            formData.append('phone', values.phone || '')
            formData.append('gst_number', values.gst_number || '')
            formData.append('pan_number', values.pan_number || '')
            formData.append('address', values.address || '')
            
            if (values.country_id) formData.append('country_id', values.country_id)
            if (values.state_id) formData.append('state_id', values.state_id)
            if (values.city_id) formData.append('city_id', values.city_id)
            
            formData.append('pincode', values.pincode || '')
            
            formData.append('_method', 'PUT')
            
            formData.append('remove_logo', removeLogo ? 'true' : 'false')
            if (logoFile) {
                formData.append('logo', logoFile)
            }

            const response = await apiUpdateCompany<{ status: boolean; message?: string }, FormData>(formData)

            if (!response?.status) {
                throw new Error(response?.message || `Failed to update company details`)
            }

            toast.push(
                <Notification title="Success" type="success">
                    Company details updated successfully.
                </Notification>
            )

            setLogoFile(null)
            setRemoveLogo(false)

            router.refresh()
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Something went wrong'
            toast.push(
                <Notification title="Error" type="danger">
                    {message}
                </Notification>
            )
        }
    }

    if (isLoading) {
        return (
            <AdaptiveCard className="h-full w-full">
                {/* Title */}
                <Skeleton className="mb-6" height={28} width={180} />

                {/* Logo */}
                <div className="flex items-center gap-4 mb-8">
                    <Skeleton variant="circle" height={90} width={90} />
                    <div className="flex items-center gap-2">
                        <Skeleton height={38} width={120} />
                        <Skeleton height={38} width={120} />
                    </div>
                </div>

                {/* Row 1: Company Name + Contact Person */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="flex flex-col gap-2">
                        <Skeleton height={14} width={110} />
                        <Skeleton height={40} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Skeleton height={14} width={110} />
                        <Skeleton height={40} />
                    </div>
                </div>

                {/* Row 2: Email + Phone */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="flex flex-col gap-2">
                        <Skeleton height={14} width={80} />
                        <Skeleton height={40} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Skeleton height={14} width={100} />
                        <Skeleton height={40} />
                    </div>
                </div>

                {/* Row 3: GST + PAN */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="flex flex-col gap-2">
                        <Skeleton height={14} width={90} />
                        <Skeleton height={40} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Skeleton height={14} width={90} />
                        <Skeleton height={40} />
                    </div>
                </div>

                {/* Address textarea */}
                <div className="flex flex-col gap-2 mb-4">
                    <Skeleton height={14} width={60} />
                    <Skeleton height={90} />
                </div>

                {/* Row 4: Country + State + City + Pincode */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    {[100, 80, 60, 80].map((w, i) => (
                        <div key={i} className="flex flex-col gap-2">
                            <Skeleton height={14} width={w} />
                            <Skeleton height={40} />
                        </div>
                    ))}
                </div>

                {/* Save button */}
                <div className="flex justify-end mt-4">
                    <Skeleton height={38} width={120} />
                </div>
            </AdaptiveCard>
        )
    }

    return (
        <AdaptiveCard className="h-full w-full">
            <h3 className="mb-6">Company Profile</h3>
            <Form onSubmit={handleSubmit(onFormSubmit)}>
                <div className="mb-8">
                    <Controller
                        name="logo"
                        control={control}
                        render={({ field }) => (
                            <div className="flex items-center gap-4">
                                <Avatar
                                    size={90}
                                    className="border-4 border-white bg-gray-100 text-gray-300 shadow-lg"
                                    icon={<HiOutlineOfficeBuilding />}
                                    src={field.value || ''}
                                />
                                <div className="flex items-center gap-2">
                                    <Upload
                                        showList={false}
                                        uploadLimit={1}
                                        beforeUpload={beforeUpload}
                                        onChange={(files) => {
                                            if (files.length > 0) {
                                                setLogoFile(files[0])
                                                setRemoveLogo(false)
                                                field.onChange(
                                                    URL.createObjectURL(
                                                        files[0],
                                                    ),
                                                )
                                            }
                                        }}
                                    >
                                        <Button
                                            variant="solid"
                                            size="sm"
                                            type="button"
                                            icon={<TbPlus />}
                                        >
                                            Upload Logo
                                        </Button>
                                    </Upload>
                                    <Button
                                        size="sm"
                                        type="button"
                                        onClick={() => {
                                            setLogoFile(null)
                                            setRemoveLogo(true)
                                            field.onChange('')
                                        }}
                                    >
                                        Remove Logo
                                    </Button>
                                </div>
                            </div>
                        )}
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <FormItem
                        label="Company Name"
                        invalid={Boolean(errors.company_name)}
                        errorMessage={errors.company_name?.message}
                    >
                        <Controller
                            name="company_name"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Company Name"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Contact Person"
                        invalid={Boolean(errors.contact_person)}
                        errorMessage={errors.contact_person?.message}
                    >
                        <Controller
                            name="contact_person"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Contact Person"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <FormItem
                        label="Email"
                        invalid={Boolean(errors.email)}
                        errorMessage={errors.email?.message}
                    >
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="email"
                                    autoComplete="off"
                                    placeholder="Email Address"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Phone Number"
                        invalid={Boolean(errors.phone)}
                        errorMessage={errors.phone?.message}
                    >
                        <Controller
                            name="phone"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Phone Number"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <FormItem
                        label="GST Number"
                        invalid={Boolean(errors.gst_number)}
                        errorMessage={errors.gst_number?.message}
                    >
                        <Controller
                            name="gst_number"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    autoComplete="off"
                                    placeholder="GST Number"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="PAN Number"
                        invalid={Boolean(errors.pan_number)}
                        errorMessage={errors.pan_number?.message}
                    >
                        <Controller
                            name="pan_number"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    autoComplete="off"
                                    placeholder="PAN Number"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                </div>

                <FormItem
                    label="Address"
                    invalid={Boolean(errors.address)}
                    errorMessage={errors.address?.message}
                >
                    <Controller
                        name="address"
                        control={control}
                        render={({ field }) => (
                            <Input
                                textArea
                                autoComplete="off"
                                placeholder="Full Address"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FormItem
                        label="Country"
                        invalid={Boolean(errors.country_id)}
                        errorMessage={errors.country_id?.message}
                    >
                        <Controller
                            name="country_id"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    options={countryOptions}
                                    placeholder="Select Country"
                                    value={countryOptions.filter((o) => o.value === field.value)}
                                    onChange={(option) => {
                                        field.onChange(option?.value || '')
                                        setValue('state_id', '')
                                        setValue('city_id', '')
                                    }}
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label="State"
                        invalid={Boolean(errors.state_id)}
                        errorMessage={errors.state_id?.message}
                    >
                        <Controller
                            name="state_id"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    options={stateOptions}
                                    placeholder="Select State"
                                    isDisabled={!selectedCountryId}
                                    value={stateOptions.filter((o) => o.value === field.value)}
                                    onChange={(option) => {
                                        field.onChange(option?.value || '')
                                        setValue('city_id', '')
                                    }}
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label="City"
                        invalid={Boolean(errors.city_id)}
                        errorMessage={errors.city_id?.message}
                    >
                        <Controller
                            name="city_id"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    options={cityOptions}
                                    placeholder="Select City"
                                    isDisabled={!selectedStateId}
                                    value={cityOptions.filter((o) => o.value === field.value)}
                                    onChange={(option) => field.onChange(option?.value || '')}
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label="PIN Code"
                        invalid={Boolean(errors.pincode)}
                        errorMessage={errors.pincode?.message}
                    >
                        <Controller
                            name="pincode"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    autoComplete="off"
                                    placeholder="PIN Code"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                    <Button
                        variant="solid"
                        type="submit"
                        loading={isSubmitting}
                    >
                        Save Changes
                    </Button>
                </div>
            </Form>
        </AdaptiveCard>
    )
}

export default CompanyProfileForm
