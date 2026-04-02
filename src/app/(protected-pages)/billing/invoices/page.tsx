import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import InvoiceListTable from './_components/InvoiceListTable'
import InvoiceListTableTools from './_components/InvoiceListTableTools'
import InvoiceListProvider from './_components/InvoiceListProvider'
import type { PageProps } from '@/@types/common'
import type { Invoice, StatusOption } from './types'
import { headers } from 'next/headers'

type InvoicesApiResponse = {
    status?: boolean
    message?: string
    data?: unknown
}

type InvoicesListData = {
    list: Invoice[]
    total: number
    statusList: StatusOption[]
}

const normalizeInvoicesData = (data: unknown): InvoicesListData => {
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
                clientId: Number(record.client_id || 0),
                orderId: Number(record.order_id || 0),
                billingConfigId: Number(record.billing_config_id || 0),
                externalInvoiceId: String(record.external_invoice_id || ''),
                externalInvoiceNumber: String(record.external_invoice_number || ''),
                invoiceNumber: String(record.invoice_number || ''),
                invoiceDate: String(record.invoice_date || ''),
                dueDate: record.due_date ? String(record.due_date) : null,
                subtotal: Number(record.subtotal || 0),
                discountAmount: Number(record.discount_amount || 0),
                taxAmount: Number(record.tax_amount || 0),
                taxPercentage: Number(record.tax_percentage || 0),
                totalAmount: Number(record.total_amount || 0),
                amountPaid: Number(record.amount_paid || 0),
                amountDue: Number(record.amount_due || 0),
                currency: String(record.currency || 'INR'),
                status: String(record.status || 'draft'),
                paymentStatus: String(record.payment_status || 'unpaid'),
                pdfUrl: record.pdf_url ? String(record.pdf_url) : null,
                syncStatus: String(record.sync_status || ''),
                syncMessage: record.sync_message ? String(record.sync_message) : null,
                lastSyncAt: String(record.last_sync_at || ''),
                createdBy: Number(record.created_by || 0),
                updatedBy: Number(record.updated_by || 0),
                createdAt: String(record.created_at || ''),
                updatedAt: String(record.updated_at || ''),
            } as Invoice
        }),
        total,
        statusList,
    }
}

const getInvoicesFromInternalApi = async (
    params: Record<string, string | string[] | undefined>,
): Promise<InvoicesListData> => {
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
    const url = new URL('/api/client/invoices', `${protocol}://${host}`)

    if (typeof params.query === 'string' && params.query.trim()) {
        url.searchParams.set('search', params.query.trim())
    }

    if (typeof params.date_from === 'string' && params.date_from.trim()) {
        url.searchParams.set('date_from', params.date_from.trim())
    }

    if (typeof params.date_to === 'string' && params.date_to.trim()) {
        url.searchParams.set('date_to', params.date_to.trim())
    }

    if (
        typeof params.status === 'string' &&
        params.status.trim() &&
        params.status.trim() !== 'all'
    ) {
        url.searchParams.set('status', params.status.trim())
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

        const payload = ((await response.json()) as InvoicesApiResponse) || {}

        if (!response.ok || payload.status === false) {
            return {
                list: [],
                total: 0,
                statusList: [],
            }
        }

        return normalizeInvoicesData(payload.data)
    } catch {
        return { list: [], total: 0, statusList: [] }
    }
}

export default async function Page({ searchParams }: PageProps) {
    const params = await searchParams
    const data = await getInvoicesFromInternalApi(params)

    return (
        <InvoiceListProvider
            invoiceList={data.list}
            statusOptions={data.statusList}
        >
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Invoices</h3>
                        </div>
                        <InvoiceListTableTools />
                        <InvoiceListTable
                            invoiceListTotal={data.total}
                            pageIndex={
                                parseInt(params.pageIndex as string) || 1
                            }
                            pageSize={parseInt(params.pageSize as string) || 10}
                        />
                    </div>
                </AdaptiveCard>
            </Container>
        </InvoiceListProvider>
    )
}
