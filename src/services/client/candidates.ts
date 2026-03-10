import ApiService from './../ApiService'
import type { CustomerFormSchema } from '@/components/view/CustomerForm'

export type CreateCandidateResponse = {
    status: boolean
    message: string
    data?: unknown
}

export type CreateCandidatePayload = CustomerFormSchema & {
    send_invite?: boolean
}

export async function apiCreateCandidate(data: CreateCandidatePayload) {
    return ApiService.fetchDataWithAxios<CreateCandidateResponse>({
        url: '/client/candidates',
        method: 'post',
        data,
    })
}
