'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import DatePicker from '@/components/ui/DatePicker'
import Drawer from '@/components/ui/Drawer'
import Checkbox from '@/components/ui/Checkbox'
import Badge from '@/components/ui/Badge'
import Select, { Option as DefaultOption } from '@/components/ui/Select'
import { components } from 'react-select'
import { Form, FormItem } from '@/components/ui/Form'
import { useOrderListStore } from '../_store/orderListStore'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import { TbFilter } from 'react-icons/tb'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'
import type { ControlProps, OptionProps } from 'react-select'
import classNames from '@/utils/classNames'

type FormSchema = {
    date: [Date, Date]
    status: string
    paymentMethod: Array<string>
}

type Option = {
    value: string
    label: string
    className: string
}

const { Control } = components

const defaultStatusOptions: Option[] = [
    { value: 'all', label: 'All', className: 'bg-gray-400' },
    { value: 'paid', label: 'Paid', className: 'bg-emerald-500' },
    { value: 'failed', label: 'Failed', className: 'bg-red-500' },
    { value: 'pending', label: 'Pending', className: 'bg-amber-500' },
]

const statusClassMap: Record<string, string> = {
    draft: 'bg-gray-400',
    pending: 'bg-amber-500',
    confirmed: 'bg-blue-500',
    processing: 'bg-indigo-500',
    completed: 'bg-emerald-500',
    cancelled: 'bg-red-500',
}

const mapStatusOptions = (options: Array<{ key: string; name: string }>) => {
    if (!options.length) {
        return defaultStatusOptions
    }

    const normalized = options.map((option) => {
        const value = option.key.trim()
        return {
            value,
            label: option.name.trim() || value,
            className:
                statusClassMap[value.toLowerCase()] || 'bg-gray-400',
        }
    })

    return [
        { value: 'all', label: 'All', className: 'bg-gray-400' },
        ...normalized,
    ]
}

const paymentMethodList = [
    'Credit card',
    'Debit card',
    'Paypal',
    'Stripe',
    'Cash',
]

const CustomSelectOption = (props: OptionProps<Option>) => {
    return (
        <DefaultOption<Option>
            {...props}
            customLabel={(data, label) => (
                <span className="flex items-center gap-2">
                    <Badge className={data.className} />
                    <span className="ml-2 rtl:mr-2">{label}</span>
                </span>
            )}
        />
    )
}

const CustomControl = ({ children, ...props }: ControlProps<Option>) => {
    const selected = props.getValue()[0]
    return (
        <Control {...props}>
            {selected && (
                <Badge className={classNames('ml-4', selected.className)} />
            )}
            {children}
        </Control>
    )
}

const validationSchema: ZodType<FormSchema> = z.object({
    date: z.tuple([z.date(), z.date()]),
    status: z.string(),
    paymentMethod: z.array(z.string()),
})

const OrderListTableFilter = () => {
    const [filterIsOpen, setFilterIsOpen] = useState(false)

    const filterData = useOrderListStore((state) => state.filterData)
    const setFilterData = useOrderListStore((state) => state.setFilterData)
    const statusOptions = useOrderListStore((state) => state.statusOptions)
    const paymentMethodOptions = useOrderListStore(
        (state) => state.paymentMethodOptions,
    )

    const resolvedStatusOptions = mapStatusOptions(statusOptions)

    const { onAppendQueryParams } = useAppendQueryParams()

    const { handleSubmit, control } = useForm<FormSchema>({
        defaultValues: filterData,
        resolver: zodResolver(validationSchema),
    })

    const onSubmit = (values: FormSchema) => {
        setFilterData(values)
        onAppendQueryParams({
            minDate: values.date.toString(),
            maxDate: values.date.toString(),
            status: values.status,
            payment_method_id: values.paymentMethod.toString(),
        })
        setFilterIsOpen(false)
    }

    return (
        <>
            <Button icon={<TbFilter />} onClick={() => setFilterIsOpen(true)}>
                Filter
            </Button>
            <Drawer
                title="Filter"
                isOpen={filterIsOpen}
                onClose={() => setFilterIsOpen(false)}
                onRequestClose={() => setFilterIsOpen(false)}
            >
                <Form
                    className="h-full"
                    containerClassName="flex flex-col justify-between h-full"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div>
                        <FormItem label="Product price">
                            <div className="flex items-center gap-2">
                                <Controller
                                    name="date"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker.DatePickerRange
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </div>
                        </FormItem>
                        <FormItem label="Product status">
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <Select<Option>
                                        instanceId="status"
                                        options={resolvedStatusOptions}
                                        {...field}
                                        value={resolvedStatusOptions.filter(
                                            (option) =>
                                                option.value === field.value,
                                        )}
                                        components={{
                                            Option: CustomSelectOption,
                                            Control: CustomControl,
                                        }}
                                        onChange={(option) =>
                                            field.onChange(option?.value)
                                        }
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem label="Product type">
                            <div className="mt-4">
                                <Controller
                                    name="paymentMethod"
                                    control={control}
                                    render={({ field }) => (
                                        <Checkbox.Group
                                            vertical
                                            className="flex"
                                            {...field}
                                        >
                                            {(paymentMethodOptions.length
                                                ? paymentMethodOptions
                                                : paymentMethodList.map(
                                                      (type, index) => ({
                                                          id: String(
                                                              type + index,
                                                          ),
                                                          name: type,
                                                      }),
                                                  )
                                            ).map((method) => (
                                                    <Checkbox
                                                        key={method.id}
                                                        name={field.name}
                                                        value={method.id}
                                                        className="justify-between flex-row-reverse heading-text"
                                                    >
                                                        {method.name}
                                                    </Checkbox>
                                                ))}
                                        </Checkbox.Group>
                                    )}
                                />
                            </div>
                        </FormItem>
                    </div>
                    <Button variant="solid" type="submit">
                        Filter
                    </Button>
                </Form>
            </Drawer>
        </>
    )
}

export default OrderListTableFilter
