import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import apiClient from '@/services/axios/ApiClient'
import type { CreateCandidatePayload } from '@/services/client/candidates'

type UpstreamCandidateResponse = {
    status?: boolean
    success?: boolean
    message?: string
    data?: unknown
    status_code?: number
    error?: string
}

const resolveSuccess = (payload: UpstreamCandidateResponse) => {
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

        const queryPayload = Object.fromEntries(request.nextUrl.searchParams)

        const payload = (await apiClient.request(
            'get',
            '/client/candidates',
            queryPayload,
            false,
            {
                headers: buildAuthHeaders(tokenType, accessToken),
            },
        )) as UpstreamCandidateResponse

        if (!resolveSuccess(payload)) {
            return NextResponse.json(
                {
                    status: false,
                    message: payload.message || 'Failed to fetch candidates',
                    ...(payload.data ? { data: payload.data } : {}),
                    ...(payload.error ? { error: payload.error } : {}),
                },
                { status: payload.status_code || 400 },
            )
        }

        return NextResponse.json(
            {
                status: true,
                message: payload.message || 'Candidates fetched successfully',
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
                    'Failed to fetch candidates',
            },
            { status: responseError?.response?.status || 500 },
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        const accessToken = session?.accessToken || ''
        const tokenType = session?.tokenType || 'Bearer'

        if (!accessToken) {
            return buildUnauthorizedResponse()
        }

        const body = (await request.json()) as CreateCandidatePayload
        const forwardedFor = request.headers.get('x-forwarded-for')
        const realIp = request.headers.get('x-real-ip')
        const cfConnectingIp = request.headers.get('cf-connecting-ip')
        const ipAddress =
            forwardedFor?.split(',')[0]?.trim() ||
            realIp ||
            cfConnectingIp ||
            ''

        const requestPayload = {
            ...body,
            ...(ipAddress ? { ip_address: ipAddress } : {}),
        }

        const payload = (await apiClient.request(
            'post',
            '/client/candidates',
            requestPayload,
            false,
            {
                headers: buildAuthHeaders(tokenType, accessToken),
            },
        )) as UpstreamCandidateResponse

        const isSuccess = resolveSuccess(payload)

        if (!isSuccess) {
            return NextResponse.json(
                {
                    status: false,
                    message: payload.message || 'Failed to create candidate',
                    ...(payload.data ? { data: payload.data } : {}),
                    ...(payload.error ? { error: payload.error } : {}),
                },
                { status: payload.status_code || 400 },
            )
        }

        return NextResponse.json(
            {
                status: true,
                message: payload.message || 'Candidate created successfully',
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
                    'Failed to create candidate',
            },
            { status: responseError?.response?.status || 500 },
        )
    }
}
