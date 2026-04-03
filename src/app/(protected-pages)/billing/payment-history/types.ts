export type Transaction = {
    id: number
    transactionUuid: string
    clientId: number
    orderId: number
    invoiceId: number
    gatewayConfigId: number | null
    clientGatewayId: number | null
    methodTypeId: number | null
    amount: number
    currency: string
    taxAmount: number
    feeAmount: number
    netAmount: number
    gatewayTransactionId: string | null
    gatewayOrderId: string | null
    gatewayPaymentId: string | null
    bankReference: string | null
    paymentMethod: string | null
    paymentDetails: string | null
    status: string
    paymentStatus: string
    initiatedAt: string
    authorizedAt: string | null
    capturedAt: string | null
    successAt: string | null
    failedAt: string | null
    refundedAt: string | null
    gatewayRequest: string | null
    gatewayResponse: string | null
    gatewayWebhook: string | null
    errorCode: string | null
    errorMessage: string | null
    refundAmount: number
    refundReason: string | null
    refundTransactionId: string | null
    ipAddress: string | null
    userAgent: string | null
    customerName: string | null
    customerEmail: string | null
    customerPhone: string | null
    createdBy: number | null
    updatedBy: number | null
    createdAt: string
    updatedAt: string
    
    // Optional Expanded Relations
    order?: Record<string, unknown>
    invoice?: Record<string, unknown>
    methodType?: Record<string, unknown>
    gatewayConfig?: Record<string, unknown>
}

export type Transactions = Transaction[]

export type Filter = {
    search: string
    status: string
    date: [Date, Date]
}

export type StatusOption = {
    key: string
    name: string
}
