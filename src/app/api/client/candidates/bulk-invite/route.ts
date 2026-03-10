import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import apiClient from '@/services/axios/ApiClient'

type UpstreamBulkInviteResponse = {
    status?: boolean
    success?: boolean
    message?: string
    data?: unknown
    status_code?: number
    error?: string
}

type BulkInviteRequestPayload = {
    candidate_ids?: number[]
    package_ids?: number[]
}

const resolveSuccess = (payload: UpstreamBulkInviteResponse) => {
    if (typeof payload.success === 'boolean') {
        return payload.success
    }

    if (typeof payload.status === 'boolean') {
        return payload.status
    }

    return false
}

const buildUnauthorizedResponse = () =>
    NextResponse.json(
        {
            status: false,
            message: 'Unauthorized',
        },
        { status: 401 },
    )

const buildAuthHeaders = (tokenType: string, accessToken: string) => ({
    Accept: 'application/json',
    Authorization: `${tokenType} ${accessToken}`,
})

export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        const accessToken = session?.accessToken || ''
        const tokenType = session?.tokenType || 'Bearer'

        if (!accessToken) {
            return buildUnauthorizedResponse()
        }

        const body = (await request.json()) as BulkInviteRequestPayload
        const candidateIds = Array.isArray(body?.candidate_ids)
            ? body.candidate_ids
                  .map((id) => Number.parseInt(String(id), 10))
                  .filter((id) => Number.isInteger(id))
            : []
        const packageIds = Array.isArray(body?.package_ids)
            ? body.package_ids
                  .map((id) => Number.parseInt(String(id), 10))
                  .filter((id) => Number.isInteger(id))
            : []

        const payload = (await apiClient.request(
            'post',
            '/client/candidates/bulk-invite',
            {
                candidate_ids: candidateIds,
                package_ids: packageIds,
            },
            false,
            {
                headers: buildAuthHeaders(tokenType, accessToken),
            },
        )) as UpstreamBulkInviteResponse

        if (!resolveSuccess(payload)) {
            return NextResponse.json(
                {
                    status: false,
                    message:
                        payload.message || 'Failed to send bulk invitations',
                    ...(payload.data ? { data: payload.data } : {}),
                    ...(payload.error ? { error: payload.error } : {}),
                },
                { status: payload.status_code || 400 },
            )
        }

        return NextResponse.json(
            {
                status: true,
                message:
                    payload.message || 'Bulk invitations sent successfully',
                ...(payload.data ? { data: payload.data } : {}),
            },
            { status: 200 },
        )
    } catch (error: unknown) {
        const responseError = error as {
            response?: {
                data?: { message?: string }
                status?: number
            }
            message?: string
        }

        return NextResponse.json(
            {
                status: false,
                message:
                    responseError?.response?.data?.message ||
                    responseError?.message ||
                    'Failed to send bulk invitations',
            },
            { status: responseError?.response?.status || 500 },
        )
    }
}
