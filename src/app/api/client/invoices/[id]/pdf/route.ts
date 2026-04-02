import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> | { id: string } }
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

        // Handle params for both Next.js 14 and 15+
        const resolvedParams = await context.params
        const id = resolvedParams.id

        const baseUrl =
            process.env.API_URL ||
            process.env.NEXT_PUBLIC_API_URL ||
            'http://localhost:8000/api'
        const normalizedBaseUrl = baseUrl.replace(/\/+$/, '')

        const url = `${normalizedBaseUrl}/client/invoices/${id}/pdf`

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
            `attachment; filename="invoice_${id}.pdf"`
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
