'use client'

import { useCallback, useEffect, useMemo } from 'react'
import Card from '@/components/ui/Card'
import Table from '@/components/ui/Table'
import Select from '@/components/ui/Select'
import Checkbox from '@/components/ui/Checkbox'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { FormItem } from '@/components/ui/Form'
import { useOrderFormStore } from '../store/orderFormStore'
import type { Candidate, CandidateOption, FormSectionBaseProps } from '../types'

const { Tr, Th, Td, THead, TBody } = Table

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

    const candidateOptions = useMemo<CandidateOption[]>(
        () =>
            candidateList.map((candidate) => {
                const fullName = `${candidate.firstName} ${candidate.lastName}`.trim()
                const displayName = fullName || `Candidate #${candidate.id}`
                return {
                    value: candidate.id,
                    label: displayName,
                }
            }),
        [candidateList],
    )

    const selectedCandidateOptions = useMemo<CandidateOption[]>(
        () =>
            selectedCandidates.map((candidate) => {
                const fullName = `${candidate.firstName} ${candidate.lastName}`.trim()
                const displayName = fullName || `Candidate #${candidate.id}`
                return {
                    value: candidate.id,
                    label: displayName,
                }
            }),
        [selectedCandidates],
    )

    const allSelected =
        candidateList.length > 0 &&
        selectedCandidates.length === candidateList.length

    return (
        <Card id="customerDetails">
            <h4 className="mb-6">Candidate details</h4>

            <FormItem
                label="Candidates"
                invalid={Boolean(validationErrors.candidates)}
                errorMessage={validationErrors.candidates}
            >
                <Select<CandidateOption, true>
                    isMulti
                    isClearable
                    isDisabled={!selectedPackageId}
                    options={candidateOptions}
                    value={selectedCandidateOptions}
                    placeholder={
                        selectedPackageId
                            ? 'Select one or more candidates'
                            : 'Select package first'
                    }
                    onChange={(options) => {
                        const selectedIds = new Set(
                            Array.isArray(options)
                                ? options.map((option) => option.value)
                                : [],
                        )
                        setSelectedCandidates(
                            candidateList.filter((candidate) =>
                                selectedIds.has(candidate.id),
                            ),
                        )
                    }}
                />
            </FormItem>

            <div className="mb-4">
                <Checkbox
                    disabled={!selectedPackageId || candidateList.length === 0}
                    checked={allSelected}
                    onChange={(checked) =>
                        setSelectedCandidates(checked ? candidateList : [])
                    }
                >
                    Select all candidates
                </Checkbox>
            </div>

            <div
                className={
                    selectedCandidates.length > 10
                        ? 'max-h-[360px] overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg'
                        : 'border border-gray-200 dark:border-gray-700 rounded-lg'
                }
            >
                {!selectedPackageId && (
                    <p className="text-sm text-gray-500">
                        Select a package to load candidates.
                    </p>
                )}

                {selectedPackageId && selectedCandidates.length === 0 && (
                    <p className="text-sm text-gray-500">
                        No candidate selected.
                    </p>
                )}

                {selectedCandidates.length > 0 && (
                    <Table compact className="w-full">
                        <THead>
                            <Tr>
                                <Th>Name</Th>
                                <Th>Email</Th>
                                <Th>Phone</Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {selectedCandidates.map((candidate) => {
                                const fullName =
                                    `${candidate.firstName} ${candidate.lastName}`.trim() ||
                                    `Candidate #${candidate.id}`
                                return (
                                    <Tr key={candidate.id}>
                                        <Td className="font-semibold">{fullName}</Td>
                                        <Td>{candidate.email || '-'}</Td>
                                        <Td>{candidate.phone || '-'}</Td>
                                    </Tr>
                                )
                            })}
                        </TBody>
                    </Table>
                )}
            </div>
        </Card>
    )
}

export default CustomerDetailSection
