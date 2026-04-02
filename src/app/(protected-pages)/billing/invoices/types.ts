export type Invoice = {
    id: number
    clientId: number
    orderId: number
    billingConfigId: number
    externalInvoiceId: string
    externalInvoiceNumber: string
    invoiceNumber: string
    invoiceDate: string
    dueDate: string | null
    subtotal: number
    discountAmount: number
    taxAmount: number
    taxPercentage: number
    totalAmount: number
    amountPaid: number
    amountDue: number
    currency: string
    status: string
    paymentStatus: string
    pdfUrl: string | null
    syncStatus: string
    syncMessage: string | null
    lastSyncAt: string
    invoiceData?: unknown
    documentId?: string | null
    createdBy: number
    updatedBy: number
    createdAt: string
    updatedAt: string
}

export type Invoices = Invoice[]

export type Filter = {
    search: string
    status: string
    date: [Date, Date]
}

export type StatusOption = {
    key: string
    name: string
}
