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
    errors?: Record<string, string[]>
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

const compactPayload = (payload: Record<string, unknown>) =>
    Object.fromEntries(
        Object.entries(payload).filter(([, value]) => {
            if (value === null || value === undefined) {
                return false
            }

            if (typeof value === 'string') {
                return value.trim().length > 0
            }

            if (Array.isArray(value)) {
                return value.length > 0
            }

            return true
        }),
    )

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

        const managerEmails = Array.isArray(body.managerEmails)
            ? body.managerEmails
                  .map((email) => String(email || '').trim())
                  .filter((email) => email.length > 0)
            : []

        const tags = Array.isArray(body.tags)
            ? body.tags
                  .map((tag) =>
                      typeof tag?.value === 'string'
                          ? tag.value.trim()
                          : String(tag?.value || '').trim(),
                  )
                  .filter((tag) => tag.length > 0)
            : []

        const requestPayload = compactPayload({
            first_name: String(body.firstName || '').trim(),
            last_name: String(body.lastName || '').trim(),
            email: String(body.email || '').trim(),
            phone_code: String(body.dialCode || '').trim(),
            phone_number: String(body.phoneNumber || '').trim(),
            country_id: String(body.country || '').trim(),
            state_id: String(body.state || '').trim(),
            city_id: String(body.city || '').trim(),
            address: String(body.address || '').trim(),
            postcode: String(body.postcode || '').trim(),
            manager_emails: managerEmails,
            tags,
            send_invite: Boolean(body.send_invite),
            ...(ipAddress ? { ip_address: ipAddress } : {}),
        })

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
                    ...(payload.errors ? { errors: payload.errors } : {}),
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
                data?: {
                    message?: string
                    error?: string
                    errors?: Record<string, string[]>
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
                    'Failed to create candidate',
                ...(backendData?.errors ? { errors: backendData.errors } : {}),
                ...(backendData ? { details: backendData } : {}),
            },
            { status: responseError?.response?.status || 500 },
        )
    }
}
