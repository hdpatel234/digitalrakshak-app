'use client'

import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import { HiPlus, HiTrash } from 'react-icons/hi'
import { components } from 'react-select'
import type { FormSectionBaseProps } from './types'

type AdditionalInfoProps = FormSectionBaseProps

const AdditionalInfo = ({ control, errors }: AdditionalInfoProps) => {
    return (
        <Card>
            <h4 className="mb-6">Additional Information</h4>
            <Controller
                name="managerEmails"
                control={control}
                render={({ field }) => {
                    const managerEmails = field.value ?? ['']
                    const managerEmailErrors = errors.managerEmails

                    return (
                        <div className="mt-6">
                            <div className="mb-2 flex items-center justify-between">
                                <h6>Manager Emails</h6>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="solid"
                                    icon={<HiPlus />}
                                    onClick={() =>
                                        field.onChange([...managerEmails, ''])
                                    }
                                >
                                    Add
                                </Button>
                            </div>
                            <p className="mb-4 text-xs text-gray-500">
                                Optional: add one or more manager emails for
                                this candidate.
                            </p>
                            <div className="space-y-3">
                                {managerEmails.map((email, index) => (
                                    <div
                                        key={`manager-email-${index}`}
                                        className="flex items-start gap-2"
                                    >
                                        <FormItem
                                            className="mb-0 flex-1"
                                            invalid={Boolean(
                                                managerEmailErrors?.[index]
                                                    ?.message,
                                            )}
                                            errorMessage={
                                                managerEmailErrors?.[index]
                                                    ?.message
                                            }
                                        >
                                            <Input
                                                type="email"
                                                autoComplete="off"
                                                placeholder={`Manager Email ${index + 1}`}
                                                value={email}
                                                onChange={(event) => {
                                                    const nextEmails = [
                                                        ...managerEmails,
                                                    ]
                                                    nextEmails[index] =
                                                        event.target.value
                                                    field.onChange(nextEmails)
                                                }}
                                            />
                                        </FormItem>
                                        {managerEmails.length > 1 && (
                                            <Button
                                                type="button"
                                                size="sm"
                                                icon={<HiTrash />}
                                                onClick={() => {
                                                    const nextEmails =
                                                        managerEmails.filter(
                                                            (_, itemIndex) =>
                                                                itemIndex !==
                                                                index,
                                                        )
                                                    field.onChange(nextEmails)
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                }}
            />
        </Card>
    )
}

export default AdditionalInfo
