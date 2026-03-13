import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import apiClient from '@/services/axios/ApiClient'

type RawCityData = {
    id: number
    name?: string
    city_name?: string
}

type CitiesResponse = {
    status: boolean
    message: string
    data: RawCityData[]
    timestamp: string
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const stateId = searchParams.get('state_id')

        if (!stateId) {
            return NextResponse.json(
                {
                    status: false,
                    message: 'state_id is required',
                },
                { status: 400 },
            )
        }

        const session = await auth()
        const accessToken = session?.accessToken
        const tokenType = session?.tokenType || 'Bearer'
        const endpoint = accessToken ? '/auth/cities' : '/auth/public/cities'

        const response = (await apiClient.request<RawCityData[]>(
            'get',
            endpoint,
            { state_id: stateId },
            false,
            {
                headers: accessToken
                    ? { Authorization: `${tokenType} ${accessToken}` }
                    : {},
            },
        )) as CitiesResponse

        if (!response.status || !response.data) {
            return NextResponse.json(
                {
                    status: false,
                    message: response.message || 'Failed to get cities',
                },
                { status: 400 },
            )
        }

        const cities = response.data.map((city) => ({
            id: city.id,
            name: city.name || city.city_name || '',
        }))

        return NextResponse.json({
            status: true,
            data: cities,
        })
    } catch (error) {
        console.error('Error fetching cities:', error)
        return NextResponse.json(
            {
                status: false,
                message: 'Failed to get cities',
            },
            { status: 500 },
        )
    }
}
