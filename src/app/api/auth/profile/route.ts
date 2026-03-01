import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import apiClient from '@/services/axios/ApiClient'

type UpstreamProfileResponse = {
    status?: boolean
    success?: boolean
    message?: string
    data?: unknown
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

        const incomingFormData = await request.formData()
        const upstreamFormData = new FormData()

        const fields = [
            'first_name',
            'last_name',
            'email',
            'phone_code',
            'phone',
            'remove_logo',
        ]
        for (const key of fields) {
            const value = incomingFormData.get(key)
            if (typeof value === 'string') {
                upstreamFormData.append(key, value)
            }
        }

        const avatar = incomingFormData.get('avatar')
        if (avatar instanceof File && avatar.size > 0) {
            upstreamFormData.append('avatar', avatar, avatar.name)
        }

        const payload = (await apiClient.request(
            'post',
            '/auth/profile',
            upstreamFormData,
            false,
            {
                headers: {
                    Accept: 'application/json',
                    Authorization: `${tokenType} ${accessToken}`,
                },
            },
        )) as UpstreamProfileResponse & { status_code?: number }

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
                    message: payload.message || 'Failed to update profile',
                    ...(payload.data ? { data: payload.data } : {}),
                },
                { status: payload.status_code || 400 },
            )
        }

        return NextResponse.json(
            {
                status: true,
                message: payload.message || 'Profile updated successfully',
                ...(payload.data ? { data: payload.data } : {}),
            },
            { status: 200 },
        )
    } catch {
        return NextResponse.json(
            {
                status: false,
                message: 'Failed to update profile',
            },
            { status: 500 },
        )
    }
}
