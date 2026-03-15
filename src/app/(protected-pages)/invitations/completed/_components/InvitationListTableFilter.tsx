'use client'

import { useMemo, useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { Form, FormItem } from '@/components/ui/Form'
import { useInvitationListStore } from '../_store/invitationListStore'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import { TbFilter } from 'react-icons/tb'

type Option = {
    value: string
    label: string
}

type LocalFilterState = {
    invitation_type: string
    date_from: string
    date_to: string
}

const invitationTypeOptions: Option[] = [
    { value: '', label: 'All Types' },
    { value: 'email', label: 'Email' },
    { value: 'sms', label: 'SMS' },
    { value: 'whatsapp', label: 'WhatsApp' },
]

const InvitationListTableFilter = () => {
    const [dialogIsOpen, setIsOpen] = useState(false)
    const filterData = useInvitationListStore((state) => state.filterData)
    const { onAppendQueryParams } = useAppendQueryParams()

    const [localFilters, setLocalFilters] = useState<LocalFilterState>({
        invitation_type: filterData.invitation_type,
        date_from: filterData.date_from,
        date_to: filterData.date_to,
    })

    const invitationTypeValue = useMemo(
        () =>
            invitationTypeOptions.find(
                (option) => option.value === localFilters.invitation_type,
            ),
        [localFilters.invitation_type],
    )

    const openDialog = () => {
        setLocalFilters({
            invitation_type: filterData.invitation_type,
            date_from: filterData.date_from,
            date_to: filterData.date_to,
        })
        setIsOpen(true)
    }

    const onDialogClose = () => {
        setIsOpen(false)
    }

    const onApply = () => {
        onAppendQueryParams({
            invitation_type: localFilters.invitation_type,
            date_from: localFilters.date_from,
            date_to: localFilters.date_to,
            page: '1',
        })
        setIsOpen(false)
    }

    const onReset = () => {
        setLocalFilters({
            invitation_type: '',
            date_from: '',
            date_to: '',
        })
        onAppendQueryParams({
            invitation_type: '',
            date_from: '',
            date_to: '',
            page: '1',
        })
        setIsOpen(false)
    }

    return (
        <>
            <Button icon={<TbFilter />} onClick={openDialog}>
                Filter
            </Button>
            <Dialog
                isOpen={dialogIsOpen}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
            >
                <h4 className="mb-4">Filter Invitations</h4>
                <Form>
                    <FormItem label="Invitation Type">
                        <Select<Option, false>
                            value={invitationTypeValue || invitationTypeOptions[0]}
                            options={invitationTypeOptions}
                            onChange={(option) =>
                                setLocalFilters((prev) => ({
                                    ...prev,
                                    invitation_type: option?.value || '',
                                }))
                            }
                        />
                    </FormItem>
                    <FormItem label="Date From">
                        <Input
                            type="date"
                            value={localFilters.date_from}
                            onChange={(event) =>
                                setLocalFilters((prev) => ({
                                    ...prev,
                                    date_from: event.target.value,
                                }))
                            }
                        />
                    </FormItem>
                    <FormItem label="Date To">
                        <Input
                            type="date"
                            value={localFilters.date_to}
                            onChange={(event) =>
                                setLocalFilters((prev) => ({
                                    ...prev,
                                    date_to: event.target.value,
                                }))
                            }
                        />
                    </FormItem>
                    <div className="mt-4 flex items-center justify-end gap-2">
                        <Button type="button" onClick={onReset}>
                            Reset
                        </Button>
                        <Button type="button" variant="solid" onClick={onApply}>
                            Apply
                        </Button>
                    </div>
                </Form>
            </Dialog>
        </>
    )
}

export default InvitationListTableFilter
