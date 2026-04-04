'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Drawer from '@/components/ui/Drawer'
import Select from '@/components/ui/Select'
import { Form, FormItem } from '@/components/ui/Form'
import { useTeamListStore } from '../_store/teamListStore'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import { TbFilter } from 'react-icons/tb'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

type FormSchema = {
    status: string
}

type Option = {
    value: string
    label: string
}

const validationSchema = z.object({
    status: z.string(),
})

const statusOptions: Option[] = [
    { value: 'all', label: 'All' },
    { value: '1', label: 'Active' },
    { value: '0', label: 'Inactive' },
]

const TeamListTableFilter = () => {
    const [filterIsOpen, setFilterIsOpen] = useState(false)

    const filterData = useTeamListStore((state) => state.filterData)
    const setFilterData = useTeamListStore((state) => state.setFilterData)

    const { onAppendQueryParams } = useAppendQueryParams()

    const { handleSubmit, control } = useForm<FormSchema>({
        defaultValues: {
            status: filterData.status,
        },
        resolver: zodResolver(validationSchema),
    })

    const onSubmit = (values: FormSchema) => {
        setFilterData({
            ...filterData,
            status: values.status,
        })
        onAppendQueryParams({
            status: values.status,
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
                        <FormItem label="Status">
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <Select<Option>
                                        options={statusOptions}
                                        {...field}
                                        value={statusOptions.find(
                                            (option) => option.value === field.value,
                                        )}
                                        onChange={(option) =>
                                            field.onChange(option?.value)
                                        }
                                    />
                                )}
                            />
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

export default TeamListTableFilter
