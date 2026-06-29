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
    return ApiService.fetchDataWithAxios<CreateCandidateResponse>({
        url: '/client/candidates',
        method: 'post',
        data,
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
