import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import apiClient from '@/services/axios/ApiClient'

type RawStateData = {
    id: number
    name?: string
    state_name?: string
}

type StatesResponse = {
    status: boolean
    message: string
    data: RawStateData[]
    timestamp: string
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const countryId = searchParams.get('country_id')

        if (!countryId) {
            return NextResponse.json(
                {
                    status: false,
                    message: 'country_id is required',
                },
                { status: 400 },
            )
        }

        const session = await auth()
        const accessToken = session?.accessToken
        const tokenType = session?.tokenType || 'Bearer'
        const endpoint = accessToken ? '/auth/states' : '/auth/public/states'

        const response = (await apiClient.request<RawStateData[]>(
            'get',
            endpoint,
            { country_id: countryId },
            false,
            {
                headers: accessToken
                    ? { Authorization: `${tokenType} ${accessToken}` }
                    : {},
            },
        )) as StatesResponse

        if (!response.status || !response.data) {
            return NextResponse.json(
                {
                    status: false,
                    message: response.message || 'Failed to get states',
                },
                { status: 400 },
            )
        }

        const states = response.data.map((state) => ({
            id: state.id,
            name: state.name || state.state_name || '',
        }))

        return NextResponse.json({
            status: true,
            data: states,
        })
    } catch (error) {
        console.error('Error fetching states:', error)
        return NextResponse.json(
            {
                status: false,
                message: 'Failed to get states',
            },
            { status: 500 },
        )
    }
}
