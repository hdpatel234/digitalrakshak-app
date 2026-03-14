import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import apiClient from '@/services/axios/ApiClient'

type UpstreamResponse = {
    status?: boolean
    success?: boolean
    message?: string
    data?: unknown
    status_code?: number
    error?: string
}

const resolveSuccess = (payload: UpstreamResponse) => {
    if (typeof payload.success === 'boolean') {
        return payload.success
    }

    if (typeof payload.status === 'boolean') {
        return payload.status
    }

    return false
}

const buildUnauthorizedResponse = () =>
    NextResponse.json(
        {
            status: false,
            message: 'Unauthorized',
        },
        { status: 401 },
    )

const buildAuthHeaders = (tokenType: string, accessToken: string) => ({
    Accept: 'application/json',
    Authorization: `${tokenType} ${accessToken}`,
})

export async function GET(
    _request: NextRequest,
    context: { params: Promise<{ payment_method: string }> },
) {
    try {
        const { payment_method: paymentMethodParam } = await context.params
        const paymentMethodId = Number.parseInt(paymentMethodParam, 10)

        if (!Number.isInteger(paymentMethodId) || paymentMethodId <= 0) {
            return NextResponse.json(
                {
                    status: false,
                    message: 'Invalid payment method id',
                },
                { status: 400 },
            )
        }

        const session = await auth()
        const accessToken = session?.accessToken || ''
        const tokenType = session?.tokenType || 'Bearer'

        if (!accessToken) {
            return buildUnauthorizedResponse()
        }

        const payload = (await apiClient.request(
            'get',
            `/client/billing/${paymentMethodId}/payment-gateways`,
            {},
            false,
            {
                headers: buildAuthHeaders(tokenType, accessToken),
            },
        )) as UpstreamResponse

        if (!resolveSuccess(payload)) {
            return NextResponse.json(
                {
                    status: false,
                    message:
                        payload.message ||
                        'Failed to fetch payment gateways',
                    ...(payload.data ? { data: payload.data } : {}),
                    ...(payload.error ? { error: payload.error } : {}),
                },
                { status: payload.status_code || 400 },
            )
        }

        return NextResponse.json(
            {
                status: true,
                message:
                    payload.message ||
                    'Payment gateways fetched successfully',
                ...(payload.data ? { data: payload.data } : {}),
            },
            { status: 200 },
        )
    } catch (error: unknown) {
        const responseError = error as {
            response?: {
                data?: { message?: string }
                status?: number
            }
            message?: string
        }

        return NextResponse.json(
            {
                status: false,
                message:
                    responseError?.response?.data?.message ||
                    responseError?.message ||
                    'Failed to fetch payment gateways',
            },
            { status: responseError?.response?.status || 500 },
        )
    }
}
