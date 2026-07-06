'use client'

import { useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select, { Option as DefaultOption } from '@/components/ui/Select'
import Avatar from '@/components/ui/Avatar'
import { Form, FormItem } from '@/components/ui/Form'
import Checkbox from '@/components/ui/Checkbox'
import NumericInput from '@/components/shared/NumericInput'
import { PERMISSION_GROUPS } from '@/constants/permissions.constant'
import { components } from 'react-select'
import type { ControlProps, OptionProps } from 'react-select'
import useSWR from 'swr'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import type { ZodType } from 'zod'
import Notification from '@/components/ui/Notification'
import { toast } from '@/components/ui/toast'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import { apiGetCountries } from '@/services/auth/countries'
import { apiAddTeamMember, apiGetTeamMember, apiUpdateTeamMember } from '@/services/client/settings/users'

type FormSchema = {
    firstName?: string
    lastName?: string
    email: string
    dialCode?: string
    phoneNumber?: string
    permissions: string[]
}

type CountryOption = {
    label: string
    dialCode: string
    value: string
}

const { Control } = components

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

type TeamMemberApiResponse = {
    status: boolean
    message: string
    data: {
        id: number
        first_name: string
        last_name: string
        email: string
        phone_code: string
        phone: string | number
        permissions?: Array<{ name: string }>
    }
}

const validationSchema: ZodType<FormSchema> = z.object({
    firstName: z.string().min(1, { message: 'First name required' }),
    lastName: z.string().min(1, { message: 'Last name required' }),
    email: z
        .string()
        .min(1, { message: 'Email required' })
        .email({ message: 'Invalid email' }),
    dialCode: z.string().optional(),
    phoneNumber: z.string().optional(),
    permissions: z.array(z.string()).min(1, { message: 'At least one permission is required' }),
})

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

const AddTeamMemberForm = ({ userId }: { userId?: string }) => {
    const router = useRouter()

    const { data: countriesData } = useSWR<CountriesApiResponse>(
        '/api/auth/countries',
        () => apiGetCountries<CountriesApiResponse>(),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    )

    const { data: userData } = useSWR<TeamMemberApiResponse>(
        userId ? `/api/client/settings/users/${userId}` : null,
        () => apiGetTeamMember<TeamMemberApiResponse>(userId!),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        }
    )

    const dialCodeList = useMemo(() => {
        if (!countriesData?.data) return []

        return countriesData.data.map((country) => ({
            ...country,
            label: country.phoneCode,
            dialCode: country.phoneCode,
            value: country.isoCode2,
        }))
    }, [countriesData])

    const {
        handleSubmit,
        formState: { errors, isSubmitting },
        control,
        reset,
    } = useForm<FormSchema>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            dialCode: '',
            phoneNumber: '',
            permissions: [],
        },
    })

    useEffect(() => {
        if (userData?.data) {
            const u = userData.data
            reset({
                firstName: u.first_name || '',
                lastName: u.last_name || '',
                email: u.email || '',
                dialCode: u.phone_code || '',
                phoneNumber: u.phone ? String(u.phone) : '',
                permissions: u.permissions?.map((p) => p.name) || [],
            })
        }
    }, [userData, reset])

    const onFormSubmit = async (values: FormSchema) => {
        try {
            const submitData = {
                first_name: values.firstName || '',
                last_name: values.lastName || '',
                email: values.email,
                phone_code: values.dialCode || '',
                phone: values.phoneNumber || '',
                permissions: values.permissions,
            }

            let response;
            if (userId) {
                response = await apiUpdateTeamMember<{ status: boolean; message?: string }, typeof submitData>(userId, submitData)
            } else {
                response = await apiAddTeamMember<{ status: boolean; message?: string }, typeof submitData>(submitData)
            }

            if (!response?.status) {
                throw new Error(response?.message || `Failed to ${userId ? 'update' : 'add'} team member`)
            }

            toast.push(
                <Notification title="Success" type="success">
                    Team member {userId ? 'updated' : 'added'} successfully.
                </Notification>
            )

            router.push('/settings/team-members')
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

    return (
        <AdaptiveCard className="h-full w-full">
            <h3 className="mb-6">{userId ? 'Edit Team Member' : 'Add Team Member'}</h3>
            <Form onSubmit={handleSubmit(onFormSubmit)}>
                <div className="grid md:grid-cols-2 gap-4">
                    <FormItem
                        label="First Name"
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
                        label="Last Name"
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
                                disabled={Boolean(userId)}
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
                        <label className="form-label mb-2">Phone Number</label>
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
                                    value={field.value || ''}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                />
                            )}
                        />
                    </FormItem>
                </div>

                <div className="mb-6">
                    <h4 className="mb-4 flex items-center gap-2">
                        Permissions
                        {errors.permissions && (
                            <span className="text-red-500 text-sm font-normal">
                                {errors.permissions.message}
                            </span>
                        )}
                    </h4>
                    <Controller
                        name="permissions"
                        control={control}
                        render={({ field }) => (
                            <Checkbox.Group
                                value={field.value}
                                onChange={(val) => field.onChange(val as string[])}
                                className="flex flex-col gap-6"
                            >
                                {Object.entries(PERMISSION_GROUPS).map(([groupName, permissions]) => (
                                    <div key={groupName} className="flex flex-col gap-2">
                                        <h5 className="text-base font-semibold">{groupName}</h5>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                            {permissions.map((perm) => (
                                                <Checkbox key={perm.value} value={perm.value}>
                                                    {perm.label}
                                                </Checkbox>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </Checkbox.Group>
                        )}
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <Button 
                        type="button" 
                        onClick={() => router.push('/settings/team-members')}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        type="submit"
                        loading={isSubmitting}
                    >
                        {userId ? 'Save Changes' : 'Add Member'}
                    </Button>
                </div>
            </Form>
        </AdaptiveCard>
    )
}

export default AddTeamMemberForm
