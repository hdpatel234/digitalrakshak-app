'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Checkbox from '@/components/ui/Checkbox'
import Input from '@/components/ui/Input'
import { Form, FormItem } from '@/components/ui/Form'
import { useInvitationListStore } from '../_store/invitationListStore'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import { TbFilter } from 'react-icons/tb'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import useTranslation from '@/utils/hooks/useTranslation'
import type { ZodType } from 'zod'

type FormSchema = {
    invitationStatus: Array<string>
    country: string
    state: string
    city: string
}

const invitationStatusList = ['sent', 'viewed', 'expired']

const validationSchema: ZodType<FormSchema> = z.object({
    invitationStatus: z.array(z.string()),
    country: z.string(),
    state: z.string(),
    city: z.string(),
})

const InvitationListTableFilter = () => {
    const t = useTranslation('invitations')
    const [dialogIsOpen, setIsOpen] = useState(false)

    const filterData = useInvitationListStore((state) => state.filterData)
    const setFilterData = useInvitationListStore((state) => state.setFilterData)

    const { onAppendQueryParams } = useAppendQueryParams()

    const openDialog = () => {
        setIsOpen(true)
    }

    const onDialogClose = () => {
        setIsOpen(false)
    }

    const { handleSubmit, reset, control } = useForm<FormSchema>({
        defaultValues: filterData,
        resolver: zodResolver(validationSchema),
    })

    const onSubmit = (values: FormSchema) => {
        onAppendQueryParams({
            status: values.invitationStatus.join(','),
            country: values.country,
            state: values.state,
            city: values.city,
        })

        setFilterData(values)
        setIsOpen(false)
    }

    return (
        <>
            <Button icon={<TbFilter />} onClick={() => openDialog()}>
                {t('filter.button')}
            </Button>
            <Dialog
                isOpen={dialogIsOpen}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
            >
                <h4 className="mb-4">{t('filter.title')}</h4>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <FormItem label={t('filter.fields.invitationStatus')}>
                        <Controller
                            name="invitationStatus"
                            control={control}
                            render={({ field }) => (
                                <Checkbox.Group
                                    vertical
                                    className="flex mt-4"
                                    {...field}
                                >
                                    {invitationStatusList.map((status) => (
                                        <Checkbox
                                            key={status}
                                            name={field.name}
                                            value={status}
                                            className="justify-between flex-row-reverse heading-text capitalize"
                                        >
                                            {t(`status.${status}`)}
                                        </Checkbox>
                                    ))}
                                </Checkbox.Group>
                            )}
                        />
                    </FormItem>
                    <FormItem label={t('filter.fields.country')}>
                        <Controller
                            name="country"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    autoComplete="off"
                                    placeholder={t('filter.placeholders.country')}
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem label={t('filter.fields.state')}>
                        <Controller
                            name="state"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    autoComplete="off"
                                    placeholder={t('filter.placeholders.state')}
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem label={t('filter.fields.city')}>
                        <Controller
                            name="city"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    autoComplete="off"
                                    placeholder={t('filter.placeholders.city')}
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <div className="flex justify-end items-center gap-2 mt-4">
                        <Button type="button" onClick={() => reset()}>
                            {t('common.reset')}
                        </Button>
                        <Button type="submit" variant="solid">
                            {t('common.apply')}
                        </Button>
                    </div>
                </Form>
            </Dialog>
        </>
    )
}

export default InvitationListTableFilter

