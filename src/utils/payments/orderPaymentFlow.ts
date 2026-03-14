type ApiResponsePayload = {
    status?: boolean
    success?: boolean
    message?: string
    data?: unknown
}

type PaymentContext = {
    providerName: string
    normalizedProvider: string
    totalAmount: number
    totalAmountInPaise: number
    orderId: string
    checkoutUrl: string
    rawData: Record<string, unknown>
}

type StartPaymentFlowParams = {
    orderId: string
    initBody?: Record<string, unknown>
    fetchOrderDetails?: boolean
    onInitError: (message: string) => void
    onVerificationSuccess: (message: string) => void
    onVerificationError: (message: string) => void
    onDismiss?: () => void
}

const mapApiSuccess = (payload: ApiResponsePayload) =>
    payload.status === true || payload.success === true

const normalizeProviderName = (value: string) =>
    value
        .toLowerCase()
        .replace(/_/g, '-')
        .replace(/\s+/g, '-')
        .trim()

const buildPaymentContext = (data: unknown): PaymentContext => {
    const record =
        data && typeof data === 'object'
            ? (data as Record<string, unknown>)
            : {}
    const paymentProvider =
        record.payment_provider && typeof record.payment_provider === 'object'
            ? (record.payment_provider as Record<string, unknown>)
            : {}
    const gateway =
        record.gateway && typeof record.gateway === 'object'
            ? (record.gateway as Record<string, unknown>)
            : {}
    const providerName = String(
        paymentProvider.code ??
            paymentProvider.name ??
            record.payment_provider_name ??
            record.payment_provider ??
            record.payment_gateway ??
            record.gateway_name ??
            '',
    ).trim()
    const totalAmountValue =
        record.total_amount ??
        record.totalAmount ??
        record.amount ??
        record.payment_amount ??
        0
    const totalAmountInPaiseValue =
        record.total_amount_in_paise ??
        record.totalAmountInPaise ??
        record.amount_in_paise ??
        record.amount_paise ??
        0
    const orderId = String(
        record.order_id ?? record.orderId ?? record.id ?? '',
    ).trim()
    const checkoutUrl = String(
        record.payment_redirect_url ??
            record.checkout_url ??
            record.payment_url ??
            record.redirect_url ??
            '',
    ).trim()

    return {
        providerName,
        normalizedProvider: normalizeProviderName(providerName),
        totalAmount: Number.isFinite(Number(totalAmountValue))
            ? Number(totalAmountValue)
            : 0,
        totalAmountInPaise: Number.isFinite(Number(totalAmountInPaiseValue))
            ? Number(totalAmountInPaiseValue)
            : 0,
        orderId,
        checkoutUrl,
        rawData: {
            ...record,
            payment_provider: paymentProvider,
            gateway,
        },
    }
}

const initiateOrderPayment = async (
    orderId: string,
    body: Record<string, unknown>,
) => {
    const response = await fetch(`/api/client/orders/${orderId}/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })

    const payload = ((await response.json()) as ApiResponsePayload) || {}

    return {
        responseOk: response.ok,
        payload,
    }
}

const completeOrderPayment = async (
    orderId: string,
    body: Record<string, unknown>,
) => {
    const response = await fetch(
        `/api/client/orders/${orderId}/payment/complete`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        },
    )

    const payload = ((await response.json()) as ApiResponsePayload) || {}

    return {
        responseOk: response.ok,
        payload,
    }
}

const getOrderDetails = async (orderId: string) => {
    const response = await fetch(`/api/client/orders/${orderId}`, {
        method: 'GET',
        cache: 'no-store',
    })

    const payload = ((await response.json()) as ApiResponsePayload) || {}

    return {
        responseOk: response.ok,
        payload,
    }
}

const buildInitBodyFromOrderDetails = (data: unknown) => {
    const record =
        data && typeof data === 'object'
            ? (data as Record<string, unknown>)
            : {}
    const order =
        record.order && typeof record.order === 'object'
            ? (record.order as Record<string, unknown>)
            : {}
    const paymentGateway =
        record.payment_gateway && typeof record.payment_gateway === 'object'
            ? (record.payment_gateway as Record<string, unknown>)
            : {}
    const gateway =
        paymentGateway.gateway && typeof paymentGateway.gateway === 'object'
            ? (paymentGateway.gateway as Record<string, unknown>)
            : {}
    const providerName = String(
        gateway.gateway_code ?? gateway.gateway_name ?? '',
    ).trim()
    const totalAmount = Number(order.total_amount ?? 0) || 0
    const totalAmountInPaise = Number(order.total_amount_in_paise ?? 0) || 0

    const initBody: Record<string, unknown> = {}
    if (providerName) {
        initBody.payment_provider_name = providerName
    }
    if (totalAmount) {
        initBody.total_amount = totalAmount
    }
    if (totalAmountInPaise) {
        initBody.total_amount_in_paise = totalAmountInPaise
    }

    return initBody
}

const loadScript = (src: string) =>
    new Promise<boolean>((resolve) => {
        const existing = document.querySelector(`script[src="${src}"]`)
        if (existing) {
            resolve(true)
            return
        }
        const script = document.createElement('script')
        script.src = src
        script.async = true
        script.onload = () => resolve(true)
        script.onerror = () => resolve(false)
        document.body.appendChild(script)
    })

export const startOrderPaymentFlow = async ({
    orderId,
    initBody = {},
    fetchOrderDetails = false,
    onInitError,
    onVerificationSuccess,
    onVerificationError,
    onDismiss,
}: StartPaymentFlowParams): Promise<boolean> => {
    if (!orderId) {
        onInitError('Order id is missing.')
        return false
    }

    let resolvedInitBody = { ...initBody }

    if (fetchOrderDetails) {
        const orderDetailsResult = await getOrderDetails(orderId)
        if (
            !orderDetailsResult ||
            !orderDetailsResult.responseOk ||
            !mapApiSuccess(orderDetailsResult.payload)
        ) {
            onInitError(
                orderDetailsResult?.payload?.message ||
                    'Failed to fetch order details.',
            )
            return false
        }

        const initFromOrder = buildInitBodyFromOrderDetails(
            orderDetailsResult.payload.data,
        )
        resolvedInitBody = { ...resolvedInitBody, ...initFromOrder }
    }

    const paymentInitResult = await initiateOrderPayment(
        orderId,
        resolvedInitBody,
    )

    if (
        !paymentInitResult ||
        !paymentInitResult.responseOk ||
        !mapApiSuccess(paymentInitResult.payload)
    ) {
        onInitError(
            paymentInitResult?.payload?.message ||
                'Failed to initialize payment.',
        )
        return false
    }

    const paymentContext = buildPaymentContext(paymentInitResult.payload.data)

    if (!paymentContext.providerName) {
        onInitError('Payment provider is missing.')
        return false
    }

    if (paymentContext.checkoutUrl) {
        window.location.href = paymentContext.checkoutUrl
        return true
    }

    if (paymentContext.normalizedProvider !== 'razorpay') {
        onInitError('Unsupported payment provider.')
        return false
    }

    const rawData = paymentContext.rawData
    const gateway =
        rawData.gateway && typeof rawData.gateway === 'object'
            ? (rawData.gateway as Record<string, unknown>)
            : {}
    const key = String(
        gateway.key ??
            rawData.razorpay_key ??
            rawData.razorpay_key_id ??
            rawData.key_id ??
            rawData.key ??
            '',
    ).trim()
    const razorpayOrderId = String(
        gateway.gateway_order_id ??
            gateway.order_id ??
            rawData.razorpay_order_id ??
            rawData.razorpayOrderId ??
            rawData.order_id ??
            '',
    ).trim()
    const currency = String(
        gateway.currency ?? rawData.currency ?? 'INR',
    ).trim()
    const rawAmount =
        gateway.amount_in_paise ??
        gateway.amount ??
        rawData.amount_in_paise ??
        rawData.amount ??
        rawData.total_amount_in_paise ??
        rawData.total_amount ??
        paymentContext.totalAmountInPaise ??
        paymentContext.totalAmount
    const amountValue = Number(rawAmount)
    const amount = Number.isFinite(amountValue) ? amountValue : 0
    const themeColor =
        getComputedStyle(document.documentElement)
            .getPropertyValue('--primary')
            .trim() || '#000'

    if (!key || !razorpayOrderId || !amount) {
        onInitError('Payment details are incomplete.')
        return false
    }

    const loaded = await loadScript(
        'https://checkout.razorpay.com/v1/checkout.js',
    )
    if (!loaded) {
        onInitError('Failed to load Razorpay checkout.')
        return false
    }

    const options = {
        key,
        amount:
            gateway.amount_in_paise !== undefined ||
            rawData.amount_in_paise !== undefined ||
            rawData.total_amount_in_paise !== undefined
                ? amount
                : Math.round(amount * 100),
        currency,
        order_id: razorpayOrderId,
        prefill: {
            email: '',
            contact: '',
        },
        theme: {
            color: themeColor,
        },
        modal: {
            ondismiss: () => {
                onDismiss?.()
            },
        },
        handler: async (response: {
            razorpay_payment_id?: string
            razorpay_order_id?: string
            razorpay_signature?: string
        }) => {
            const paymentId = response?.razorpay_payment_id?.trim() || ''
            const completedOrderId = response?.razorpay_order_id?.trim() || ''
            const signature = response?.razorpay_signature?.trim() || ''

            if (!paymentId || !completedOrderId || !signature) {
                onVerificationError(
                    'Payment completed, but verification data is missing.',
                )
                return
            }

            const completionPayload = {
                provider: paymentContext.normalizedProvider,
                transaction_uuid: String(
                    paymentContext.rawData.transaction_uuid ?? '',
                ).trim(),
                razorpay_payment_id: paymentId,
                razorpay_order_id: completedOrderId,
                razorpay_signature: signature,
            }

            const completionResult = await completeOrderPayment(
                paymentContext.orderId || orderId,
                completionPayload,
            )

            if (
                !completionResult ||
                !completionResult.responseOk ||
                !mapApiSuccess(completionResult.payload)
            ) {
                onVerificationError(
                    completionResult?.payload?.message ||
                        'Payment verification failed.',
                )
                return
            }

            onVerificationSuccess(
                completionResult.payload.message ||
                    'Payment completed successfully.',
            )
        },
    }

    const RazorpayCtor = (
        window as unknown as {
            Razorpay?: new (opts: typeof options) => { open: () => void }
        }
    ).Razorpay
    if (!RazorpayCtor) {
        onInitError('Razorpay checkout is unavailable.')
        return false
    }

    const instance = new RazorpayCtor(options)
    instance.open()
    return true
}
