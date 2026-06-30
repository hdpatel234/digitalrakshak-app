'use client'

import { useEffect } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import Affix from '@/components/shared/Affix'
import { Link } from 'react-scroll'
import { TbUser, TbPhoneCall, TbFingerprint, TbBriefcase, TbSchool, TbMapPin, TbFileCheck, TbInfoCircle } from 'react-icons/tb'
import useLayoutGap from '@/utils/hooks/useLayoutGap'
import OverviewSection from './OverviewSection'
import AddressSection from './AddressSection'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import isEmpty from 'lodash/isEmpty'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import type { ZodType } from 'zod'
import type { CommonProps } from '@/@types/common'
import type { CustomerFormSchema } from './types'
import AdditionalInfo from './AdditionalInfo'
import DatePicker from '@/components/ui/DatePicker'
import Upload from '@/components/ui/Upload'

export type FieldConfig = {
    id: number
    field_name: string
    field_label: string
    field_type: string
    is_required: number | boolean
    validation_regex?: string
}

type CustomerFormProps = {
    onFormSubmit: (values: CustomerFormSchema) => void
    defaultValues?: CustomerFormSchema
    newCustomer?: boolean
    dynamicFields?: FieldConfig[]
    disableStickyBar?: boolean
} & CommonProps

const validationSchema: ZodType<CustomerFormSchema> = z
    .object({
        firstName: z
            .string()
            .min(1, { message: 'First name is required' })
            .refine((value) => /^[A-Za-z\s]+$/.test(value), {
                message: 'First name can contain letters only',
            }),
        lastName: z
            .string()
            .min(1, { message: 'Last name is required' })
            .refine((value) => /^[A-Za-z\s]+$/.test(value), {
                message: 'Last name can contain letters only',
            }),
        email: z
            .string()
            .min(1, { message: 'Email is required field' })
            .email({ message: 'Invalid email' }),
        dialCode: z.string().optional(),
        phoneNumber: z
            .string()
            .optional()
            .refine((value) => !value || /^\d+$/.test(value), {
                message: 'Phone number must be numeric',
            }),
        country: z.string().optional(),
        state: z.string().optional(),
        city: z.string().optional(),
        address: z.string().optional(),
        postcode: z
            .union([
                z.literal(''),
                z
                    .string()
                    .regex(/^\d+$/, { message: 'Zip code must be numeric' }),
            ])
            .optional(),
        managerEmails: z
            .array(
                z
                    .string()
                    .trim()
                    .email({ message: 'Invalid email' })
                    .or(z.literal('')),
            )
            .optional(),
        img: z.string(),
        tags: z.array(z.object({ value: z.string(), label: z.string() })),
        askConsent: z.boolean().refine(val => val === true, {
            message: 'You must ask for candidate consent',
        }),
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
        },
    )

const navigationList = [
    {
        label: 'Basic Details',
        description: 'First name, last name.',
        link: 'basic-details',
        icon: <TbUser />,
    },
    {
        label: 'Contact Details',
        description: 'Email and phone number.',
        link: 'contact-details',
        icon: <TbPhoneCall />,
    },
    {
        label: 'Identity',
        description: 'Verify identity details.',
        link: 'identity',
        icon: <TbFingerprint />,
    },
    {
        label: 'Employment',
        description: 'Current and past employment.',
        link: 'employment',
        icon: <TbBriefcase />,
    },
    {
        label: 'Education',
        description: 'Academic background.',
        link: 'education',
        icon: <TbSchool />,
    },
    {
        label: 'Address',
        description: 'Current address details.',
        link: 'address',
        icon: <TbMapPin />,
    },
    {
        label: 'Additional Info',
        description: 'Additional information.',
        link: 'additional-info',
        icon: <TbInfoCircle />,
    },
    {
        label: 'Consent Form',
        description: 'Sign and approve terms.',
        link: 'consent-form',
        icon: <TbFileCheck />,
    },
]

const CustomerForm = (props: CustomerFormProps) => {
    const { getTopGapValue } = useLayoutGap()
    const {
        onFormSubmit,
        defaultValues = {},
        children,
        dynamicFields = [],
        disableStickyBar = false,
    } = props

    const availableSections = Array.from(new Set(dynamicFields.map(f => f.section || 'Additional Info')))

    const filteredNavigationList = navigationList.filter(nav => {
        if (nav.label === 'Basic Details' || nav.label === 'Contact Details' || nav.label === 'Consent Form') {
            return true
        }
        return availableSections.includes(nav.label)
    })

    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
        setValue,
    } = useForm<CustomerFormSchema>({
        defaultValues: {
            ...{
                banAccount: false,
                accountVerified: true,
                managerEmails: [''],
            },
            ...defaultValues,
        },
        resolver: zodResolver(validationSchema),
    })

    useEffect(() => {
        if (!isEmpty(defaultValues)) {
            reset(defaultValues)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(defaultValues)])

    const onSubmit = (values: CustomerFormSchema) => {
        onFormSubmit?.(values)
    }

    return (
        <Form
            className="flex w-full h-full"
            containerClassName="flex flex-col w-full justify-between"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Container>
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-[240px] hidden lg:block shrink-0">
                        <Affix offset={getTopGapValue()}>
                            <Card bodyClass="p-3">
                                <div className="flex flex-col gap-1">
                                    {filteredNavigationList.map((nav) => (
                                        <Link
                                            key={nav.label}
                                            activeClass="bg-gray-100 dark:bg-gray-700 active"
                                            className="cursor-pointer px-3 py-2.5 rounded-lg group hover:bg-gray-100 dark:hover:bg-gray-700"
                                            to={nav.link}
                                            spy={true}
                                            smooth={true}
                                            duration={500}
                                            offset={-80}
                                        >
                                            <span className="flex items-center gap-3">
                                                <Avatar
                                                    size={32}
                                                    icon={nav.icon}
                                                    className="bg-gray-100 dark:bg-gray-700 group-hover:bg-white group-[.active]:bg-white dark:group-hover:bg-gray-800 dark:group-[.active]:bg-gray-800 text-gray-900 dark:text-gray-100"
                                                />
                                                <span className="heading-text font-semibold text-sm">
                                                    {nav.label}
                                                </span>
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </Card>
                        </Affix>
                    </div>
                    <div className="gap-4 flex flex-col flex-auto min-w-0">
                        <OverviewSection
                            control={control}
                            errors={errors}
                            setValue={setValue}
                        />

                        {availableSections.includes('Identity') && (
                            <div id="identity">
                                <Card>
                                    <h4 className="mb-2">Identity</h4>
                                    <p className="text-sm text-gray-500 mb-6">These details can be skipped and filled by the candidate via email, or you can fill them now.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {dynamicFields.filter(f => f.section === 'Identity').map((field) => (
                                            <FormItem
                                                key={field.id}
                                                label={field.field_label}
                                                asterisk={!!field.is_required}
                                                invalid={Boolean(errors[field.field_name as keyof CustomerFormSchema])}
                                                errorMessage={errors[field.field_name as keyof CustomerFormSchema]?.message as string}
                                            >
                                                {field.field_type === 'date' ? (
                                                    <Controller
                                                        name={field.field_name as any}
                                                        control={control}
                                                        render={({ field: { value, onChange } }) => (
                                                            <DatePicker
                                                                value={value ? new Date(value as string) : null}
                                                                onChange={(date) => {
                                                                    onChange(date ? date.toISOString().split('T')[0] : '')
                                                                }}
                                                                placeholder={`Select ${field.field_label}`}
                                                            />
                                                        )}
                                                    />
                                                ) : field.field_type === 'file' ? (
                                                    <Controller
                                                        name={field.field_name as any}
                                                        control={control}
                                                        render={({ field: { onChange, value } }) => (
                                                            <Upload
                                                                draggable
                                                                uploadLimit={1}
                                                                onChange={(files) => onChange(files[0] || null)}
                                                                fileList={value ? [value as any] : []}
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
                                                        {...control.register(field.field_name as any)}
                                                    />
                                                )}
                                            </FormItem>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                        )}

                        {availableSections.includes('Employment') && (
                            <div id="employment">
                                <Card>
                                    <h4 className="mb-2">Employment</h4>
                                    <p className="text-sm text-gray-500 mb-6">These details can be skipped and filled by the candidate via email, or you can fill them now.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {dynamicFields.filter(f => f.section === 'Employment').map((field) => (
                                            <FormItem
                                                key={field.id}
                                                label={field.field_label}
                                                asterisk={!!field.is_required}
                                                invalid={Boolean(errors[field.field_name as keyof CustomerFormSchema])}
                                                errorMessage={errors[field.field_name as keyof CustomerFormSchema]?.message as string}
                                            >
                                                {field.field_type === 'date' ? (
                                                    <Controller
                                                        name={field.field_name as any}
                                                        control={control}
                                                        render={({ field: { value, onChange } }) => (
                                                            <DatePicker
                                                                value={value ? new Date(value as string) : null}
                                                                onChange={(date) => {
                                                                    onChange(date ? date.toISOString().split('T')[0] : '')
                                                                }}
                                                                placeholder={`Select ${field.field_label}`}
                                                            />
                                                        )}
                                                    />
                                                ) : field.field_type === 'file' ? (
                                                    <Controller
                                                        name={field.field_name as any}
                                                        control={control}
                                                        render={({ field: { onChange, value } }) => (
                                                            <Upload
                                                                draggable
                                                                uploadLimit={1}
                                                                onChange={(files) => onChange(files[0] || null)}
                                                                fileList={value ? [value as any] : []}
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
                                                        {...control.register(field.field_name as any)}
                                                    />
                                                )}
                                            </FormItem>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                        )}

                        {availableSections.includes('Education') && (
                            <div id="education">
                                <Card>
                                    <h4 className="mb-2">Education</h4>
                                    <p className="text-sm text-gray-500 mb-6">These details can be skipped and filled by the candidate via email, or you can fill them now.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {dynamicFields.filter(f => f.section === 'Education').map((field) => (
                                            <FormItem
                                                key={field.id}
                                                label={field.field_label}
                                                asterisk={!!field.is_required}
                                                invalid={Boolean(errors[field.field_name as keyof CustomerFormSchema])}
                                                errorMessage={errors[field.field_name as keyof CustomerFormSchema]?.message as string}
                                            >
                                                {field.field_type === 'date' ? (
                                                    <Controller
                                                        name={field.field_name as any}
                                                        control={control}
                                                        render={({ field: { value, onChange } }) => (
                                                            <DatePicker
                                                                value={value ? new Date(value as string) : null}
                                                                onChange={(date) => {
                                                                    onChange(date ? date.toISOString().split('T')[0] : '')
                                                                }}
                                                                placeholder={`Select ${field.field_label}`}
                                                            />
                                                        )}
                                                    />
                                                ) : field.field_type === 'file' ? (
                                                    <Controller
                                                        name={field.field_name as any}
                                                        control={control}
                                                        render={({ field: { onChange, value } }) => (
                                                            <Upload
                                                                draggable
                                                                uploadLimit={1}
                                                                onChange={(files) => onChange(files[0] || null)}
                                                                fileList={value ? [value as any] : []}
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
                                                        {...control.register(field.field_name as any)}
                                                    />
                                                )}
                                            </FormItem>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                        )}

                        {availableSections.includes('Address') && (
                            <AddressSection
                                control={control}
                                errors={errors}
                                setValue={setValue}
                            />
                        )}

                        {availableSections.includes('Additional Info') && (
                            <div id="additional-info">
                                <AdditionalInfo
                                    control={control}
                                    errors={errors}
                                    setValue={setValue}
                                />
                                <Card className="mt-4">
                                    <p className="text-sm text-gray-500 mb-4">These additional details can be skipped and filled by the candidate via email, or you can fill them now.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {dynamicFields.filter(f => (f.section || 'Additional Info') === 'Additional Info').map((field) => (
                                            <FormItem
                                                key={field.id}
                                                label={field.field_label}
                                                asterisk={!!field.is_required}
                                                invalid={Boolean(errors[field.field_name as keyof CustomerFormSchema])}
                                                errorMessage={errors[field.field_name as keyof CustomerFormSchema]?.message as string}
                                            >
                                                {field.field_type === 'date' ? (
                                                    <Controller
                                                        name={field.field_name as any}
                                                        control={control}
                                                        render={({ field: { value, onChange } }) => (
                                                            <DatePicker
                                                                value={value ? new Date(value as string) : null}
                                                                onChange={(date) => {
                                                                    onChange(date ? date.toISOString().split('T')[0] : '')
                                                                }}
                                                                placeholder={`Select ${field.field_label}`}
                                                            />
                                                        )}
                                                    />
                                                ) : field.field_type === 'file' ? (
                                                    <Controller
                                                        name={field.field_name as any}
                                                        control={control}
                                                        render={({ field: { onChange, value } }) => (
                                                            <Upload
                                                                draggable
                                                                uploadLimit={1}
                                                                onChange={(files) => onChange(files[0] || null)}
                                                                fileList={value ? [value as any] : []}
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
                                                        {...control.register(field.field_name as any)}
                                                    />
                                                )}
                                            </FormItem>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                        )}

                        <div id="consent-form">
                            <Card>
                                <h4 className="mb-2">Consent Form</h4>
                                <p className="text-sm text-gray-500 mb-6">A mail will be sent to the candidate to take consent.</p>
                                
                                <FormItem
                                    invalid={Boolean(errors.askConsent)}
                                    errorMessage={errors.askConsent?.message as string}
                                >
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            className="checkbox"
                                            id="askConsent"
                                            {...control.register('askConsent')}
                                        />
                                        <label htmlFor="askConsent" className="font-semibold text-sm cursor-pointer">
                                            Ask candidate for consent <span className="text-red-500">*</span>
                                        </label>
                                    </div>
                                </FormItem>

                                {dynamicFields.filter(f => f.section === 'Consent Form').length > 0 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 border-t pt-4">
                                        {dynamicFields.filter(f => f.section === 'Consent Form').map((field) => (
                                            <FormItem
                                                key={field.id}
                                                label={field.field_label}
                                                asterisk={!!field.is_required}
                                                invalid={Boolean(errors[field.field_name as keyof CustomerFormSchema])}
                                                errorMessage={errors[field.field_name as keyof CustomerFormSchema]?.message as string}
                                            >
                                                {field.field_type === 'date' ? (
                                                    <Controller
                                                        name={field.field_name as any}
                                                        control={control}
                                                        render={({ field: { value, onChange } }) => (
                                                            <DatePicker
                                                                value={value ? new Date(value as string) : null}
                                                                onChange={(date) => {
                                                                    onChange(date ? date.toISOString().split('T')[0] : '')
                                                                }}
                                                                placeholder={`Select ${field.field_label}`}
                                                            />
                                                        )}
                                                    />
                                                ) : field.field_type === 'file' ? (
                                                    <Controller
                                                        name={field.field_name as any}
                                                        control={control}
                                                        render={({ field: { onChange, value } }) => (
                                                            <Upload
                                                                draggable
                                                                uploadLimit={1}
                                                                onChange={(files) => onChange(files[0] || null)}
                                                                fileList={value ? [value as any] : []}
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
                                                        {...control.register(field.field_name as any)}
                                                    />
                                                )}
                                            </FormItem>
                                        ))}
                                    </div>
                                )}
                            </Card>
                        </div>
                    </div>
                </div>
            </Container>
            {disableStickyBar ? (
                <div className="mt-4 flex w-full max-w-4xl mx-auto px-4 justify-center">{children}</div>
            ) : (
                <BottomStickyBar>{children}</BottomStickyBar>
            )}
        </Form>
    )
}

export default CustomerForm
