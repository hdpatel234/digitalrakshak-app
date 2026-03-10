import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

const ALLOWED_FORMATS = new Set(['csv', 'xlsx'])

const resolveApiBaseUrl = () =>
    (
        process.env.API_URL ||
        process.env.NEXT_PUBLIC_API_URL ||
        'http://localhost:8000/api'
    ).replace(/\/+$/, '')

const buildUnauthorizedResponse = () =>
    NextResponse.json(
        {
            status: false,
            message: 'Unauthorized',
        },
        { status: 401 },
    )

const defaultContentTypeByFormat: Record<string, string> = {
    csv: 'text/csv',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}

export async function GET(request: NextRequest) {
    try {
        const session = await auth()
        const accessToken = session?.accessToken || ''
        const tokenType = session?.tokenType || 'Bearer'

        if (!accessToken) {
            return buildUnauthorizedResponse()
        }

        const format = request.nextUrl.searchParams.get('format')?.toLowerCase() || ''

        if (!ALLOWED_FORMATS.has(format)) {
            return NextResponse.json(
                {
                    status: false,
                    message: 'Invalid format. Supported values are csv, xlsx.',
                },
                { status: 400 },
            )
        }

        const upstreamUrl = `${resolveApiBaseUrl()}/client/candidates/import/sample?format=${format}`
        const upstreamResponse = await fetch(upstreamUrl, {
            method: 'GET',
            headers: {
                Accept: 'application/json, text/csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                Authorization: `${tokenType} ${accessToken}`,
            },
            cache: 'no-store',
        })

        if (!upstreamResponse.ok) {
            let message = 'Failed to download sample file'

            try {
                const payload = (await upstreamResponse.json()) as { message?: string }
                if (payload?.message) {
                    message = payload.message
                }
            } catch {
                const fallbackText = await upstreamResponse.text()
                if (fallbackText) {
                    message = fallbackText
                }
            }

            return NextResponse.json(
                {
                    status: false,
                    message,
                },
                { status: upstreamResponse.status },
            )
        }

        const fileBuffer = await upstreamResponse.arrayBuffer()
        const contentType =
            upstreamResponse.headers.get('content-type') ||
            defaultContentTypeByFormat[format] ||
            'application/octet-stream'
        const defaultFilename = `candidate-import-sample.${format}`
        const contentDisposition =
            upstreamResponse.headers.get('content-disposition') ||
            `attachment; filename="${defaultFilename}"`

        return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': contentDisposition,
                'Cache-Control': 'no-store',
            },
        })
    } catch (error: unknown) {
        const responseError = error as {
            message?: string
        }

        return NextResponse.json(
            {
                status: false,
                message: responseError?.message || 'Failed to download sample file',
            },
            { status: 500 },
        )
    }
}
