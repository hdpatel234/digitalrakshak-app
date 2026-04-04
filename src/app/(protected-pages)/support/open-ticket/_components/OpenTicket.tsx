'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { FormItem, Form } from '@/components/ui/Form'
import Upload from '@/components/ui/Upload'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'
import { HiOutlineCloudUpload } from 'react-icons/hi'

type FormSchema = {
    title: string
    message: string
    priority: string
    department: string
    order?: string
    attachment?: File[]
}

const validationSchema: ZodType<FormSchema> = z.object({
    title: z.string().min(1, { message: 'Title is required' }),
    message: z.string().min(1, { message: 'Message is required' }),
    priority: z.string().min(1, { message: 'Priority is required' }),
    department: z.string().min(1, { message: 'Department is required' }),
    order: z.string().optional(),
    attachment: z.array(z.any()).optional(),
})

const OpenTicket = () => {
    const router = useRouter()
    const [orders, setOrders] = useState<{ label: string; value: string }[]>([])
    const [departments, setDepartments] = useState<
        { label: string; value: string }[]
    >([])
    const [priorities, setPriorities] = useState<{ label: string; value: string }[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoadingOrders, setIsLoadingOrders] = useState(true)
    const [isLoadingDepartments, setIsLoadingDepartments] = useState(true)
    const [isLoadingPriorities, setIsLoadingPriorities] = useState(true)

    const {
        handleSubmit,
        formState: { errors },
        control,
        reset,
    } = useForm<FormSchema>({
        defaultValues: {
            title: '',
            message: '',
            priority: '',
            department: '',
            order: '',
            attachment: [],
        },
        resolver: zodResolver(validationSchema),
    })

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('/api/client/orders')
                const result = await response.json()
                if (result.status && result.data?.list) {
                    const formattedOrders = result.data.list.map((order: any) => {
                        const orderNum =
                            order.order_number || order.displayId || order.id || ''
                        const label = orderNum.toString().startsWith('#')
                            ? orderNum
                            : `#${orderNum}`

                        return {
                            label,
                            value: order.id.toString(),
                        }
                    })
                    setOrders(formattedOrders)
                }
            } catch (error) {
                console.error('Failed to fetch orders:', error)
            } finally {
                setIsLoadingOrders(false)
            }
        }

        const fetchDepartments = async () => {
            try {
                const response = await fetch('/api/client/tickets/departments')
                const result = await response.json()
                if (result.status && Array.isArray(result.data)) {
                    const formattedDepartments = result.data.map(
                        (dept: any) => ({
                            label: dept.name,
                            value: dept.id.toString(),
                        }),
                    )
                    setDepartments(formattedDepartments)
                }
            } catch (error) {
                console.error('Failed to fetch departments:', error)
            } finally {
                setIsLoadingDepartments(false)
            }
        }

        const fetchPriorities = async () => {
            try {
                const response = await fetch('/api/client/tickets/priorities')
                const result = await response.json()
                if (result.status && Array.isArray(result.data)) {
                    const formattedPriorities = result.data.map(
                        (priority: any) => ({
                            label: priority.name,
                            value: priority.id.toString(),
                        }),
                    )
                    setPriorities(formattedPriorities)
                }
            } catch (error) {
                console.error('Failed to fetch priorities:', error)
            } finally {
                setIsLoadingPriorities(false)
            }
        }

        fetchOrders()
        fetchDepartments()
        fetchPriorities()
    }, [])

    const onSubmit = async (values: FormSchema) => {
        setIsSubmitting(true)
        try {
            const formData = new FormData()
            formData.append('title', values.title)
            formData.append('message', values.message)
            formData.append('priority', values.priority)
            formData.append('department', values.department)
            if (values.order) {
                formData.append('order', values.order)
            }
            if (values.attachment && values.attachment.length > 0) {
                values.attachment.forEach((file) => {
                    formData.append('attachment[]', file)
                })
            }

            const response = await fetch('/api/client/tickets', {
                method: 'POST',
                body: formData,
            })

            const result = await response.json()

            if (result.status) {
                toast.push(
                    <Notification
                        type="success"
                        title="Success"
                        duration={3000}
                    >
                        {result.message || 'Ticket created successfully!'}
                    </Notification>,
                    { placement: 'top-center' },
                )
                router.push('/support/my-tickets')
            } else {
                toast.push(
                    <Notification type="danger" title="Error" duration={5000}>
                        {result.message || 'Failed to create ticket'}
                    </Notification>,
                    { placement: 'top-center' },
                )
            }
        } catch (error) {
            toast.push(
                <Notification type="danger" title="Error" duration={5000}>
                    An unexpected error occurred. Please try again.
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                            <h3 className="mb-1">Open a New Ticket</h3>
                            <p>
                                Tell us more about your issue and we will get back
                                to you as soon as possible.
                            </p>
                        </div>
                    </div>

                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormItem
                                label="Title"
                                invalid={Boolean(errors.title)}
                                errorMessage={errors.title?.message}
                                className="md:col-span-2"
                            >
                                <Controller
                                    name="title"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            placeholder="Enter ticket title"
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem
                                label="Department"
                                invalid={Boolean(errors.department)}
                                errorMessage={errors.department?.message}
                            >
                                <Controller
                                    name="department"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            placeholder="Select department"
                                            options={departments}
                                            isLoading={isLoadingDepartments}
                                            {...field}
                                            value={departments.find(
                                                (opt) => opt.value === field.value,
                                            )}
                                            onChange={(opt) =>
                                                field.onChange(opt?.value)
                                            }
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem
                                label="Priority"
                                invalid={Boolean(errors.priority)}
                                errorMessage={errors.priority?.message}
                            >
                                <Controller
                                    name="priority"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            placeholder="Select priority"
                                            options={priorities}
                                            isLoading={isLoadingPriorities}
                                            {...field}
                                            value={priorities.find(
                                                (opt) => opt.value === field.value,
                                            )}
                                            onChange={(opt) =>
                                                field.onChange(opt?.value)
                                            }
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem
                                label="Link to Order (Optional)"
                                invalid={Boolean(errors.order)}
                                errorMessage={errors.order?.message}
                                className="md:col-span-2"
                            >
                                <Controller
                                    name="order"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            placeholder="Select order"
                                            options={orders}
                                            isLoading={isLoadingOrders}
                                            {...field}
                                            value={orders.find(
                                                (opt) => opt.value === field.value,
                                            )}
                                            onChange={(opt) =>
                                                field.onChange(opt?.value)
                                            }
                                            isClearable
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem
                                label="Message"
                                invalid={Boolean(errors.message)}
                                errorMessage={errors.message?.message}
                                className="md:col-span-2"
                            >
                                <Controller
                                    name="message"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            textArea
                                            rows={8}
                                            placeholder="Describe your issue in detail..."
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem
                                label="Attachments (Optional)"
                                className="md:col-span-2"
                            >
                                <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                                    <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Upload Support Documents</p>
                                    <p>Accepted formats: Image (JPG, PNG), PDF, and Word (DOC, DOCX).</p>
                                </div>
                                <Controller
                                    name="attachment"
                                    control={control}
                                    render={({ field }) => (
                                        <Upload
                                            draggable
                                            multiple
                                            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                                            fileList={field.value}
                                            onChange={(files) => field.onChange(files)}
                                            onFileRemove={(files) =>
                                                field.onChange(files)
                                            }
                                        >
                                            <div className="my-6 text-center">
                                                <div className="text-6xl mb-4 flex justify-center text-primary">
                                                    <HiOutlineCloudUpload />
                                                </div>
                                                <p className="font-semibold text-gray-800 dark:text-white">
                                                    Click or drag & drop files here to upload
                                                </p>
                                                <p className="text-gray-500 mt-1">
                                                    Support for single or bulk upload.
                                                </p>
                                            </div>
                                        </Upload>
                                    )}
                                />
                            </FormItem>
                        </div>

                        <div className="flex justify-end mt-6">
                            <Button
                                variant="solid"
                                type="submit"
                                loading={isSubmitting}
                            >
                                Create Ticket
                            </Button>
                        </div>
                    </Form>
                </div>
            </AdaptiveCard>
        </Container>
    )
}

export default OpenTicket
