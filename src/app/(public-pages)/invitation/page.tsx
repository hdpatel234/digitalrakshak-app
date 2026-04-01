'use client'

import { useMemo, useState } from 'react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Upload from '@/components/ui/Upload'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { TbFileText, TbUpload } from 'react-icons/tb'

const MAX_RESUME_SIZE = 10 * 1024 * 1024

const ACCEPTED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.txt']

const Page = () => {
    const [invitationToken, setInvitationToken] = useState('')
    const [resumeText, setResumeText] = useState('')
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [isParsing, setIsParsing] = useState(false)
    const [lastMessage, setLastMessage] = useState<{
        type: 'success' | 'danger'
        message: string
    } | null>(null)

    const tokenValue = invitationToken.trim()

    const validateResumeFile = (file: File | null | undefined) => {
        if (!file) {
            return 'Please select a resume file to upload.'
        }

        const name = file.name.toLowerCase()
        const hasValidExtension = ACCEPTED_EXTENSIONS.some((ext) =>
            name.endsWith(ext),
        )

        if (!hasValidExtension) {
            return `Allowed file types: ${ACCEPTED_EXTENSIONS.join(', ')}`
        }

        if (file.size > MAX_RESUME_SIZE) {
            return 'File size must be 10 MB or less.'
        }

        return true
    }

    const resetStatus = () => {
        setLastMessage(null)
    }

    const showToast = (type: 'success' | 'danger', message: string) => {
        toast.push(<Notification type={type}>{message}</Notification>, {
            placement: 'top-center',
        })
    }

    const submitResume = async (file: File) => {
        if (!tokenValue) {
            const message = 'Invitation token is required to parse the resume.'
            setLastMessage({ type: 'danger', message })
            showToast('danger', message)
            return
        }

        try {
            setIsParsing(true)
            resetStatus()

            const requestFormData = new FormData()
            requestFormData.append('file', file, file.name)

            const response = await fetch(
                `/api/client/invitations/by-token/${encodeURIComponent(tokenValue)}/parse-resume`,
                {
                    method: 'POST',
                    body: requestFormData,
                },
            )

            const payload = (await response.json().catch(() => null)) as
                | {
                      status?: boolean
                      success?: boolean
                      message?: string
                  }
                | null

            const isSuccess =
                response.ok && Boolean(payload?.status ?? payload?.success)
            const message =
                payload?.message ||
                (isSuccess
                    ? 'Resume parsed successfully.'
                    : 'Failed to parse resume.')

            setLastMessage({
                type: isSuccess ? 'success' : 'danger',
                message,
            })
            showToast(isSuccess ? 'success' : 'danger', message)
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Failed to parse resume.'
            setLastMessage({ type: 'danger', message })
            showToast('danger', message)
        } finally {
            setIsParsing(false)
        }
    }

    const handleFileUpload = async (files: File[]) => {
        const file = files[0]
        const validation = validateResumeFile(file)
        if (validation !== true) {
            const message = String(validation)
            setLastMessage({ type: 'danger', message })
            showToast('danger', message)
            return
        }

        setSelectedFiles(files)
        await submitResume(file)
    }

    const handleTextParse = async () => {
        const textValue = resumeText.trim()
        if (!textValue) {
            const message = 'Please paste your resume text to continue.'
            setLastMessage({ type: 'danger', message })
            showToast('danger', message)
            return
        }

        const file = new File([textValue], 'resume.txt', {
            type: 'text/plain',
        })
        await submitResume(file)
    }

    const headerAccent = useMemo(
        () =>
            'bg-gradient-to-br from-sky-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950',
        [],
    )

    return (
        <div className={`w-full rounded-3xl p-6 md:p-10 ${headerAccent}`}>
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        Resume Upload
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Paste your resume or upload a file. Both options work equally
                        well to parse your details.
                    </p>
                </div>

                <Card className="border border-gray-200/80 shadow-sm dark:border-gray-700/80">
                    <div className="flex flex-col gap-3">
                        <div>
                            <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                                Invitation Token
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Enter the token shared with you in the invitation
                                email.
                            </p>
                        </div>
                        <Input
                            value={invitationToken}
                            placeholder="Enter invitation token"
                            onChange={(event) =>
                                setInvitationToken(event.target.value)
                            }
                            autoComplete="off"
                        />
                    </div>
                </Card>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Card className="flex h-full flex-col gap-4 border border-gray-200/80 shadow-sm dark:border-gray-700/80">
                        <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-200">
                                <TbFileText size={20} />
                            </span>
                            <div>
                                <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                                    Paste Resume
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Copy your resume text and paste it here.
                                </p>
                            </div>
                        </div>

                        <Input
                            textArea
                            rows={10}
                            placeholder="Paste your resume content..."
                            value={resumeText}
                            onChange={(event) => setResumeText(event.target.value)}
                        />

                        <Button
                            variant="solid"
                            loading={isParsing}
                            disabled={isParsing}
                            onClick={handleTextParse}
                        >
                            Parse From Text
                        </Button>
                    </Card>

                    <Card className="flex h-full flex-col gap-4 border border-gray-200/80 shadow-sm dark:border-gray-700/80">
                        <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200">
                                <TbUpload size={20} />
                            </span>
                            <div>
                                <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                                    Upload Resume
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Drag and drop your resume file or browse to
                                    upload.
                                </p>
                            </div>
                        </div>

                        <Upload
                            draggable
                            accept={ACCEPTED_EXTENSIONS.join(',')}
                            uploadLimit={1}
                            fileList={selectedFiles}
                            onChange={(files) => {
                                resetStatus()
                                handleFileUpload(files)
                            }}
                            onFileRemove={(files) => {
                                setSelectedFiles(files)
                                resetStatus()
                            }}
                            beforeUpload={(files) =>
                                validateResumeFile(files?.[0])
                            }
                            tip={
                                <div className="text-xs text-gray-500">
                                    Allowed file types: {ACCEPTED_EXTENSIONS.join(
                                        ', ',
                                    )}. Max size: 10 MB.
                                </div>
                            }
                        />

                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            Uploading a file will trigger resume parsing
                            automatically.
                        </div>
                    </Card>
                </div>

                {lastMessage ? (
                    <Notification type={lastMessage.type}>
                        {lastMessage.message}
                    </Notification>
                ) : null}
            </div>
        </div>
    )
}

export default Page
