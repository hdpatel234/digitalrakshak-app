'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Drawer from '@/components/ui/Drawer'
import Select from '@/components/ui/Select'
import { Form, FormItem } from '@/components/ui/Form'
import { useTicketListStore } from '../_store/ticketListStore'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import { TbFilter } from 'react-icons/tb'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

type FormSchema = {
    status: string
    department: string
    priority: string
}

type Option = {
    value: string
    label: string
}

const validationSchema = z.object({
    status: z.string(),
    department: z.string(),
    priority: z.string(),
})

const TicketListTableFilter = () => {
    const [filterIsOpen, setFilterIsOpen] = useState(false)

    const filterData = useTicketListStore((state) => state.filterData)
    const setFilterData = useTicketListStore((state) => state.setFilterData)
    const statusOptions = useTicketListStore((state) => state.statusOptions)
    const departmentOptions = useTicketListStore((state) => state.departmentOptions)
    const priorityOptions = useTicketListStore((state) => state.priorityOptions)

    const resolvedStatusOptions: Option[] = [
        { value: 'all', label: 'All' },
        ...statusOptions.map((opt) => ({ value: opt.key, label: opt.name })),
    ]

    const resolvedDepartmentOptions: Option[] = [
        { value: 'all', label: 'All' },
        ...departmentOptions.map((opt) => ({ value: String(opt.id), label: opt.name })),
    ]

    const resolvedPriorityOptions: Option[] = [
        { value: 'all', label: 'All' },
        ...priorityOptions.map((opt) => ({ value: String(opt.id), label: opt.name })),
    ]

    const { onAppendQueryParams } = useAppendQueryParams()

    const { handleSubmit, control } = useForm<FormSchema>({
        defaultValues: filterData,
        resolver: zodResolver(validationSchema),
    })

    const onSubmit = (values: FormSchema) => {
        setFilterData(values)
        onAppendQueryParams({
            status: values.status,
            department: values.department,
            priority: values.priority,
        })
        setFilterIsOpen(false)
    }

    return (
        <>
            <Button icon={<TbFilter />} onClick={() => setFilterIsOpen(true)}>
                Filter
            </Button>
            <Drawer
                title="Filter Tickets"
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
                        <FormItem label="Status">
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <Select<Option>
                                        options={resolvedStatusOptions}
                                        {...field}
                                        value={resolvedStatusOptions.find(
                                            (option) => option.value === field.value,
                                        )}
                                        onChange={(option) => field.onChange(option?.value)}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem label="Department">
                            <Controller
                                name="department"
                                control={control}
                                render={({ field }) => (
                                    <Select<Option>
                                        options={resolvedDepartmentOptions}
                                        {...field}
                                        value={resolvedDepartmentOptions.find(
                                            (option) => option.value === field.value,
                                        )}
                                        onChange={(option) => field.onChange(option?.value)}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem label="Priority">
                            <Controller
                                name="priority"
                                control={control}
                                render={({ field }) => (
                                    <Select<Option>
                                        options={resolvedPriorityOptions}
                                        {...field}
                                        value={resolvedPriorityOptions.find(
                                            (option) => option.value === field.value,
                                        )}
                                        onChange={(option) => field.onChange(option?.value)}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>
                    <Button variant="solid" type="submit">
                        Apply Filters
                    </Button>
                </Form>
            </Drawer>
        </>
    )
}

export default TicketListTableFilter
