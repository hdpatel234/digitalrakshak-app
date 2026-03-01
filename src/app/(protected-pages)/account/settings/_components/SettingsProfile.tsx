'use client'

import { useMemo, useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Upload from '@/components/ui/Upload'
import Input from '@/components/ui/Input'
import Select, { Option as DefaultOption } from '@/components/ui/Select'
import Avatar from '@/components/ui/Avatar'
import { Form, FormItem } from '@/components/ui/Form'
import NumericInput from '@/components/shared/NumericInput'
import { components } from 'react-select'
import type { ControlProps, OptionProps } from 'react-select'
import { apiGetSettingsProfile } from '@/services/AccontsService'
import useSWR from 'swr'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { HiOutlineUser } from 'react-icons/hi'
import { TbPlus } from 'react-icons/tb'
import type { ZodType } from 'zod'
import type { GetSettingsProfileResponse } from '../types'
import { apiGetCountries } from '@/services/auth/countries'
import { apiUpdateProfile } from '@/services/auth/profile'
import Notification from '@/components/ui/Notification'
import { toast } from '@/components/ui/toast'
import useCurrentSession from '@/utils/hooks/useCurrentSession'
import { useSession } from 'next-auth/react'

type ProfileSchema = {
    firstName: string
    lastName: string
    email: string
    dialCode: string
    phoneNumber: string
    img: string
    // country: string
    // address: string
    // postcode: string
    // city: string
}

type CountryOption = {
    label: string
    dialCode: string
    value: string
}

const { Control } = components

const DEFAULT_AVATAR = ''

type CountriesApiResponse = {
    status: boolean
    data: Array<{
        id: number
        name: string
        isoCode2: string
        isoCode3: string
        phoneCode: string
        currencyCode: string
        currencySymbol: string
        capital: string
        continent: string
        isDefault: boolean
        displayOrder: number
    }>
}

const validationSchema: ZodType<ProfileSchema> = z
    .object({
        firstName: z.string().min(1, { message: 'First name required' }),
        lastName: z.string().min(1, { message: 'Last name required' }),
        email: z
            .string()
            .min(1, { message: 'Email required' })
            .email({ message: 'Invalid email' }),
        dialCode: z.string(),
        phoneNumber: z.string(),
        // country: z.string().min(1, { message: 'Please select a country' }),
        // address: z.string().min(1, { message: 'Address required' }),
        // postcode: z.string().min(1, { message: 'Postcode required' }),
        // city: z.string().min(1, { message: 'City required' }),
        img: z.string(),
    })
    .refine(
        (data) => {
            if (!data.dialCode && !data.phoneNumber) return true
            if (data.dialCode && data.phoneNumber) return true
            return false
        },
        {
            message: 'Both country code and phone number are required if providing contact information',
            path: ['phoneNumber'],
        }
    )

const CustomSelectOption = (
    props: OptionProps<CountryOption> & { variant: 'country' | 'phone' },
) => {
    return (
        <DefaultOption<CountryOption>
            {...props}
            customLabel={(data, label) => (
                <span className="flex items-center gap-2">
                    <Avatar
                        shape="circle"
                        size={20}
                        src={`/img/countries/${data.value}.png`}
                    />
                    {props.variant === 'country' && <span>{label}</span>}
                    {props.variant === 'phone' && <span>{data.dialCode}</span>}
                </span>
            )}
        />
    )
}

const CustomControl = ({ children, ...props }: ControlProps<CountryOption>) => {
    const selected = props.getValue()[0]
    return (
        <Control {...props}>
            {selected && (
                <Avatar
                    className="ltr:ml-4 rtl:mr-4"
                    shape="circle"
                    size={20}
                    src={`/img/countries/${selected.value}.png`}
                />
            )}
            {children}
        </Control>
    )
}

const SettingsProfile = () => {
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [removeLogo, setRemoveLogo] = useState(false)
    const { setSession } = useCurrentSession()
    const { update } = useSession()

    const { data, mutate } = useSWR(
        '/api/auth/me',
        () => apiGetSettingsProfile<GetSettingsProfileResponse>(),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    )

    const { data: countriesData } = useSWR<CountriesApiResponse>(
        '/api/auth/countries',
        () => apiGetCountries<CountriesApiResponse>(),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    )

    // Prepare dial code list for dropdown
    const dialCodeList = useMemo(() => {
        if (!countriesData?.data) return []

        return countriesData.data.map((country) => ({
            ...country,
            label: country.phoneCode,
            dialCode: country.phoneCode,
            value: country.isoCode2,
        }))
    }, [countriesData])

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

    const onProfileSubmit = async (values: ProfileSchema) => {
        try {
            const formData = new FormData()
            formData.append('first_name', values.firstName)
            formData.append('last_name', values.lastName)
            formData.append('email', values.email)
            formData.append('phone_code', values.dialCode || '')
            formData.append('phone', values.phoneNumber || '')
            formData.append('remove_logo', removeLogo ? 'true' : 'false')

            if (avatarFile) {
                formData.append('avatar', avatarFile)
            }

            const response = await apiUpdateProfile(formData)

            const isSuccess =
                typeof response.success === 'boolean'
                    ? response.success
                    : Boolean(response.status)

            if (!isSuccess) {
                throw new Error(response.message || 'Failed to update profile')
            }

            toast.push(
                <Notification title="Profile updated" type="success">
                    Your profile has been updated successfully.
                </Notification>,
            )

            const latestProfile = await mutate()
            const firstName = latestProfile?.firstName || values.firstName
            const lastName = latestProfile?.lastName || values.lastName
            const name = `${firstName} ${lastName}`.trim()
            const email = latestProfile?.email || values.email
            const avatar =
                latestProfile?.img !== undefined
                    ? latestProfile.img
                    : removeLogo
                      ? ''
                      : data?.img || ''

            setSession((prevSession) => ({
                ...(prevSession || { expires: '', user: {} }),
                user: {
                    ...(prevSession?.user || {}),
                    name,
                    email,
                    avatar,
                    image: avatar,
                },
            }))

            await update({
                user: {
                    name,
                    email,
                    avatar,
                    image: avatar,
                },
            })

            setAvatarFile(null)
            setRemoveLogo(false)
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Failed to update profile'

            toast.push(
                <Notification title="Update failed" type="danger">
                    {message}
                </Notification>,
            )
        }
    }

    const {
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        control,
    } = useForm<ProfileSchema>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            dialCode: '',
            phoneNumber: '',
            img: DEFAULT_AVATAR,
            // country: '',
            // address: '',
            // postcode: '',
            // city: '',
        },
    })

    useEffect(() => {
        if (data) {
            reset({
                ...data,
                dialCode:
                    data.dialCode !== undefined && data.dialCode !== null
                        ? String(data.dialCode)
                        : '',
                phoneNumber:
                    data.phoneNumber !== undefined && data.phoneNumber !== null
                        ? String(data.phoneNumber)
                        : '',
                img: data.img || DEFAULT_AVATAR,
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    return (
        <>
            <h4 className="mb-8">Personal information</h4>
            <Form onSubmit={handleSubmit(onProfileSubmit)}>
                <div className="mb-8">
                    <Controller
                        name="img"
                        control={control}
                        render={({ field }) => (
                            <div className="flex items-center gap-4">
                                <Avatar
                                    size={90}
                                    className="border-4 border-white bg-gray-100 text-gray-300 shadow-lg"
                                    icon={<HiOutlineUser />}
                                    src={field.value || DEFAULT_AVATAR}
                                />
                                <div className="flex items-center gap-2">
                                    <Upload
                                        showList={false}
                                        uploadLimit={1}
                                        beforeUpload={beforeUpload}
                                        onChange={(files) => {
                                            if (files.length > 0) {
                                                setAvatarFile(files[0])
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
                                            Upload Image
                                        </Button>
                                    </Upload>
                                    <Button
                                        size="sm"
                                        type="button"
                                        onClick={() => {
                                            setAvatarFile(null)
                                            setRemoveLogo(true)
                                            field.onChange('')
                                        }}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        )}
                    />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <FormItem
                        label="First name"
                        invalid={Boolean(errors.firstName)}
                        errorMessage={errors.firstName?.message}
                    >
                        <Controller
                            name="firstName"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    autoComplete="off"
                                    placeholder="First Name"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="User name"
                        invalid={Boolean(errors.lastName)}
                        errorMessage={errors.lastName?.message}
                    >
                        <Controller
                            name="lastName"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Last Name"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                </div>
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
                                placeholder="Email"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <div className="flex items-end gap-4 w-full mb-6">
                    <FormItem
                        invalid={
                            Boolean(errors.phoneNumber) ||
                            Boolean(errors.dialCode)
                        }
                    >
                        <label className="form-label mb-2">Phone number</label>
                        <Controller
                            name="dialCode"
                            control={control}
                            render={({ field }) => (
                                <Select<CountryOption>
                                    instanceId="dial-code"
                                    options={dialCodeList}
                                    {...field}
                                    className="w-[150px]"
                                    components={{
                                        Option: (props) => (
                                            <CustomSelectOption
                                                variant="phone"
                                                {...(props as OptionProps<CountryOption>)}
                                            />
                                        ),
                                        Control: CustomControl,
                                    }}
                                    placeholder=""
                                    value={dialCodeList.filter(
                                        (option) =>
                                            option.dialCode === field.value,
                                    )}
                                    onChange={(option) =>
                                        field.onChange(option?.dialCode)
                                    }
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        className="w-full"
                        invalid={
                            Boolean(errors.phoneNumber) ||
                            Boolean(errors.dialCode)
                        }
                        errorMessage={errors.phoneNumber?.message}
                    >
                        <Controller
                            name="phoneNumber"
                            control={control}
                            render={({ field }) => (
                                <NumericInput
                                    autoComplete="off"
                                    placeholder="Phone Number"
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                />
                            )}
                        />
                    </FormItem>
                </div>
                {/* <h4 className="mb-6">Address information</h4>
                <FormItem
                    label="Country"
                    invalid={Boolean(errors.country)}
                    errorMessage={errors.country?.message}
                >
                    <Controller
                        name="country"
                        control={control}
                        render={({ field }) => (
                            <Select<CountryOption>
                                instanceId="country"
                                options={countryList}
                                {...field}
                                components={{
                                    Option: (props) => (
                                        <CustomSelectOption
                                            variant="country"
                                            {...(props as OptionProps<CountryOption>)}
                                        />
                                    ),
                                    Control: CustomControl,
                                }}
                                placeholder=""
                                value={countryList.filter(
                                    (option) => option.value === field.value,
                                )}
                                onChange={(option) =>
                                    field.onChange(option?.value)
                                }
                            />
                        )}
                    />
                </FormItem>
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
                                type="text"
                                autoComplete="off"
                                placeholder="Address"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormItem
                        label="City"
                        invalid={Boolean(errors.city)}
                        errorMessage={errors.city?.message}
                    >
                        <Controller
                            name="city"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    autoComplete="off"
                                    placeholder="City"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Postal Code"
                        invalid={Boolean(errors.postcode)}
                        errorMessage={errors.postcode?.message}
                    >
                        <Controller
                            name="postcode"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Postal Code"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                </div>  */}
                <div className="flex justify-end">
                    <Button
                        variant="solid"
                        type="submit"
                        loading={isSubmitting}
                    >
                        Save
                    </Button>
                </div>
            </Form>
        </>
    )
}

export default SettingsProfile
