import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import apiClient from '@/services/axios/ApiClient'

type UpstreamImportResponse = {
    status?: boolean
    success?: boolean
    message?: string
    data?: unknown
    status_code?: number
    error?: string
}

const ALLOWED_EXTENSIONS = ['.csv', '.xlsx']

const resolveSuccess = (payload: UpstreamImportResponse) => {
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
            '/client/candidates/imports',
            queryPayload,
            false,
            {
                headers: {
                    Accept: 'application/json',
                    Authorization: `${tokenType} ${accessToken}`,
                },
            },
        )) as UpstreamImportResponse

        const isSuccess = resolveSuccess(payload)

        if (!isSuccess) {
            return NextResponse.json(
                {
                    status: false,
                    message: payload.message || 'Failed to fetch candidate imports.',
                    ...(payload.data ? { data: payload.data } : {}),
                    ...(payload.error ? { error: payload.error } : {}),
                },
                { status: payload.status_code || 400 },
            )
        }

        return NextResponse.json(
            {
                status: true,
                message: payload.message || 'Candidate imports fetched successfully.',
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
                    'Failed to fetch candidate imports.',
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

        const incomingFormData = await request.formData()
        const file = incomingFormData.get('file')

        if (!(file instanceof File) || file.size <= 0) {
            return NextResponse.json(
                {
                    status: false,
                    message: 'Please upload a valid CSV/XLSX file.',
                },
                { status: 400 },
            )
        }

        const lowerFileName = file.name.toLowerCase()
        const isAllowedFileType = ALLOWED_EXTENSIONS.some((ext) =>
            lowerFileName.endsWith(ext),
        )

        if (!isAllowedFileType) {
            return NextResponse.json(
                {
                    status: false,
                    message: 'Only CSV or XLSX files are allowed.',
                },
                { status: 400 },
            )
        }

        const upstreamFormData = new FormData()
        upstreamFormData.append('file', file, file.name)

        const payload = (await apiClient.request(
            'post',
            '/client/candidates/import',
            upstreamFormData,
            false,
            {
                headers: {
                    Accept: 'application/json',
                    Authorization: `${tokenType} ${accessToken}`,
                },
            },
        )) as UpstreamImportResponse

        const isSuccess = resolveSuccess(payload)

        if (!isSuccess) {
            return NextResponse.json(
                {
                    status: false,
                    message: payload.message || 'Failed to import candidates.',
                    ...(payload.data ? { data: payload.data } : {}),
                    ...(payload.error ? { error: payload.error } : {}),
                },
                { status: payload.status_code || 400 },
            )
        }

        return NextResponse.json(
            {
                status: true,
                message: payload.message || 'Candidates imported successfully.',
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
                    'Failed to import candidates.',
            },
            { status: responseError?.response?.status || 500 },
        )
    }
}
