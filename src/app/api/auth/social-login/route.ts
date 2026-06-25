import { NextResponse } from 'next/server'
import apiClient from '@/services/axios/ApiClient'

type SocialLoginResponse = {
    status: boolean
    message: string
    data: {
        url: string
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const provider = body.provider

        const response = (await apiClient.post(
            '/auth/social-login',
            { provider },
            false,
        )) as SocialLoginResponse

        if (!response.status || !response.data?.url) {
            return NextResponse.json(
                {
                    status: false,
                    message:
                        response.message || 'Failed to get authorization url',
                },
                { status: 400 },
            )
        }

        return NextResponse.json({
            status: true,
            url: response.data.url,
        })
    } catch (error: any) {
        console.error('Error in social login:', error)
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 },
        )
    }
}
