'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { TbUsers, TbPlus } from 'react-icons/tb'
import Card from '@/components/ui/Card'
import Checkbox from '@/components/ui/Checkbox'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import Spinner from '@/components/ui/Spinner'
import Button from '@/components/ui/Button'
import { FormItem } from '@/components/ui/Form'
import { useOrderFormStore } from '../store/orderFormStore'
import type { Candidate, FormSectionBaseProps } from '../types'

type ApiResponsePayload = {
    status?: boolean
    success?: boolean
    message?: string
    data?: unknown
}

type CustomerDetailSectionProps = FormSectionBaseProps

const CustomerDetailSection = ({}: CustomerDetailSectionProps) => {
    const {
        selectedProduct,
        candidateList,
        selectedCandidates,
        setCandidateList,
        setSelectedCandidates,
        validationErrors,
    } = useOrderFormStore()

    const [isFetching, setIsFetching] = useState(false)

    const selectedPackage = selectedProduct[0]
    const selectedPackageId = selectedPackage?.id || ''

    const mapApiSuccess = (payload: ApiResponsePayload) =>
        payload.status === true || payload.success === true

    const mapCandidate = (item: unknown): Candidate | null => {
        const record =
            item && typeof item === 'object'
                ? (item as Record<string, unknown>)
                : {}

        const nestedCandidate =
            record.candidate && typeof record.candidate === 'object'
                ? (record.candidate as Record<string, unknown>)
                : {}

        const id = String(
            record.candidate_id ?? nestedCandidate.id ?? record.invitation_id ?? '',
        ).trim()
        const invitationId = String(record.invitation_id ?? '').trim()
        const firstName = String(nestedCandidate.first_name ?? '').trim()
        const lastName = String(nestedCandidate.last_name ?? '').trim()
        const email = String(nestedCandidate.email ?? '').trim()
        const phone = String(nestedCandidate.phone ?? '').trim()
        const completedAt = String(record.completed_at ?? '').trim()

        if (!id) {
            return null
        }

        return {
            id,
            invitationId,
            firstName,
            lastName,
            email,
            phone,
            completedAt,
        }
    }

    const fetchCandidates = useCallback(async (packageId: string) => {
        setIsFetching(true)
        try {
            const response = await fetch(
                `/api/client/packages/${packageId}/candidates`,
                {
                    method: 'GET',
                    cache: 'no-store',
                },
            )
            const payload = ((await response.json()) as ApiResponsePayload) || {}

            if (!response.ok || !mapApiSuccess(payload)) {
                toast.push(
                    <Notification type="danger">
                        {payload.message || 'Failed to fetch candidates.'}
                    </Notification>,
                    { placement: 'top-center' },
                )
                setCandidateList([])
                return
            }

            const dataRecord =
                payload.data && typeof payload.data === 'object'
                    ? (payload.data as Record<string, unknown>)
                    : {}
            const rawCandidates = Array.isArray(dataRecord.candidates)
                ? dataRecord.candidates
                : []

            const mappedCandidates = rawCandidates
                .map(mapCandidate)
                .filter((candidate): candidate is Candidate => candidate !== null)

            setCandidateList(mappedCandidates)
        } catch {
            toast.push(
                <Notification type="danger">
                    Failed to fetch candidates.
                </Notification>,
                { placement: 'top-center' },
            )
            setCandidateList([])
        } finally {
            setIsFetching(false)
        }
    }, [setCandidateList])

    useEffect(() => {
        setSelectedCandidates([])
        setCandidateList([])

        if (!selectedPackageId) {
            return
        }

        fetchCandidates(selectedPackageId)
    }, [
        fetchCandidates,
        selectedPackageId,
        setCandidateList,
        setSelectedCandidates,
    ])

    const allSelected =
        candidateList.length > 0 &&
        selectedCandidates.length === candidateList.length

    return (
        <Card id="customerDetails">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 gap-4 sm:gap-0">
                <h4 className="mb-0">Candidate details</h4>
                <div className="flex items-center gap-4">
                    {selectedPackageId && candidateList.length > 0 && (
                        <span className="text-sm font-medium text-gray-500">
                            {selectedCandidates.length} of {candidateList.length} selected
                        </span>
                    )}
                    {selectedPackageId && candidateList.length > 0 && (
                        <Button
                            size="sm"
                            type="button"
                            onClick={() => setSelectedCandidates(allSelected ? [] : candidateList)}
                        >
                            {allSelected ? 'Deselect All Candidates' : 'Select All Candidates'}
                        </Button>
                    )}
                </div>
            </div>

            <FormItem
                invalid={Boolean(validationErrors.candidates)}
                errorMessage={validationErrors.candidates}
            >
                <div
                    className={
                        candidateList.length > 8
                            ? 'max-h-[400px] overflow-y-auto'
                            : ''
                    }
                >
                    {!selectedPackageId && (
                        <div className="p-8 text-center border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm text-gray-500">
                            Select a package first to load available candidates.
                        </div>
                    )}

                    {selectedPackageId && isFetching && (
                        <div className="p-8 text-center border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm text-gray-500 flex flex-col items-center justify-center gap-3">
                            <Spinner size={30} />
                            <span>Fetching candidates...</span>
                        </div>
                    )}

                    {selectedPackageId && !isFetching && candidateList.length === 0 && (
                        <div className="p-10 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center justify-center gap-4">
                            <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-full text-primary">
                                <TbUsers className="text-4xl" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No candidates available</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto">
                                    There are currently no candidates added for the <strong>{selectedPackage?.name}</strong> package. You need to invite a candidate first before placing an order.
                                </p>
                            </div>
                            <Link href={`/candidates/create?package_id=${selectedPackageId}`}>
                                <Button variant="solid" type="button" icon={<TbPlus />}>
                                    Add Candidate
                                </Button>
                            </Link>
                        </div>
                    )}

                    {selectedPackageId && !isFetching && candidateList.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {candidateList.map((candidate) => {
                                const isSelected = selectedCandidates.some((c) => c.id === candidate.id)
                                const fullName =
                                    `${candidate.firstName} ${candidate.lastName}`.trim() ||
                                    `Candidate #${candidate.id}`
                                
                                return (
                                    <div 
                                        key={candidate.id}
                                        className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${isSelected ? 'border-primary bg-primary-subtle ring-1 ring-primary' : 'border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md bg-white dark:bg-gray-800'}`}
                                        onClick={() => {
                                            if (!isSelected) {
                                                setSelectedCandidates([...selectedCandidates, candidate])
                                            } else {
                                                setSelectedCandidates(
                                                    selectedCandidates.filter((c) => c.id !== candidate.id)
                                                )
                                            }
                                        }}
                                    >
                                        <div className="mt-0.5 mr-3 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                            <Checkbox
                                                checked={isSelected}
                                                onChange={(checked) => {
                                                    if (checked) {
                                                        setSelectedCandidates([...selectedCandidates, candidate])
                                                    } else {
                                                        setSelectedCandidates(
                                                            selectedCandidates.filter((c) => c.id !== candidate.id)
                                                        )
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-bold text-gray-900 dark:text-gray-100 truncate">{fullName}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 flex flex-col gap-1">
                                                {candidate.email ? (
                                                    <span className="truncate text-xs"><span className="font-semibold text-gray-700 dark:text-gray-300">Email:</span> {candidate.email}</span>
                                                ) : null}
                                                {candidate.phone ? (
                                                    <span className="truncate text-xs"><span className="font-semibold text-gray-700 dark:text-gray-300">Mobile:</span> {candidate.phone}</span>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </FormItem>
        </Card>
    )
}

export default CustomerDetailSection
