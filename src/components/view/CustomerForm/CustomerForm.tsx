'use client'

import { useEffect } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
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

const CustomerForm = (props: CustomerFormProps) => {
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
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="gap-4 flex flex-col flex-auto">
                        <OverviewSection
                            control={control}
                            errors={errors}
                            setValue={setValue}
                        />
                        <AddressSection
                            control={control}
                            errors={errors}
                            setValue={setValue}
                        />
                        <AdditionalInfo
                            control={control}
                            errors={errors}
                            setValue={setValue}
                        />
                    </div>
                </div>
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </Form>
    )
}

export default CustomerForm
