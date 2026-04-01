import { NextResponse } from 'next/server'

type UpstreamParseResponse = {
    status?: boolean
    success?: boolean
    message?: string
    data?: unknown
    status_code?: number
    error?: string
}

const resolveSuccess = (payload: UpstreamParseResponse) => {
    if (typeof payload.success === 'boolean') {
        return payload.success
    }

    if (typeof payload.status === 'boolean') {
        return payload.status
    }

    return false
}

const resolveApiBaseUrl = () => {
    const baseUrl =
        process.env.API_URL ||
        process.env.NEXT_PUBLIC_API_URL ||
        'http://localhost:8000/api'
    return baseUrl.replace(/\/+$/, '')
}

export async function POST(
    request: Request,
    context: { params: Promise<{ token: string }> },
) {
    try {
        const { token } = await context.params
        const invitationToken = String(token || '').trim()

        if (!invitationToken) {
            return NextResponse.json(
                {
                    status: false,
                    message: 'Invitation token is required',
                },
                { status: 400 },
            )
        }

        const formData = await request.formData()
        const file = formData.get('resume')

        if (!file) {
            return NextResponse.json(
                {
                    status: false,
                    message: 'Resume file is required',
                },
                { status: 400 },
            )
        }

        const baseUrl = resolveApiBaseUrl()
        const upstreamUrl = `${baseUrl}/client/invitations/${encodeURIComponent(invitationToken)}/parse-resume`

        const upstreamResponse = await fetch(upstreamUrl, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: formData,
            cache: 'no-store',
        })

        const rawBody = await upstreamResponse.text()
        let payload: UpstreamParseResponse = {}

        try {
            payload = rawBody
                ? (JSON.parse(rawBody) as UpstreamParseResponse)
                : {}
        } catch {
            console.error('[invitation-parse-resume] invalid JSON response', rawBody)
            return NextResponse.json(
                {
                    status: false,
                    message: 'Invalid response from invitation API',
                    error: rawBody || 'Empty response',
                },
                { status: upstreamResponse.status || 502 },
            )
        }

        if (!resolveSuccess(payload)) {
            return NextResponse.json(
                {
                    status: false,
                    message: payload.message || 'Failed to parse resume',
                    ...(payload.data ? { data: payload.data } : {}),
                    ...(payload.error ? { error: payload.error } : {}),
                },
                {
                    status: payload.status_code || upstreamResponse.status || 400,
                },
            )
        }

        return NextResponse.json(
            {
                status: true,
                message: payload.message || 'Resume parsed successfully',
                ...(payload.data ? { data: payload.data } : {}),
            },
            { status: 200 },
        )
    } catch (error: unknown) {
        console.error('[invitation-parse-resume] submit error:', error)
        return NextResponse.json(
            {
                status: false,
                message: 'Failed to parse resume',
            },
            { status: 500 },
        )
    }
}
