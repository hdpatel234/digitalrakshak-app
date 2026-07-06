import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import apiClient from '@/services/axios/ApiClient'

export async function GET(request: NextRequest) {
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

        const payload = (await apiClient.request(
            'get',
            '/auth/permissions',
            null,
            false,
            {
                headers: {
                    Accept: 'application/json',
                    Authorization: `${tokenType} ${accessToken}`,
                },
            },
        )) as any

        return NextResponse.json(
            {
                status: true,
                message: payload.message || 'Permissions retrieved successfully',
                data: payload.data,
            },
            { status: 200 },
        )
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || 
                            error?.message || 
                            'Failed to fetch permissions'
        
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
