import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

const getApiBaseUrl = () =>
    (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || '').replace(
        /\/+$/,
        '',
    )

export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        const authHeader = request.headers.get('authorization') || ''
        const [headerTokenType, headerAccessToken] = authHeader.split(' ')
        const accessToken = session?.accessToken || headerAccessToken || ''
        const tokenType =
            session?.tokenType || headerTokenType || 'Bearer'
        const apiBaseUrl = getApiBaseUrl()

        if (!accessToken || !apiBaseUrl) {
            return NextResponse.json(
                {
                    status: false,
                    message: 'Unauthorized',
                },
                { status: 401 },
            )
        }

        const response = await fetch(`${apiBaseUrl}/auth/logout`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `${tokenType} ${accessToken}`,
            },
            cache: 'no-store',
        })

        const payload = (await response.json().catch(() => null)) as
            | {
                  status?: boolean
                  success?: boolean
                  message?: string
              }
            | null

        return NextResponse.json(
            payload || {
                status: response.ok,
                message: response.ok ? 'Logged out' : 'Logout failed',
            },
            { status: response.status || 200 },
        )
    } catch {
        return NextResponse.json(
            {
                status: false,
                message: 'Failed to logout user',
            },
            { status: 500 },
        )
    }
}
