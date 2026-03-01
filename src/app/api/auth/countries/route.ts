import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import apiClient from '@/services/axios/ApiClient'

type CountryData = {
    id: number
    name: string
    iso_code_2: string
    iso_code_3: string
    numeric_code: string
    phone_code: string
    currency_code: string
    currency_symbol: string
    capital: string
    continent: string
    flag_icon: string | null
    flag_image: string | null
    latitude: number | null
    longitude: number | null
    timezones: any | null
    postal_code_format: string | null
    postal_code_regex: string | null
    is_active: number
    is_default: number
    display_order: number
    created_by: null
    updated_by: null
    created_at: string
    updated_at: string
    deleted_at: null
}

type CountriesResponse = {
    status: boolean
    message: string
    data: CountryData[]
    timestamp: string
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

        const response = (await apiClient.request<CountryData[]>(
            'get',
            '/auth/countries',
            {},
            false,
            {
                headers: {
                    Authorization: `${tokenType} ${accessToken}`,
                },
            },
        )) as CountriesResponse

        if (!response.status || !response.data) {
            return NextResponse.json(
                {
                    status: false,
                    message: response.message || 'Failed to get countries',
                },
                { status: 400 },
            )
        }

        // Transform the countries data if needed
        const countries = response.data.map(country => ({
            id: country.id,
            name: country.name,
            isoCode2: country.iso_code_2,
            isoCode3: country.iso_code_3,
            phoneCode: country.phone_code,
            currencyCode: country.currency_code,
            currencySymbol: country.currency_symbol,
            capital: country.capital,
            continent: country.continent,
            isDefault: Boolean(country.is_default),
            displayOrder: country.display_order,
        }))

        return NextResponse.json({
            status: true,
            data: countries,
        })
    } catch (error) {
        console.error('Error fetching countries:', error)
        return NextResponse.json(
            {
                status: false,
                message: 'Failed to get countries',
            },
            { status: 500 },
        )
    }
}