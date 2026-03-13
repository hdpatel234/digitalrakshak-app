import { NextResponse } from 'next/server'

type UpstreamInvitationResponse = {
    status?: boolean
    success?: boolean
    message?: string
    data?: unknown
    status_code?: number
    error?: string
}

const resolveSuccess = (payload: UpstreamInvitationResponse) => {
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

export async function GET(
    _request: Request,
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
                    data: [],
                },
                { status: 400 },
            )
        }

        const baseUrl = resolveApiBaseUrl()
        const upstreamUrl = `${baseUrl}/client/invitations/${encodeURIComponent(invitationToken)}`

        const upstreamResponse = await fetch(upstreamUrl, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
            cache: 'no-store',
        })

        const rawBody = await upstreamResponse.text()
        let payload: UpstreamInvitationResponse = {}

        try {
            payload = rawBody
                ? (JSON.parse(rawBody) as UpstreamInvitationResponse)
                : {}
        } catch {
            console.error('[invitation-by-token] invalid JSON response', rawBody)
            return NextResponse.json(
                {
                    status: false,
                    message: 'Invalid response from invitation API',
                    error: rawBody || 'Empty response',
                    data: [],
                },
                { status: upstreamResponse.status || 502 },
            )
        }

        if (!resolveSuccess(payload)) {
            return NextResponse.json(
                {
                    status: false,
                    message:
                        payload.message ||
                        'Invitation not found or token is invalid.',
                    ...(payload.data ? { data: payload.data } : { data: [] }),
                    ...(payload.error ? { error: payload.error } : {}),
                },
                {
                    status:
                        payload.status_code || upstreamResponse.status || 404,
                },
            )
        }

        return NextResponse.json(
            {
                status: true,
                message: payload.message || 'Invitation fetched successfully',
                ...(payload.data ? { data: payload.data } : {}),
            },
            { status: 200 },
        )
    } catch (error: unknown) {
        console.error('[invitation-by-token] fetch error:', error)
        return NextResponse.json(
            {
                status: false,
                message: 'Failed to fetch invitation',
                data: [],
            },
            { status: 500 },
        )
    }
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
                    data: [],
                },
                { status: 400 },
            )
        }

        const body = await request.json()
        const baseUrl = resolveApiBaseUrl()
        const upstreamUrl = `${baseUrl}/client/invitations/${encodeURIComponent(invitationToken)}`

        const upstreamResponse = await fetch(upstreamUrl, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
            cache: 'no-store',
        })

        const rawBody = await upstreamResponse.text()
        let payload: UpstreamInvitationResponse = {}

        try {
            payload = rawBody
                ? (JSON.parse(rawBody) as UpstreamInvitationResponse)
                : {}
        } catch {
            return NextResponse.json(
                {
                    status: false,
                    message: 'Invalid response from invitation API',
                    error: rawBody || 'Empty response',
                    data: [],
                },
                { status: upstreamResponse.status || 502 },
            )
        }

        if (!resolveSuccess(payload)) {
            return NextResponse.json(
                {
                    status: false,
                    message: payload.message || 'Failed to submit invitation',
                    ...(payload.data ? { data: payload.data } : { data: [] }),
                    ...(payload.error ? { error: payload.error } : {}),
                },
                {
                    status:
                        payload.status_code || upstreamResponse.status || 400,
                },
            )
        }

        return NextResponse.json(
            {
                status: true,
                message: payload.message || 'Invitation submitted successfully',
                ...(payload.data ? { data: payload.data } : {}),
            },
            { status: 200 },
        )
    } catch (error: unknown) {
        console.error('[invitation-by-token] submit error:', error)
        return NextResponse.json(
            {
                status: false,
                message: 'Failed to submit invitation',
                data: [],
            },
            { status: 500 },
        )
    }
}
