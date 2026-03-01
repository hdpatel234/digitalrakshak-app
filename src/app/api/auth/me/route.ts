import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import apiClient from '@/services/axios/ApiClient'

type AuthMeData = {
    id?: number | string
    first_name?: string | null
    last_name?: string | null
    email?: string | null
    phone_code?: string | number | null
    phone?: string | number | null
    avatar?: string | null
}

type AuthMeResponse = {
    status?: boolean
    success?: boolean
    message?: string
    status_code?: number
    data?: AuthMeData
}

export async function GET() {
    try {
        const session = await auth()
        const accessToken = session?.accessToken
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

        const response = (await apiClient.request<AuthMeData>(
            'get',
            '/auth/me',
            {},
            false,
            {
                headers: {
                    Authorization: `${tokenType} ${accessToken}`,
                },
            },
        )) as AuthMeResponse

        const isSuccess =
            typeof response.success === 'boolean'
                ? response.success
                : Boolean(response.status)

        if (!isSuccess || !response.data) {
            return NextResponse.json(
                {
                    status: false,
                    message: response.message || 'Failed to get profile',
                },
                { status: response.status_code || 400 },
            )
        }

        const user = response.data

        return NextResponse.json({
            id: String(user.id ?? ''),
            name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
            firstName: user.first_name || '',
            lastName: user.last_name || '',
            email: user.email || '',
            img: user.avatar || '',
            location: '',
            address: '',
            postcode: '',
            city: '',
            country: '',
            dialCode:
                user.phone_code !== undefined && user.phone_code !== null
                    ? String(user.phone_code)
                    : '',
            birthday: '',
            phoneNumber:
                user.phone !== undefined && user.phone !== null
                    ? String(user.phone)
                    : '',
        })
    } catch {
        return NextResponse.json(
            {
                status: false,
                message: 'Failed to get current user profile',
            },
            { status: 500 },
        )
    }
}
