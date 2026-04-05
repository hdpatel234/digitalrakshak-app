import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import apiClient from '@/services/axios/ApiClient'

type UpstreamResponse = {
    status?: boolean
    success?: boolean
    message?: string
    data?: unknown
    status_code?: number
    error?: string
    errors?: Record<string, string[]>
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

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        const accessToken = session?.accessToken || ''
        const tokenType = session?.tokenType || 'Bearer'

        if (!accessToken) {
            return buildUnauthorizedResponse()
        }

        const { id } = await context.params

        const payload = (await apiClient.request('get', `client/settings/users/${id}`, null, false, {
            headers: buildAuthHeaders(tokenType, accessToken),
        })) as UpstreamResponse

        if (!resolveSuccess(payload)) {
            return NextResponse.json(
                {
                    status: false,
                    message: payload.message || 'Failed to fetch team member',
                    ...(payload.data ? { data: payload.data } : {}),
                },
                { status: payload.status_code || 400 },
            )
        }

        return NextResponse.json(
            {
                status: true,
                message: payload.message || 'Team member fetched successfully',
                ...(payload.data ? { data: payload.data } : {}),
            },
            { status: 200 },
        )
    } catch (error: unknown) {
        const responseError = error as {
            response?: {
                data?: {
                    message?: string
                    error?: string
                }
                status?: number
            }
            message?: string
        }

        const backendData = responseError?.response?.data

        return NextResponse.json(
            {
                status: false,
                message:
                    backendData?.message ||
                    backendData?.error ||
                    responseError?.message ||
                    'Failed to fetch team member',
                ...(backendData ? { details: backendData } : {}),
            },
            { status: responseError?.response?.status || 500 },
        )
    }
}

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        const accessToken = session?.accessToken || ''
        const tokenType = session?.tokenType || 'Bearer'

        if (!accessToken) {
            return buildUnauthorizedResponse()
        }

        const { id } = await context.params
        const body = await request.json()

        const payload = (await apiClient.request('put', `client/settings/users/${id}`, body, false, {
            headers: buildAuthHeaders(tokenType, accessToken),
        })) as UpstreamResponse

        if (!resolveSuccess(payload)) {
            return NextResponse.json(
                {
                    status: false,
                    message: payload.message || 'Failed to update team member',
                    ...(payload.data ? { data: payload.data } : {}),
                },
                { status: payload.status_code || 400 },
            )
        }

        return NextResponse.json(
            {
                status: true,
                message: payload.message || 'Team member updated successfully',
                ...(payload.data ? { data: payload.data } : {}),
            },
            { status: 200 },
        )
    } catch (error: unknown) {
        const responseError = error as {
            response?: {
                data?: {
                    message?: string
                    error?: string
                }
                status?: number
            }
            message?: string
        }

        const backendData = responseError?.response?.data

        return NextResponse.json(
            {
                status: false,
                message:
                    backendData?.message ||
                    backendData?.error ||
                    responseError?.message ||
                    'Failed to update team member',
                ...(backendData ? { details: backendData } : {}),
            },
            { status: responseError?.response?.status || 500 },
        )
    }
}
