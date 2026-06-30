import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import apiClient from '@/services/axios/ApiClient'

type PostalCodeData = {
    id: number
    country_id: number
    state_id: number
    city_id: number
    postal_code: string
}

type PostalCodeResponse = {
    status: boolean
    message: string
    data: PostalCodeData
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const postalCode = searchParams.get('postal_code')

        if (!postalCode) {
            return NextResponse.json(
                {
                    status: false,
                    message: 'postal_code is required',
                },
                { status: 400 },
            )
        }

        const session = await auth()
        const accessToken = session?.accessToken
        const tokenType = session?.tokenType || 'Bearer'
        const endpoint = accessToken ? '/auth/postal-codes' : '/auth/public/postal-codes'

        const response = (await apiClient.request<PostalCodeData>(
            'get',
            endpoint,
            { postal_code: postalCode },
            false,
            {
                headers: accessToken
                    ? { Authorization: `${tokenType} ${accessToken}` }
                    : {},
            },
        )) as PostalCodeResponse

        if (!response.status || !response.data) {
            return NextResponse.json(
                {
                    status: false,
                    message: response.message || 'Failed to get postal code info',
                },
                { status: 404 },
            )
        }

        return NextResponse.json({
            status: true,
            data: response.data,
        })
    } catch (error) {
        console.error('Error fetching postal code info:', error)
        return NextResponse.json(
            {
                status: false,
                message: 'Failed to get postal code info',
            },
            { status: 500 },
        )
    }
}
