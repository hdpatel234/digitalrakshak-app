import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import apiClient from '@/services/axios/ApiClient'

type UpstreamProfileResponse = {
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

        // Check for 500 error
        if (payload.status_code === 500) {
            // Return exact error message from backend
            return NextResponse.json(
                {
                    status: false,
                    message: payload.message || 'Internal server error',
                    ...(payload.error ? { error: payload.error } : {}),
                    ...(payload.data ? { data: payload.data } : {}),
                },
                { status: 500 },
            )
        }

        const isSuccess =
            typeof payload.success === 'boolean'
                ? payload.success
                : typeof payload.status === 'boolean'
                  ? payload.status
                  : false

        if (!isSuccess) {
            // For non-500 errors, return backend message with higher priority
            return NextResponse.json(
                {
                    status: false,
                    // Backend message takes priority, fallback to generic message
                    message: payload.message || 'Failed to update profile',
                    ...(payload.data ? { data: payload.data } : {}),
                    // Include any additional error details from backend
                    ...(payload.error ? { error: payload.error } : {}),
                },
                { status: payload.status_code || 400 },
            )
        }

        // For success responses, use backend message
        return NextResponse.json(
            {
                status: true,
                // Backend message takes priority, fallback to generic success message
                message: payload.message || 'Profile updated successfully',
                ...(payload.data ? { data: payload.data } : {}),
            },
            { status: 200 },
        )
    } catch (error: any) {
        // Check if error response contains specific error message
        const errorMessage = error?.response?.data?.message || 
                            error?.message || 
                            'Failed to update profile'
        
        return NextResponse.json(
            {
                status: false,
                message: errorMessage,
                ...(error?.response?.data ? { details: error.response.data } : {}),
            },
            { status: error?.response?.status || 500 },
        )
    }
}