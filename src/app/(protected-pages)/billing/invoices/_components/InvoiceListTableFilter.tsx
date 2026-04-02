'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import DatePicker from '@/components/ui/DatePicker'
import Drawer from '@/components/ui/Drawer'
import Badge from '@/components/ui/Badge'
import Select, { Option as DefaultOption } from '@/components/ui/Select'
import { components } from 'react-select'
import { Form, FormItem } from '@/components/ui/Form'
import { useInvoiceListStore } from '../_store/invoiceListStore'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import { TbFilter } from 'react-icons/tb'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'
import type { ControlProps, OptionProps } from 'react-select'
import classNames from '@/utils/classNames'
import dayjs from 'dayjs'

type FormSchema = {
    date: [Date, Date]
    status: string
}

type Option = {
    value: string
    label: string
    className: string
}

const { Control } = components

const defaultStatusOptions: Option[] = [
    { value: 'all', label: 'All', className: 'bg-gray-400' },
]

const statusClassMap: Record<string, string> = {
    draft: 'bg-gray-400',
    sent: 'bg-blue-500',
    viewed: 'bg-indigo-500',
    paid: 'bg-emerald-500',
    overdue: 'bg-amber-500',
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
            className: statusClassMap[value.toLowerCase()] || 'bg-gray-400',
        }
    })

    return [
        { value: 'all', label: 'All', className: 'bg-gray-400' },
        ...normalized,
    ]
}

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
})

const InvoiceListTableFilter = () => {
    const [filterIsOpen, setFilterIsOpen] = useState(false)

    const filterData = useInvoiceListStore((state) => state.filterData)
    const setFilterData = useInvoiceListStore((state) => state.setFilterData)
    const statusOptions = useInvoiceListStore((state) => state.statusOptions)

    const resolvedStatusOptions = mapStatusOptions(statusOptions)

    const { onAppendQueryParams } = useAppendQueryParams()

    const { handleSubmit, control } = useForm<FormSchema>({
        defaultValues: filterData,
        resolver: zodResolver(validationSchema),
    })

    const onSubmit = (values: FormSchema) => {
        setFilterData(values)
        onAppendQueryParams({
            date_from: values.date && values.date[0] ? dayjs(values.date[0]).format('YYYY-MM-DD') : '',
            date_to: values.date && values.date[1] ? dayjs(values.date[1]).format('YYYY-MM-DD') : '',
            status: values.status,
            pageIndex: '1',
        })
        setFilterIsOpen(false)
    }

    return (
        <>
            <Button icon={<TbFilter />} onClick={() => setFilterIsOpen(true)}>
                Filter
            </Button>
            <Drawer
                title="Filter Invoices"
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
                        <FormItem label="Invoice Date">
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
                        <FormItem label="Invoice Status">
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
                    </div>
                    <Button variant="solid" type="submit">
                        Apply Filter
                    </Button>
                </Form>
            </Drawer>
        </>
    )
}

export default InvoiceListTableFilter
