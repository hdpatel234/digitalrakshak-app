import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import OrderListTable from '../list/_components/OrderListTable'
import OrderListActionTools from '../list/_components/OrderListActionTools'
import OrderListTableTools from '../list/_components/OrderListTableTools'
import OrderListProvider from '../list/_components/OrderListProvider'
import type { PageProps } from '@/@types/common'
import type { Order, StatusOption, PaymentMethodOption } from '../list/types'
import { headers } from 'next/headers'
import dayjs from 'dayjs'

type OrdersApiResponse = {
    status?: boolean
    message?: string
    data?: unknown
}

type OrdersListData = {
    list: Order[]
    total: number
    statusList: StatusOption[]
    paymentMethods: PaymentMethodOption[]
}

const toNumber = (value: unknown, fallback = 0) => {
    const parsed =
        typeof value === 'number'
            ? value
            : Number.parseInt(String(value ?? ''), 10)
    return Number.isFinite(parsed) ? parsed : fallback
}

const toFloat = (value: unknown, fallback = 0) => {
    const parsed =
        typeof value === 'number'
            ? value
            : Number.parseFloat(String(value ?? ''))
    return Number.isFinite(parsed) ? parsed : fallback
}

const parseDateToUnix = (value: unknown) => {
    if (!value) {
        return Math.floor(Date.now() / 1000)
    }

    const parsed = dayjs(String(value))
    if (parsed.isValid()) {
        return parsed.unix()
    }

    return Math.floor(Date.now() / 1000)
}

const resolveStatusCode = (value: string) => {
    const normalized = value.trim().toLowerCase()
    if (!normalized) {
        return 1
    }

    if (
        normalized === 'paid' ||
        normalized === 'completed' ||
        normalized === 'success'
    ) {
        return 0
    }

    if (normalized === 'failed' || normalized === 'cancelled') {
        return 2
    }

    return 1
}

const mapOrder = (item: unknown, index: number): Order => {
    const record =
        item && typeof item === 'object'
            ? (item as Record<string, unknown>)
            : {}

    const id = String(record.id ?? index + 1)
    const customerName =
        String(record.client_name ?? record.clientName ?? '').trim() ||
        String(record.customer ?? '').trim()
    const clientId = String(record.client_id ?? record.clientId ?? '').trim()

    const paymentMethodRaw = String(
        record.payment_method ?? record.paymentMethod ?? '',
    ).trim()
    const paymentMethod = paymentMethodRaw.toLowerCase()

    const paymentIdentifier =
        String(
            record.payment_reference ??
                record.paymentReference ??
                paymentMethodRaw ??
                '',
        ).trim() || '-'

    const statusValue = String(
        record.payment_status ?? record.paymentStatus ?? record.status ?? '',
    )

    return {
        id,
        date: parseDateToUnix(
            record.order_date ?? record.orderDate ?? record.created_at,
        ),
        customer: customerName || (clientId ? `Client ${clientId}` : '-'),
        status: resolveStatusCode(statusValue),
        paymentMehod: paymentMethod,
        paymentIdendifier: paymentIdentifier,
        totalAmount: toFloat(
            record.total_amount ?? record.totalAmount ?? record.subtotal,
            0,
        ),
    }
}

const normalizeOrdersData = (data: unknown): OrdersListData => {
    if (!data || typeof data !== 'object') {
        return { list: [], total: 0, statusList: [], paymentMethods: [] }
    }

    const dataRecord = data as Record<string, unknown>
    const listValue = dataRecord.list
    const pagination =
        (dataRecord.pagination as Record<string, unknown> | undefined) || {}
    const statusListValue = dataRecord.status_list ?? dataRecord.statusList ?? []
    const paymentMethodsValue =
        dataRecord.payment_methods ?? dataRecord.paymentMethods ?? []

    const rawList = Array.isArray(listValue) ? listValue : []
    const total = toNumber(pagination.total, rawList.length)
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

    const paymentMethods = Array.isArray(paymentMethodsValue)
        ? paymentMethodsValue
              .map((item) => {
                  if (!item || typeof item !== 'object') {
                      return null
                  }
                  const record = item as Record<string, unknown>
                  const id = String(record.id ?? '').trim()
                  if (!id) {
                      return null
                  }
                  return {
                      id,
                      name: String(
                          record.method_name ?? record.name ?? id,
                      ).trim(),
                      code: String(record.method_code ?? record.code ?? '').trim(),
                  }
              })
              .filter(
                  (option): option is PaymentMethodOption => option !== null,
              )
        : []

    return {
        list: rawList.map(mapOrder),
        total,
        statusList,
        paymentMethods,
    }
}

const formatDateParam = (value: string) => {
    const parsed = dayjs(value)
    if (!parsed.isValid()) {
        return ''
    }
    return parsed.format('YYYY-MM-DD')
}

const parseDateRangeParam = (value: string): [string, string] | null => {
    if (!value.includes(',')) {
        return null
    }
    const parts = value
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean)
    if (parts.length < 2) {
        return null
    }
    return [parts[0], parts[1]]
}

const mapSortKey = (value: string) => {
    switch (value) {
        case 'date':
            return 'order_date'
        case 'totalAmount':
            return 'total_amount'
        case 'paymentMehod':
            return 'payment_method'
        case 'customer':
            return 'client_id'
        default:
            return value
    }
}

const getOrdersFromInternalApi = async (
    params: Record<string, string | string[] | undefined>,
): Promise<OrdersListData> => {
    const headerStore = await headers()
    const host =
        headerStore.get('x-forwarded-host') || headerStore.get('host') || ''
    const protocol =
        headerStore.get('x-forwarded-proto') ||
        (process.env.NODE_ENV === 'development' ? 'http' : 'https')

    if (!host) {
        return { list: [], total: 0, statusList: [], paymentMethods: [] }
    }

    const pageIndex = toNumber(params.pageIndex, 1) || 1
    const pageSize = toNumber(params.pageSize, 10) || 10
    const url = new URL('/api/client/orders', `${protocol}://${host}`)

    if (typeof params.query === 'string' && params.query.trim()) {
        url.searchParams.set('search', params.query.trim())
    } else if (typeof params.search === 'string' && params.search.trim()) {
        url.searchParams.set('search', params.search.trim())
    }

    if (typeof params.status === 'string' && params.status.trim()) {
        const status = params.status.trim()
        if (status !== 'all') {
            url.searchParams.set('status', status)
        }
    }

    const paymentStatusParam =
        typeof params.payment_status === 'string'
            ? params.payment_status
            : typeof params.paymentStatus === 'string'
              ? params.paymentStatus
              : ''

    if (paymentStatusParam && paymentStatusParam.trim()) {
        url.searchParams.set('payment_status', paymentStatusParam.trim())
    }

    const paymentMethodParam =
        typeof params.payment_method_id === 'string'
            ? params.payment_method_id
            : typeof params.paymentMethod === 'string'
              ? params.paymentMethod
              : ''

    if (paymentMethodParam && paymentMethodParam.trim()) {
        url.searchParams.set('payment_method_id', paymentMethodParam.trim())
    }

    let dateFrom =
        typeof params.date_from === 'string' ? params.date_from : ''
    let dateTo = typeof params.date_to === 'string' ? params.date_to : ''

    if (!dateFrom && !dateTo) {
        const minDate =
            typeof params.minDate === 'string' ? params.minDate : ''
        const maxDate =
            typeof params.maxDate === 'string' ? params.maxDate : ''

        if (minDate && maxDate && minDate !== maxDate) {
            dateFrom = minDate
            dateTo = maxDate
        } else if (minDate && minDate === maxDate) {
            const range = parseDateRangeParam(minDate)
            if (range) {
                dateFrom = range[0]
                dateTo = range[1]
            }
        }
    }

    if (dateFrom) {
        const formatted = formatDateParam(dateFrom)
        if (formatted) {
            url.searchParams.set('date_from', formatted)
        }
    }

    if (dateTo) {
        const formatted = formatDateParam(dateTo)
        if (formatted) {
            url.searchParams.set('date_to', formatted)
        }
    }

    if (typeof params.sortKey === 'string' && params.sortKey.trim()) {
        url.searchParams.set('sort_by', mapSortKey(params.sortKey.trim()))
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

        const payload = ((await response.json()) as OrdersApiResponse) || {}

        if (!response.ok || payload.status === false) {
            return {
                list: [],
                total: 0,
                statusList: [],
                paymentMethods: [],
            }
        }

        return normalizeOrdersData(payload.data)
    } catch {
        return { list: [], total: 0, statusList: [], paymentMethods: [] }
    }
}

export default async function Page({ searchParams }: PageProps) {
    const params = await searchParams
    const data = await getOrdersFromInternalApi(params)

    return (
        <OrderListProvider
            orderList={data.list}
            statusOptions={data.statusList}
            paymentMethodOptions={data.paymentMethods}
        >
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Orders</h3>
                            <OrderListActionTools />
                        </div>
                        <OrderListTableTools />
                        <OrderListTable
                            orderListTotal={data.total}
                            pageIndex={
                                parseInt(params.pageIndex as string) || 1
                            }
                            pageSize={parseInt(params.pageSize as string) || 10}
                        />
                    </div>
                </AdaptiveCard>
            </Container>
        </OrderListProvider>
    )
}
