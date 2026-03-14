import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import apiClient from '@/services/axios/ApiClient'

type UpstreamResponse = {
    status?: boolean
    success?: boolean
    message?: string
    data?: unknown
    status_code?: number
    error?: string
}

const resolveSuccess = (payload: UpstreamResponse) => {
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

export async function GET() {
    try {
        const session = await auth()
        const accessToken = session?.accessToken || ''
        const tokenType = session?.tokenType || 'Bearer'

        if (!accessToken) {
            return buildUnauthorizedResponse()
        }

        const payload = (await apiClient.request(
            'get',
            '/client/billing/payment-methods',
            {},
            false,
            {
                headers: buildAuthHeaders(tokenType, accessToken),
            },
        )) as UpstreamResponse

        if (!resolveSuccess(payload)) {
            return NextResponse.json(
                {
                    status: false,
                    message:
                        payload.message ||
                        'Failed to fetch available payment methods',
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
                    payload.message ||
                    'Payment methods fetched successfully',
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
                    'Failed to fetch available payment methods',
            },
            { status: responseError?.response?.status || 500 },
        )
    }
}
