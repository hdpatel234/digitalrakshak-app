import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import apiClient from '@/services/axios/ApiClient'

type ChangePasswordResponse = {
    status?: boolean
    success?: boolean
    message?: string
    data?: unknown
    status_code?: number
    error?: string
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        const accessToken = session?.accessToken || ''
        const tokenType = session?.tokenType || 'Bearer'

        if (!accessToken) {
            return NextResponse.json(
                {
                    status: false,
                    message: 'Unauthorized',
                },
                { status: 401 },
            )
        }

        const body = await request.json()
        const currentPassword =
            typeof body?.current_password === 'string'
                ? body.current_password
                : ''
        const newPassword =
            typeof body?.new_password === 'string' ? body.new_password : ''

        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                {
                    status: false,
                    message:
                        'current_password and new_password are required fields',
                },
                { status: 400 },
            )
        }

        const payload = (await apiClient.post(
            '/auth/change-password',
            {
                current_password: currentPassword,
                new_password: newPassword,
            },
            false,
            {
                headers: {
                    Accept: 'application/json',
                    Authorization: `${tokenType} ${accessToken}`,
                },
            },
        )) as ChangePasswordResponse

        const isSuccess =
            typeof payload.success === 'boolean'
                ? payload.success
                : typeof payload.status === 'boolean'
                  ? payload.status
                  : false

        if (!isSuccess) {
            return NextResponse.json(
                {
                    status: false,
                    message: payload.message || 'Failed to change password',
                    ...(payload.data ? { data: payload.data } : {}),
                    ...(payload.error ? { error: payload.error } : {}),
                },
                { status: payload.status_code || 400 },
            )
        }

        return NextResponse.json(
            {
                status: true,
                message: payload.message || 'Password changed successfully',
                ...(payload.data ? { data: payload.data } : {}),
            },
            { status: 200 },
        )
    } catch (error: any) {
        const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            'Failed to change password'

        return NextResponse.json(
            {
                status: false,
                message: errorMessage,
                ...(error?.response?.data
                    ? { details: error.response.data }
                    : {}),
            },
            { status: error?.response?.status || 500 },
        )
    }
}
