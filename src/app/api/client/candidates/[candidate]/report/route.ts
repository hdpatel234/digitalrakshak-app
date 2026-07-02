// Force rebuild
import { NextResponse, NextRequest } from 'next/server'
import { auth } from '@/auth'

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ candidate: string }> },
) {
    const session = await auth()
    const accessToken = session?.accessToken || ''
    const tokenType = session?.tokenType || 'Bearer'

    if (!accessToken) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { candidate } = await context.params
        
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
        const apiUrl = `${backendUrl}/client/candidates/${candidate}/report`

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                Authorization: `${tokenType} ${accessToken}`,
            },
        })

        if (!response.ok) {
            let errorMsg = 'Failed to download report'
            try {
                const errJson = await response.json()
                if (errJson.message) errorMsg = errJson.message
            } catch (e) {
                // ignore json parse error
            }
            return NextResponse.json({ message: errorMsg }, { status: response.status })
        }

        // Forward the response as a stream with the appropriate headers
        const headers = new Headers()
        headers.set('Content-Type', response.headers.get('Content-Type') || 'application/pdf')
        if (response.headers.has('Content-Disposition')) {
            headers.set('Content-Disposition', response.headers.get('Content-Disposition')!)
        } else {
            headers.set('Content-Disposition', `attachment; filename="candidate_report_${candidate}.pdf"`)
        }

        return new NextResponse(response.body, {
            status: response.status,
            headers,
        })
    } catch (error) {
        console.error('Error in candidate report download:', error)
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 },
        )
    }
}
