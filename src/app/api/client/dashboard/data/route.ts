import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import apiClient from '@/services/axios/ApiClient'
import { auth } from '@/auth'

type UpstreamDashboardResponse = {
    status?: boolean | string
    success?: boolean
    message?: string
    data?: unknown
    status_code?: number
    error?: string
    errors?: Record<string, string[]>
}

const resolveSuccess = (payload: UpstreamDashboardResponse) => {
    if (typeof payload.success === 'boolean') {
        return payload.success
    }

    if (typeof payload.status === 'boolean') {
        return payload.status
    }

    if (payload.status === 'success') {
        return true
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

export async function GET(request: NextRequest) {
    try {
        const session = await auth()
        const accessToken = session?.accessToken || ''
        const tokenType = session?.tokenType || 'Bearer'

        if (!accessToken) {
            return buildUnauthorizedResponse()
        }

        const queryPayload = Object.fromEntries(request.nextUrl.searchParams)

        const payload = (await apiClient.request(
            'get',
            '/client/dashboard/data',
            queryPayload,
            false,
            {
                headers: buildAuthHeaders(tokenType, accessToken),
            },
        )) as UpstreamDashboardResponse

        if (!resolveSuccess(payload)) {
            return NextResponse.json(
                {
                    status: false,
                    message: payload.message || 'Failed to fetch dashboard data',
                    ...(payload.data ? { data: payload.data } : {}),
                    ...(payload.error ? { error: payload.error } : {}),
                },
                { status: payload.status_code || 400 },
            )
        }

        return NextResponse.json(
            {
                status: true,
                message: payload.message || 'Dashboard data fetched successfully',
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
                    'Failed to fetch dashboard data',
            },
            { status: responseError?.response?.status || 500 },
        )
    }
}
