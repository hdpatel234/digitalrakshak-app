'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import Pagination from '@/components/ui/Pagination'
import Table from '@/components/ui/Table'
import Tag from '@/components/ui/Tag'
import Upload from '@/components/ui/Upload'
import toast from '@/components/ui/toast'

type CandidateImportHistory = {
    id: number
    file_name: string
    total_candidates: number
    successful_candidates: number
    failed_candidates: number
    status: string
    failed_reason: string | null
    created_at: string
}

type ImportResultStatus = 'success' | 'failed'

type ImportResult = {
    status: ImportResultStatus
    message: string
}

const { THead, TBody, Tr, Th, Td } = Table

const PAGE_SIZE = 5
const HISTORY_REFRESH_INTERVAL = 10 * 1000

const statusColor: Record<string, string> = {
    success: 'bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900',
    completed: 'bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900',
    pending: 'bg-amber-200 dark:bg-amber-200 text-gray-900 dark:text-gray-900',
    processing: 'bg-blue-200 dark:bg-blue-200 text-gray-900 dark:text-gray-900',
    failed: 'bg-red-200 dark:bg-red-200 text-gray-900 dark:text-gray-900',
    error: 'bg-red-200 dark:bg-red-200 text-gray-900 dark:text-gray-900',
}

type SampleFormat = 'csv' | 'xlsx'

const getFilenameFromDisposition = (contentDisposition: string | null) => {
    if (!contentDisposition) {
        return null
    }

    const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i)
    if (utf8Match?.[1]) {
        return decodeURIComponent(utf8Match[1]).replace(/['"]/g, '')
    }

    const standardMatch = contentDisposition.match(/filename="?([^"]+)"?/i)
    if (standardMatch?.[1]) {
        return standardMatch[1].trim()
    }

    return null
}

const formatCreatedAt = (createdAt: string) => {
    const parsed = new Date(createdAt)
    if (Number.isNaN(parsed.getTime())) {
        return createdAt
    }

    return parsed.toLocaleString()
}

const CandidateImportContent = () => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [isImporting, setIsImporting] = useState(false)
    const [importResult, setImportResult] = useState<ImportResult | null>(null)
    const [historyError, setHistoryError] = useState<string | null>(null)
    const [importHistory, setImportHistory] = useState<CandidateImportHistory[]>([])
    const [isHistoryLoading, setIsHistoryLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [downloadingFormat, setDownloadingFormat] = useState<SampleFormat | null>(
        null,
    )
    const importErrorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const clearImportErrorTimer = () => {
        if (importErrorTimerRef.current) {
            clearTimeout(importErrorTimerRef.current)
            importErrorTimerRef.current = null
        }
    }

    const showTemporaryImportError = (message: string) => {
        clearImportErrorTimer()
        setImportResult({
            status: 'failed',
            message,
        })
        importErrorTimerRef.current = setTimeout(() => {
            setImportResult(null)
            importErrorTimerRef.current = null
        }, 10000)
    }

    useEffect(() => {
        return () => {
            clearImportErrorTimer()
        }
    }, [])

    const validateImportFile = (file: File | null | undefined) => {
        if (!file) {
            return 'Please select a file to import.'
        }

        const allowedExtensions = ['.csv', '.xlsx']
        const selectedFileName = file.name.toLowerCase()
        const isValidFile = allowedExtensions.some((ext) =>
            selectedFileName.endsWith(ext),
        )

        if (!isValidFile) {
            return 'Only CSV or XLSX files are allowed.'
        }

        return true
    }

    const fetchImportHistory = useCallback(async (showLoader = true) => {
        try {
            if (showLoader) {
                setIsHistoryLoading(true)
            }

            const response = await fetch('/api/client/candidates/import', {
                method: 'GET',
                cache: 'no-store',
            })

            const payload = (await response.json().catch(() => null)) as
                | {
                      status?: boolean
                      success?: boolean
                      message?: string
                      data?: CandidateImportHistory[]
                  }
                | null

            const isSuccess =
                response.ok && Boolean(payload?.status ?? payload?.success)

            if (!isSuccess) {
                throw new Error(
                    payload?.message || 'Failed to fetch candidate import history.',
                )
            }

            const imports = Array.isArray(payload?.data) ? payload.data : []
            setImportHistory(imports)
            setHistoryError(null)
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Failed to fetch candidate import history.'
            setHistoryError(message)
        } finally {
            if (showLoader) {
                setIsHistoryLoading(false)
            }
        }
    }, [])

    useEffect(() => {
        fetchImportHistory()

        const refreshInterval = setInterval(() => {
            fetchImportHistory(false)
        }, HISTORY_REFRESH_INTERVAL)

        return () => {
            clearInterval(refreshInterval)
        }
    }, [fetchImportHistory])

    const totalImports = importHistory.length
    const totalPages = Math.max(1, Math.ceil(totalImports / PAGE_SIZE))

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages)
        }
    }, [currentPage, totalPages])

    const pageStart = (currentPage - 1) * PAGE_SIZE
    const pageEnd = pageStart + PAGE_SIZE
    const paginatedImportHistory = importHistory.slice(pageStart, pageEnd)

    const handleImport = async () => {
        const selectedFile = selectedFiles[0]
        const validationResult = validateImportFile(selectedFile)

        if (validationResult !== true) {
            showTemporaryImportError(validationResult)
            toast.push(
                <Notification type="danger">{validationResult}</Notification>,
                { placement: 'top-center' },
            )
            return
        }

        try {
            setIsImporting(true)
            clearImportErrorTimer()
            setImportResult(null)

            const requestFormData = new FormData()
            requestFormData.append('file', selectedFile, selectedFile.name)

            const response = await fetch('/api/client/candidates/import', {
                method: 'POST',
                body: requestFormData,
            })

            const payload = (await response.json().catch(() => null)) as
                | {
                      status?: boolean
                      success?: boolean
                      message?: string
                  }
                | null

            const isSuccess =
                response.ok && Boolean(payload?.status ?? payload?.success)
            const responseMessage =
                payload?.message ||
                (isSuccess
                    ? 'Candidates imported successfully.'
                    : 'Failed to import candidates.')
            if (isSuccess) {
                setSelectedFiles([])
                toast.push(
                    <Notification type="success">{responseMessage}</Notification>,
                    { placement: 'top-center' },
                )
                fetchImportHistory(false)
            } else {
                showTemporaryImportError(responseMessage)
                toast.push(
                    <Notification type="danger">{responseMessage}</Notification>,
                    { placement: 'top-center' },
                )
            }
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to import candidates.'

            showTemporaryImportError(errorMessage)

            toast.push(<Notification type="danger">{errorMessage}</Notification>, {
                placement: 'top-center',
            })
        } finally {
            setIsImporting(false)
        }
    }

    const handleSampleDownload = async (format: SampleFormat) => {
        try {
            setDownloadingFormat(format)

            const response = await fetch(
                `/api/client/candidates/import/sample?format=${format}`,
                {
                    method: 'GET',
                },
            )

            if (!response.ok) {
                const errorPayload = (await response.json().catch(() => null)) as {
                    message?: string
                } | null
                throw new Error(
                    errorPayload?.message || 'Failed to download sample file.',
                )
            }

            const fileBlob = await response.blob()
            const contentDisposition = response.headers.get('content-disposition')
            const fallbackFilename = `candidate-import-sample.${format}`
            const filename =
                getFilenameFromDisposition(contentDisposition) || fallbackFilename

            const downloadUrl = window.URL.createObjectURL(fileBlob)
            const link = document.createElement('a')
            link.href = downloadUrl
            link.download = filename
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(downloadUrl)

            toast.push(
                <Notification type="success">
                    Sample {format.toUpperCase()} file downloaded successfully.
                </Notification>,
                { placement: 'top-center' },
            )
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to download sample file.'

            toast.push(<Notification type="danger">{errorMessage}</Notification>, {
                placement: 'top-center',
            })
        } finally {
            setDownloadingFormat(null)
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                    <div>
                        <h3>Import Candidates</h3>
                        <p className="mt-1">Upload a CSV or XLSX file to import candidates.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="text-gray-500">Download sample:</span>
                        <Button
                            size="sm"
                            loading={downloadingFormat === 'csv'}
                            onClick={() => handleSampleDownload('csv')}
                        >
                            CSV
                        </Button>
                        <Button
                            size="sm"
                            loading={downloadingFormat === 'xlsx'}
                            onClick={() => handleSampleDownload('xlsx')}
                        >
                            XLSX
                        </Button>
                    </div>

                    <Upload
                        draggable
                        accept=".csv,.xlsx,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        uploadLimit={1}
                        fileList={selectedFiles}
                        onChange={(files) => {
                            setSelectedFiles(files)
                            clearImportErrorTimer()
                            setImportResult(null)
                        }}
                        onFileRemove={(files) => {
                            setSelectedFiles(files)
                            clearImportErrorTimer()
                            setImportResult(null)
                        }}
                        beforeUpload={(files) => validateImportFile(files?.[0])}
                        tip={<div className="text-xs text-gray-500">Allowed file types: .csv, .xlsx</div>}
                    />

                    {importResult?.status === 'failed' && (
                        <Notification
                            type="danger"
                            duration={10000}
                        >
                            {importResult.message}
                        </Notification>
                    )}

                    <div className="flex justify-end">
                        <Button
                            variant="solid"
                            loading={isImporting}
                            disabled={isImporting || selectedFiles.length === 0}
                            onClick={handleImport}
                        >
                            Import File
                        </Button>
                    </div>
                </div>
            </AdaptiveCard>

            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-2">
                        <h4>Import History</h4>
                        <span className="text-sm text-gray-500">Total: {totalImports}</span>
                    </div>

                    {historyError && <Notification type="danger">{historyError}</Notification>}

                    <Table>
                        <THead>
                            <Tr>
                                <Th>File Name</Th>
                                <Th>Total</Th>
                                <Th>Successful</Th>
                                <Th>Failed</Th>
                                <Th>Status</Th>
                                <Th>Failed Reason</Th>
                                <Th>Created At</Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {isHistoryLoading ? (
                                <Tr>
                                    <Td colSpan={7} className="text-center py-6">
                                        Loading import history...
                                    </Td>
                                </Tr>
                            ) : paginatedImportHistory.length === 0 ? (
                                <Tr>
                                    <Td colSpan={7} className="text-center py-6">
                                        No import history found.
                                    </Td>
                                </Tr>
                            ) : (
                                paginatedImportHistory.map((item) => (
                                    <Tr key={item.id}>
                                        <Td>{item.file_name}</Td>
                                        <Td>{item.total_candidates}</Td>
                                        <Td>{item.successful_candidates}</Td>
                                        <Td>{item.failed_candidates}</Td>
                                        <Td>
                                            <Tag
                                                className={
                                                    statusColor[(item.status || '').toLowerCase()] ||
                                                    'bg-gray-200 text-gray-900'
                                                }
                                            >
                                                <span className="capitalize">{item.status}</span>
                                            </Tag>
                                        </Td>
                                        <Td>{item.failed_reason || '-'}</Td>
                                        <Td>{formatCreatedAt(item.created_at)}</Td>
                                    </Tr>
                                ))
                            )}
                        </TBody>
                    </Table>

                    {totalImports > PAGE_SIZE && (
                        <div className="flex justify-end">
                            <Pagination
                                pageSize={PAGE_SIZE}
                                currentPage={currentPage}
                                total={totalImports}
                                onChange={setCurrentPage}
                            />
                        </div>
                    )}
                </div>
            </AdaptiveCard>
        </div>
    )
}

export default CandidateImportContent
