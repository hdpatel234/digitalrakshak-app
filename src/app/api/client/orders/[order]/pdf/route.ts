import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ order: string }> | { order: string } }
) {
    try {
        const session = await auth()
        const accessToken = session?.accessToken || ''
        const tokenType = session?.tokenType || 'Bearer'

        if (!accessToken) {
            return NextResponse.json(
                { status: false, message: 'Unauthorized' },
                { status: 401 }
            )
        }

        const resolvedParams = await context.params
        const orderId = resolvedParams.order

        const baseUrl =
            process.env.API_URL ||
            process.env.NEXT_PUBLIC_API_URL ||
            'http://localhost:8000/api'
        const normalizedBaseUrl = baseUrl.replace(/\/+$/, '')

        const url = `${normalizedBaseUrl}/client/orders/${orderId}/pdf`

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `${tokenType} ${accessToken}`,
            },
        })

        if (!response.ok) {
            let errorMessage = 'Failed to download PDF'
            try {
                const errorData = await response.json()
                errorMessage = errorData?.message || errorMessage
            } catch {
                // Ignore
            }

            return NextResponse.json(
                { status: false, message: errorMessage },
                { status: response.status }
            )
        }

        const headers = new Headers(response.headers)
        headers.set(
            'Content-Disposition',
            `attachment; filename="order_${orderId}.pdf"`
        )
        headers.set('Content-Type', 'application/pdf')

        return new NextResponse(response.body, {
            status: 200,
            headers,
        })
    } catch (error: any) {
        return NextResponse.json(
            { status: false, message: error?.message || 'Failed to download PDF' },
            { status: 500 }
        )
    }
}
