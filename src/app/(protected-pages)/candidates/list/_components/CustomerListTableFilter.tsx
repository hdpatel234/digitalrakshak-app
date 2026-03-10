'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { Form, FormItem } from '@/components/ui/Form'
import { useCustomerListStore } from '../_store/customerListStore'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import { TbFilter } from 'react-icons/tb'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'
import Select from '@/components/ui/Select'
import type { StatusOption } from '../types'

type FormSchema = {
    status: string
}

type CustomerListTableFilterProps = {
    statusOptions: StatusOption[]
    selectedStatus: string
}

const validationSchema: ZodType<FormSchema> = z.object({
    status: z.string(),
})

const CustomerListTableFilter = ({
    statusOptions,
    selectedStatus,
}: CustomerListTableFilterProps) => {
    const [dialogIsOpen, setIsOpen] = useState(false)

    const filterData = useCustomerListStore((state) => state.filterData)
    const setFilterData = useCustomerListStore((state) => state.setFilterData)

    const { onAppendQueryParams } = useAppendQueryParams()

    const openDialog = () => {
        setIsOpen(true)
    }

    const onDialogClose = () => {
        setIsOpen(false)
    }

    const selectOptions = statusOptions.map((option) => ({
        value: option.key,
        label: option.name,
    }))

    const { handleSubmit, reset, control } = useForm<FormSchema>({
        defaultValues: { status: selectedStatus || filterData.status || '' },
        resolver: zodResolver(validationSchema),
    })

    useEffect(() => {
        reset({ status: selectedStatus || '' })
    }, [reset, selectedStatus])

    const onSubmit = (values: FormSchema) => {
        onAppendQueryParams({
            status: values.status,
            pageIndex: '1',
        })

        setFilterData(values)
        setIsOpen(false)
    }

    const handleReset = () => {
        const values = { status: '' }
        reset(values)
        setFilterData(values)
        onAppendQueryParams({
            status: '',
            pageIndex: '1',
        })
        setIsOpen(false)
    }

    return (
        <>
            <Button icon={<TbFilter />} onClick={() => openDialog()}>
                Filter
            </Button>
            <Dialog
                isOpen={dialogIsOpen}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
            >
                <h4 className="mb-4">Filter</h4>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <FormItem label="Status">
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    isClearable
                                    options={selectOptions}
                                    value={selectOptions.find(
                                        (option) => option.value === field.value,
                                    )}
                                    onChange={(option) =>
                                        field.onChange(option?.value || '')
                                    }
                                />
                            )}
                        />
                    </FormItem>
                    <div className="flex justify-end items-center gap-2 mt-4">
                        <Button type="button" onClick={handleReset}>
                            Reset
                        </Button>
                        <Button type="submit" variant="solid">
                            Apply
                        </Button>
                    </div>
                </Form>
            </Dialog>
        </>
    )
}

export default CustomerListTableFilter
