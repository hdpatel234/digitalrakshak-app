import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import apiClient from '@/services/axios/ApiClient'

type UpdateConfigPayload = Record<string, string>

export async function POST(request: NextRequest) {
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

        const payload = (await request.json()) as UpdateConfigPayload

        const response = await apiClient.post(
            '/auth/config',
            payload,
            false,
            {
                headers: {
                    Authorization: `${tokenType} ${accessToken}`,
                },
            },
        )

        const statusCode =
            response.status || response.success
                ? 200
                : response.status_code || 400

        return NextResponse.json(response, { status: statusCode })
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            {
                status: false,
                message: 'Failed to update user config',
            },
            { status: 500 },
        )
    }
}
