'use client'

import { useMemo, useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Input from '@/components/ui/Input'
import Upload from '@/components/ui/Upload'
import Checkbox from '@/components/ui/Checkbox'
import Tabs from '@/components/ui/Tabs'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { Form, FormItem } from '@/components/ui/Form'
import { TbCloudDownload, TbUserPlus } from 'react-icons/tb'
import { useInvitationListStore } from '../_store/invitationListStore'
import dynamic from 'next/dynamic'
import { csvParse } from 'd3-dsv'
import useTranslation from '@/utils/hooks/useTranslation'
import type { Customer } from '../types'

const CSVLink = dynamic(() =>
    import('react-csv').then((mod) => mod.CSVLink), {
        ssr: false,
    }
)

const { TabNav, TabList, TabContent } = Tabs

type AddMode = 'manual' | 'import'

type ManualForm = {
    firstName: string
    lastName: string
    email: string
    managerEmails: string
    address: string
    country: string
    state: string
    city: string
    pinCode: string
}

const defaultManualForm: ManualForm = {
    firstName: '',
    lastName: '',
    email: '',
    managerEmails: '',
    address: '',
    country: '',
    state: '',
    city: '',
    pinCode: '',
}

const allowedStatus = new Set(['sent', 'viewed', 'expired'])

const InvitationListActionTools = () => {
    const t = useTranslation('invitations')
    const [dialogOpen, setDialogOpen] = useState(false)
    const [mode, setMode] = useState<AddMode>('manual')
    const [manualForm, setManualForm] = useState<ManualForm>(defaultManualForm)
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
    const [notifyOnImport, setNotifyOnImport] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const customerList = useInvitationListStore((state) => state.customerList)
    const setCustomerList = useInvitationListStore(
        (state) => state.setCustomerList,
    )

    const csvDownloadData = useMemo(() => customerList, [customerList])

    const parseEmails = (value: string) =>
        value
            .split(/[,\n;]/)
            .map((item) => item.trim().toLowerCase())
            .filter((item) => item.length > 0)

    const makeInvitation = ({
        firstName,
        lastName,
        email,
        address,
        country,
        state,
        city,
        pinCode,
        status,
    }: {
        firstName: string
        lastName: string
        email: string
        address: string
        country: string
        state: string
        city: string
        pinCode: string
        status?: string
    }): Customer => {
        const normalizedStatus = (status || 'sent').toLowerCase()
        const invitationStatus = allowedStatus.has(normalizedStatus)
            ? normalizedStatus
            : 'sent'

        return {
            id: `INV-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
            name: `${firstName} ${lastName}`.trim(),
            email,
            status: invitationStatus,
            personalInfo: {
                address,
                country,
                state,
                city,
                pinCode,
            },
        }
    }

    const closeDialog = () => {
        setDialogOpen(false)
        setMode('manual')
        setManualForm(defaultManualForm)
        setUploadedFiles([])
        setNotifyOnImport(false)
        setIsSaving(false)
    }

    const handleManualInputChange =
        (field: keyof ManualForm) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setManualForm((prev) => ({
                ...prev,
                [field]: e.target.value,
            }))
        }

    const handleManualSave = () => {
        const firstName = manualForm.firstName.trim()
        const lastName = manualForm.lastName.trim()
        const baseEmails = parseEmails(manualForm.email)
        const extraEmails = parseEmails(manualForm.managerEmails)
        const allEmails = Array.from(new Set([...baseEmails, ...extraEmails]))

        if (!firstName || !lastName || allEmails.length === 0) {
            toast.push(
                <Notification type="danger">
                    {t('actions.validation.manualRequired')}
                </Notification>,
                { placement: 'top-center' },
            )
            return
        }

        const records = allEmails.map((email) =>
            makeInvitation({
                firstName,
                lastName,
                email,
                address: manualForm.address.trim(),
                country: manualForm.country.trim(),
                state: manualForm.state.trim(),
                city: manualForm.city.trim(),
                pinCode: manualForm.pinCode.trim(),
            }),
        )

        setCustomerList([...records, ...customerList])
        toast.push(
            <Notification type="success">
                {t('actions.toast.created', {
                    count: records.length,
                })}
            </Notification>,
            { placement: 'top-center' },
        )
        closeDialog()
    }

    const beforeUpload = (files: FileList | null) => {
        if (!files || files.length === 0) {
            return t('actions.validation.chooseFile')
        }

        const file = files[0]
        const isCsv = file.name.toLowerCase().endsWith('.csv')
        if (!isCsv) {
            return t('actions.validation.csvOnly')
        }

        return true
    }

    const getCsvField = (
        row: Record<string, string>,
        keys: string[],
    ): string => {
        const normalizedKeyMap = Object.keys(row).reduce(
            (acc, key) => {
                const normalized = key
                    .trim()
                    .toLowerCase()
                    .replace(/\s+/g, '')
                    .replace(/_/g, '')
                acc[normalized] = row[key]
                return acc
            },
            {} as Record<string, string>,
        )

        for (const key of keys) {
            const value = normalizedKeyMap[key]
            if (typeof value === 'string' && value.trim().length > 0) {
                return value.trim()
            }
        }

        return ''
    }

    const parseImportedFile = async (file: File): Promise<Customer[]> => {
        const content = await file.text()
        const rows = csvParse(content)
        const records: Customer[] = []

        rows.forEach((row) => {
            const firstName = getCsvField(row, ['firstname', 'fname'])
            const lastName = getCsvField(row, ['lastname', 'lname'])
            const primaryEmail = getCsvField(row, ['email'])
            const managerEmails = getCsvField(row, [
                'manageremails',
                'managedemails',
                'additionalemails',
            ])

            const combinedEmails = Array.from(
                new Set(parseEmails([primaryEmail, managerEmails].join(','))),
            )

            if (!firstName || !lastName || combinedEmails.length === 0) {
                return
            }

            const address = getCsvField(row, ['address'])
            const country = getCsvField(row, ['country'])
            const state = getCsvField(row, ['state'])
            const city = getCsvField(row, ['city'])
            const pinCode = getCsvField(row, ['pincode', 'pin', 'zipcode'])
            const status = getCsvField(row, ['status'])

            combinedEmails.forEach((email) => {
                records.push(
                    makeInvitation({
                        firstName,
                        lastName,
                        email,
                        address,
                        country,
                        state,
                        city,
                        pinCode,
                        status,
                    }),
                )
            })
        })

        return records
    }

    const handleImportSave = async () => {
        if (uploadedFiles.length === 0) {
            toast.push(
                <Notification type="danger">
                    {t('actions.validation.importFileRequired')}
                </Notification>,
                { placement: 'top-center' },
            )
            return
        }

        setIsSaving(true)
        try {
            const listFromFiles = await Promise.all(
                uploadedFiles.map((file) => parseImportedFile(file)),
            )
            const records = listFromFiles.flat()

            if (records.length === 0) {
                toast.push(
                    <Notification type="danger">
                        {t('actions.validation.noValidRecords')}
                    </Notification>,
                    { placement: 'top-center' },
                )
                return
            }

            setCustomerList([...records, ...customerList])
            toast.push(
                <Notification type="success">
                    {t('actions.toast.imported', {
                        count: records.length,
                        notify: notifyOnImport ? t('common.yes') : t('common.no'),
                    })}
                </Notification>,
                { placement: 'top-center' },
            )
            closeDialog()
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <>
            <div className="flex flex-col md:flex-row gap-3">
                <CSVLink
                    className="w-full"
                    filename="invitationList.csv"
                    data={csvDownloadData}
                >
                    <Button
                        icon={<TbCloudDownload className="text-xl" />}
                        className="w-full"
                    >
                        {t('actions.download')}
                    </Button>
                </CSVLink>
                <Button
                    variant="solid"
                    icon={<TbUserPlus className="text-xl" />}
                    onClick={() => setDialogOpen(true)}
                >
                    {t('actions.addNew')}
                </Button>
            </div>

            <Dialog
                isOpen={dialogOpen}
                onClose={closeDialog}
                onRequestClose={closeDialog}
                width={900}
            >
                <h4 className="mb-4">{t('actions.dialogTitle')}</h4>

                <Tabs value={mode} onChange={(val) => setMode(val as AddMode)}>
                    <TabList>
                        <TabNav value="manual">{t('actions.tabs.manual')}</TabNav>
                        <TabNav value="import">{t('actions.tabs.import')}</TabNav>
                    </TabList>

                    <div className="mt-4">
                        <TabContent value="manual">
                            <Form>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormItem label={t('actions.form.firstName')}>
                                        <Input
                                            value={manualForm.firstName}
                                            onChange={handleManualInputChange(
                                                'firstName',
                                            )}
                                            placeholder={t('actions.form.firstName')}
                                        />
                                    </FormItem>
                                    <FormItem label={t('actions.form.lastName')}>
                                        <Input
                                            value={manualForm.lastName}
                                            onChange={handleManualInputChange(
                                                'lastName',
                                            )}
                                            placeholder={t('actions.form.lastName')}
                                        />
                                    </FormItem>
                                    <FormItem label={t('actions.form.email')}>
                                        <Input
                                            value={manualForm.email}
                                            onChange={handleManualInputChange(
                                                'email',
                                            )}
                                            placeholder={t('actions.form.emailPlaceholder')}
                                        />
                                    </FormItem>
                                    <FormItem label={t('actions.form.managerEmails')}>
                                        <Input
                                            value={manualForm.managerEmails}
                                            onChange={handleManualInputChange(
                                                'managerEmails',
                                            )}
                                            placeholder={t('actions.form.managerEmailsPlaceholder')}
                                        />
                                    </FormItem>
                                    <FormItem label={t('actions.form.address')} className="md:col-span-2">
                                        <Input
                                            value={manualForm.address}
                                            onChange={handleManualInputChange(
                                                'address',
                                            )}
                                            placeholder={t('actions.form.address')}
                                        />
                                    </FormItem>
                                    <FormItem label={t('actions.form.country')}>
                                        <Input
                                            value={manualForm.country}
                                            onChange={handleManualInputChange(
                                                'country',
                                            )}
                                            placeholder={t('actions.form.country')}
                                        />
                                    </FormItem>
                                    <FormItem label={t('actions.form.state')}>
                                        <Input
                                            value={manualForm.state}
                                            onChange={handleManualInputChange(
                                                'state',
                                            )}
                                            placeholder={t('actions.form.state')}
                                        />
                                    </FormItem>
                                    <FormItem label={t('actions.form.city')}>
                                        <Input
                                            value={manualForm.city}
                                            onChange={handleManualInputChange(
                                                'city',
                                            )}
                                            placeholder={t('actions.form.city')}
                                        />
                                    </FormItem>
                                    <FormItem label={t('actions.form.pinCode')}>
                                        <Input
                                            value={manualForm.pinCode}
                                            onChange={handleManualInputChange(
                                                'pinCode',
                                            )}
                                            placeholder={t('actions.form.pinCode')}
                                        />
                                    </FormItem>
                                </div>

                                <div className="flex justify-end gap-2">
                                    <Button onClick={closeDialog}>{t('common.cancel')}</Button>
                                    <Button variant="solid" onClick={handleManualSave}>
                                        {t('common.create')}
                                    </Button>
                                </div>
                            </Form>
                        </TabContent>

                        <TabContent value="import">
                            <Upload
                                draggable
                                className="bg-gray-100 dark:bg-transparent"
                                accept=".csv,text/csv"
                                uploadLimit={1}
                                onChange={setUploadedFiles}
                                onFileRemove={setUploadedFiles}
                                beforeUpload={beforeUpload}
                            >
                                <div className="my-6 text-center">
                                    <p className="font-semibold">
                                        {t('actions.import.openOrDrop')}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        {t('actions.import.csvHeaders')}
                                    </p>
                                </div>
                            </Upload>

                            <div className="mt-4">
                                <Checkbox
                                    checked={notifyOnImport}
                                    onChange={(value) => setNotifyOnImport(value)}
                                >
                                    {t('actions.import.notify')}
                                </Checkbox>
                            </div>

                            <div className="flex justify-end gap-2 mt-6">
                                <Button onClick={closeDialog}>{t('common.cancel')}</Button>
                                <Button
                                    variant="solid"
                                    loading={isSaving}
                                    onClick={handleImportSave}
                                >
                                    {t('common.save')}
                                </Button>
                            </div>
                        </TabContent>
                    </div>
                </Tabs>
            </Dialog>
        </>
    )
}

export default InvitationListActionTools
