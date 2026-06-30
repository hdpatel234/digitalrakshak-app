import ApiService from './../ApiService'
import type { CustomerFormSchema } from '@/components/view/CustomerForm'

export type CreateCandidateResponse = {
    status: boolean
    message: string
    data?: unknown
}

export type CreateCandidatePayload = CustomerFormSchema & {
    send_invite?: boolean
    is_invite?: boolean
    package_ids?: number[]
}

export async function apiCreateCandidate(data: CreateCandidatePayload) {
    const formData = new FormData()

    Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null) return

        if (Array.isArray(value)) {
            value.forEach((v) => {
                if (v !== undefined && v !== null && v !== '') {
                    formData.append(`${key}[]`, v instanceof File ? v : String(v))
                }
            })
        } else if (value instanceof File) {
            formData.append(key, value)
        } else if (typeof value === 'boolean') {
            formData.append(key, value ? '1' : '0')
        } else {
            formData.append(key, String(value))
        }
    })

    return ApiService.fetchDataWithAxios<CreateCandidateResponse>({
        url: '/client/candidates',
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}

export type InviteCandidatePayload = {
    candidate_ids?: number[]
    package_ids?: number[]
}

export async function apiSendCandidateInvite(candidateId: string | number, data: InviteCandidatePayload) {
    return ApiService.fetchDataWithAxios<CreateCandidateResponse>({
        url: `/client/candidates/${candidateId}/invite`,
        method: 'post',
        data,
    })
}
