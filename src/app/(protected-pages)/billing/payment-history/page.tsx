import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import TransactionListTable from './_components/TransactionListTable'
import TransactionListTableTools from './_components/TransactionListTableTools'
import TransactionListProvider from './_components/TransactionListProvider'
import type { PageProps } from '@/@types/common'
import type { Transaction, StatusOption } from './types'
import { headers } from 'next/headers'

type TransactionsApiResponse = {
    status?: boolean
    message?: string
    data?: unknown
}

type TransactionsListData = {
    list: Transaction[]
    total: number
    statusList: StatusOption[]
}

const normalizeTransactionsData = (data: unknown): TransactionsListData => {
    if (!data || typeof data !== 'object') {
        return { list: [], total: 0, statusList: [] }
    }

    const dataRecord = data as Record<string, unknown>
    const listValue = dataRecord.list
    const pagination =
        (dataRecord.pagination as Record<string, unknown> | undefined) || {}
    const statusListValue = dataRecord.status_list ?? dataRecord.statusList ?? []

    const rawList = Array.isArray(listValue) ? listValue : []
    const total = typeof pagination.total === 'number' ? pagination.total : Number.parseInt(String(pagination.total), 10) || rawList.length
    const statusList = Array.isArray(statusListValue)
        ? statusListValue
              .map((item) => {
                  if (!item || typeof item !== 'object') {
                      return null
                  }
                  const record = item as Record<string, unknown>
                  const key = String(record.key ?? '').trim()
                  if (!key) {
                      return null
                  }
                  const name = String(record.name ?? key).trim()
                  return { key, name: name || key }
              })
              .filter((option): option is StatusOption => option !== null)
        : []

    return {
        list: rawList.map(item => {
            const record = item as Record<string, unknown>
            return {
                id: Number(record.id || 0),
                transactionUuid: String(record.transaction_uuid || ''),
                clientId: Number(record.client_id || 0),
                orderId: Number(record.order_id || 0),
                invoiceId: Number(record.invoice_id || 0),
                gatewayConfigId: record.gateway_config_id ? Number(record.gateway_config_id) : null,
                clientGatewayId: record.client_gateway_id ? Number(record.client_gateway_id) : null,
                methodTypeId: record.method_type_id ? Number(record.method_type_id) : null,
                amount: Number(record.amount || 0),
                currency: String(record.currency || 'INR'),
                taxAmount: Number(record.tax_amount || 0),
                feeAmount: Number(record.fee_amount || 0),
                netAmount: Number(record.net_amount || 0),
                gatewayTransactionId: record.gateway_transaction_id ? String(record.gateway_transaction_id) : null,
                gatewayOrderId: record.gateway_order_id ? String(record.gateway_order_id) : null,
                gatewayPaymentId: record.gateway_payment_id ? String(record.gateway_payment_id) : null,
                bankReference: record.bank_reference ? String(record.bank_reference) : null,
                paymentMethod: record.payment_method ? String(record.payment_method) : null,
                paymentDetails: record.payment_details ? String(record.payment_details) : null,
                status: String(record.status || 'pending'),
                paymentStatus: String(record.payment_status || 'unpaid'),
                initiatedAt: String(record.initiated_at || ''),
                authorizedAt: record.authorized_at ? String(record.authorized_at) : null,
                capturedAt: record.captured_at ? String(record.captured_at) : null,
                successAt: record.success_at ? String(record.success_at) : null,
                failedAt: record.failed_at ? String(record.failed_at) : null,
                refundedAt: record.refunded_at ? String(record.refunded_at) : null,
                gatewayRequest: record.gateway_request ? String(record.gateway_request) : null,
                gatewayResponse: record.gateway_response ? String(record.gateway_response) : null,
                gatewayWebhook: record.gateway_webhook ? String(record.gateway_webhook) : null,
                errorCode: record.error_code ? String(record.error_code) : null,
                errorMessage: record.error_message ? String(record.error_message) : null,
                refundAmount: Number(record.refund_amount || 0),
                refundReason: record.refund_reason ? String(record.refund_reason) : null,
                refundTransactionId: record.refund_transaction_id ? String(record.refund_transaction_id) : null,
                ipAddress: record.ip_address ? String(record.ip_address) : null,
                userAgent: record.user_agent ? String(record.user_agent) : null,
                customerName: record.customer_name ? String(record.customer_name) : null,
                customerEmail: record.customer_email ? String(record.customer_email) : null,
                customerPhone: record.customer_phone ? String(record.customer_phone) : null,
                createdBy: record.created_by ? Number(record.created_by) : null,
                updatedBy: record.updated_by ? Number(record.updated_by) : null,
                createdAt: String(record.created_at || ''),
                updatedAt: String(record.updated_at || ''),
                order: record.order as Record<string, unknown> | undefined,
                invoice: record.invoice as Record<string, unknown> | undefined,
                methodType: record.method_type as Record<string, unknown> | undefined,
                gatewayConfig: record.gateway_config as Record<string, unknown> | undefined,
            } as Transaction
        }),
        total,
        statusList,
    }
}

const getTransactionsFromInternalApi = async (
    params: Record<string, string | string[] | undefined>,
): Promise<TransactionsListData> => {
    const headerStore = await headers()
    const host =
        headerStore.get('x-forwarded-host') || headerStore.get('host') || ''
    const protocol =
        headerStore.get('x-forwarded-proto') ||
        (process.env.NODE_ENV === 'development' ? 'http' : 'https')

    if (!host) {
        return { list: [], total: 0, statusList: [] }
    }

    const pageIndex = Number(params.pageIndex) || 1
    const pageSize = Number(params.pageSize) || 10
    const url = new URL('/api/client/billing/transactions', `${protocol}://${host}`)

    if (typeof params.search === 'string' && params.search.trim()) {
        url.searchParams.set('search', params.search.trim())
    }
    
    // Support order parameter if search comes via query like in invoices? Revert to search if query provided:
    if (typeof params.query === 'string' && params.query.trim()) {
        url.searchParams.set('search', params.query.trim())
    }

    if (typeof params.sortKey === 'string' && params.sortKey.trim()) {
        url.searchParams.set('sort_by', params.sortKey.trim())
    }

    if (typeof params.order === 'string' && params.order.trim()) {
        url.searchParams.set('sort_direction', params.order.trim())
    }

    url.searchParams.set('page', String(pageIndex))
    url.searchParams.set('limit', String(pageSize))

    try {
        const cookie = headerStore.get('cookie') || ''
        const response = await fetch(url.toString(), {
            method: 'GET',
            cache: 'no-store',
            headers: cookie ? { cookie } : undefined,
        })

        const payload = ((await response.json()) as TransactionsApiResponse) || {}

        if (!response.ok || payload.status === false) {
            return {
                list: [],
                total: 0,
                statusList: [],
            }
        }

        return normalizeTransactionsData(payload.data)
    } catch {
        return { list: [], total: 0, statusList: [] }
    }
}

export default async function Page({ searchParams }: PageProps) {
    const params = await searchParams
    const data = await getTransactionsFromInternalApi(params)

    return (
        <TransactionListProvider
            transactionList={data.list}
            statusOptions={data.statusList}
        >
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Transactions</h3>
                        </div>
                        <TransactionListTableTools />
                        <TransactionListTable
                            transactionListTotal={data.total}
                            pageIndex={
                                parseInt(params.pageIndex as string) || 1
                            }
                            pageSize={parseInt(params.pageSize as string) || 10}
                        />
                    </div>
                </AdaptiveCard>
            </Container>
        </TransactionListProvider>
    )
}
