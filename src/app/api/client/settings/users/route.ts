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

export async function GET(request: NextRequest) {
    try {
        const session = await auth()
        const accessToken = session?.accessToken || ''
        const tokenType = session?.tokenType || 'Bearer'

        if (!accessToken) {
            return buildUnauthorizedResponse()
        }

        const { searchParams } = new URL(request.url)
        const params: Record<string, string> = {}
        searchParams.forEach((value, key) => {
            params[key] = value
        })

        const payload = (await apiClient.request('get', 'client/settings/users', null, false, {
            headers: buildAuthHeaders(tokenType, accessToken),
            params,
        })) as UpstreamResponse

        if (!resolveSuccess(payload)) {
            return NextResponse.json(
                {
                    status: false,
                    message: payload.message || 'Failed to fetch team members',
                    ...(payload.data ? { data: payload.data } : {}),
                },
                { status: payload.status_code || 400 },
            )
        }

        return NextResponse.json(
            {
                status: true,
                message: payload.message || 'Team members fetched successfully',
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
                    'Failed to fetch team members',
                ...(backendData ? { details: backendData } : {}),
            },
            { status: responseError?.response?.status || 500 },
        )
    }
}
