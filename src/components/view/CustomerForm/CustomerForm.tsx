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
import isEmpty from 'lodash/isEmpty'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { ZodType } from 'zod'
import type { CommonProps } from '@/@types/common'
import type { CustomerFormSchema } from './types'
import AdditionalInfo from './AdditionalInfo'

type CustomerFormProps = {
    onFormSubmit: (values: CustomerFormSchema) => void
    defaultValues?: CustomerFormSchema
    newCustomer?: boolean
} & CommonProps

const validationSchema: ZodType<CustomerFormSchema> = z
    .object({
        firstName: z
            .string()
            .optional()
            .refine((value) => !value || /^[A-Za-z\s]+$/.test(value), {
                message: 'First name can contain letters only',
            }),
        lastName: z
            .string()
            .optional()
            .refine((value) => !value || /^[A-Za-z\s]+$/.test(value), {
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
    } = props

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
                                    {navigationList.map((nav) => (
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
                        <div id="identity">
                            <Card>
                                <h4 className="mb-6">Identity</h4>
                                <div className="text-gray-500 min-h-[100px] flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                                    Identity fields will go here
                                </div>
                            </Card>
                        </div>
                        <div id="employment">
                            <Card>
                                <h4 className="mb-6">Employment</h4>
                                <div className="text-gray-500 min-h-[100px] flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                                    Employment fields will go here
                                </div>
                            </Card>
                        </div>
                        <div id="education">
                            <Card>
                                <h4 className="mb-6">Education</h4>
                                <div className="text-gray-500 min-h-[100px] flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                                    Education fields will go here
                                </div>
                            </Card>
                        </div>
                        <AddressSection
                            control={control}
                            errors={errors}
                            setValue={setValue}
                        />
                        <div id="additional-info">
                            <AdditionalInfo
                                control={control}
                                errors={errors}
                                setValue={setValue}
                            />
                        </div>
                        <div id="consent-form">
                            <Card>
                                <h4 className="mb-6">Consent Form</h4>
                                <div className="text-gray-500 min-h-[100px] flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                                    Consent form fields will go here
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </Form>
    )
}

export default CustomerForm
