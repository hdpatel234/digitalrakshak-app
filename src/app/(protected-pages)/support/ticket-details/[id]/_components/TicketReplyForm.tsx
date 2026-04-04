'use client'

import React, { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import Upload from '@/components/ui/Upload'
import { FormItem } from '@/components/ui/Form'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { HiPaperClip, HiPaperAirplane, HiXMark } from 'react-icons/hi2'
import { VscFilePdf, VscFileZip, VscFile } from 'react-icons/vsc'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import type { ZodType } from 'zod'

interface TicketReplyFormProps {
    ticketId: string | number
    onSuccess: () => void
    isClosed?: boolean
}

type FormSchema = {
    message: string
}

const validationSchema: ZodType<FormSchema> = z.object({
    message: z.string().min(1, { message: 'Message is required' }),
})

const TicketReplyForm = ({
    ticketId,
    onSuccess,
    isClosed,
}: TicketReplyFormProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [files, setFiles] = useState<File[]>([])

    const {
        handleSubmit,
        formState: { errors },
        control,
        reset,
    } = useForm<FormSchema>({
        defaultValues: {
            message: '',
        },
        resolver: zodResolver(validationSchema),
    })

    const onSubmit = async (values: FormSchema) => {
        setIsSubmitting(true)

        try {
            const formData = new FormData()
            formData.append('message', values.message)
            formData.append('ticket_id', ticketId.toString())
            files.forEach((file) => {
                formData.append('attachments[]', file)
            })

            const response = await fetch(`/api/client/tickets/${ticketId}/reply`, {
                method: 'POST',
                body: formData,
            })

            const result = await response.json()

            if (result.status) {
                toast.push(
                    <Notification title="Success" type="success">
                        Reply sent successfully.
                    </Notification>,
                )
                reset()
                setFiles([])
                onSuccess()
            } else {
                toast.push(
                    <Notification title="Error" type="danger">
                        {result.message || 'Failed to send reply.'}
                    </Notification>,
                )
            }
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger">
                    An unexpected error occurred.
                </Notification>,
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isClosed) {
        return (
            <Card className="bg-gray-50 border-dashed border-2 border-gray-200 flex items-center justify-center py-6">
                <span className="text-gray-500 font-medium italic">
                    This ticket is closed and cannot be replied to.
                </span>
            </Card>
        )
    }

    return (
        <Card className="shadow-lg border-primary/10">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <FormItem
                    invalid={Boolean(errors.message)}
                    errorMessage={errors.message?.message}
                    className="mb-0"
                >
                    <Controller
                        name="message"
                        control={control}
                        render={({ field }) => (
                            <Input
                                textArea
                                placeholder="Type your reply here..."
                                {...field}
                                rows={4}
                                className="focus:ring-primary/20"
                            />
                        )}
                    />
                </FormItem>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <Upload
                        multiple
                        fileList={files}
                        className="w-full sm:w-auto"
                        onChange={(updatedFiles) => setFiles(updatedFiles)}
                        uploadLimit={5}
                        showList={false}
                    >
                        <Button
                            type="button"
                            variant="plain"
                            size="xs"
                            icon={<HiPaperClip className="text-base" />}
                            className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400 font-bold"
                        >
                            Attach Files
                        </Button>
                    </Upload>

                    <Button
                        type="submit"
                        loading={isSubmitting}
                        icon={<HiPaperAirplane className="rotate-[-20deg]" />}
                        className="w-full sm:w-auto shadow-md shadow-primary/20"
                    >
                        Send Reply
                    </Button>
                </div>

                {files.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {files.map((file, idx) => {
                            const isImage = file.type.startsWith('image/')
                            const isPdf = file.type === 'application/pdf'
                            const isZip =
                                file.type === 'application/zip' ||
                                file.type === 'application/x-zip-compressed'

                            return (
                                <div
                                    key={idx}
                                    className="relative group border border-gray-100 dark:border-gray-800 rounded-xl p-2 flex flex-col items-center gap-2 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all duration-200"
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setFiles(files.filter((_, i) => i !== idx))
                                        }
                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm"
                                    >
                                        <HiXMark className="text-xs" />
                                    </button>

                                    <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800 flex items-center justify-center border border-gray-50 dark:border-gray-700">
                                        {isImage ? (
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={file.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="text-3xl text-gray-400">
                                                {isPdf ? (
                                                    <VscFilePdf className="text-red-500" />
                                                ) : isZip ? (
                                                    <VscFileZip className="text-blue-500" />
                                                ) : (
                                                    <VscFile />
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="w-full px-1">
                                        <p className="text-[10px] font-medium text-gray-600 dark:text-gray-300 truncate text-center">
                                            {file.name}
                                        </p>
                                        <p className="text-[9px] text-gray-400 dark:text-gray-500 text-center">
                                            {(file.size / 1024).toFixed(1)} KB
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </form>
        </Card>
    )
}

export default TicketReplyForm
