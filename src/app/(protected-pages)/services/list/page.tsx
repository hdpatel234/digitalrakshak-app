import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import ProductListProvider from './_components/ProductListProvider'
import ProducListTableTools from './_components/ProducListTableTools'
import ProductListTable from './_components/ProductListTable'
import ProductListSelected from './_components/ProductListSelected'
import type { PageProps } from '@/@types/common'
import { headers } from 'next/headers'
import type { Product } from './types'

type ServicesApiResponse = {
    status?: boolean
    message?: string
    data?: unknown
}

type ServicesListData = {
    list: Product[]
    total: number
}

const toNumber = (value: unknown, fallback = 0) => {
    const parsed =
        typeof value === 'number'
            ? value
            : Number.parseInt(String(value ?? ''), 10)
    return Number.isFinite(parsed) ? parsed : fallback
}

const mapService = (item: unknown): Product => {
    const record =
        item && typeof item === 'object'
            ? (item as Record<string, unknown>)
            : {}

    return {
        id: String(record.id ?? ''),
        serviceCode: String(record.service_code ?? '-'),
        category: String(record.service_category_name ?? '-'),
        name: String(record.service_name ?? record.name ?? '-'),
        description: String(record.description ?? '-'),
        price:
            Number.parseFloat(String(record.price ?? record.base_price ?? 0)) ||
            0,
    }
}

const normalizeServicesData = (data: unknown): ServicesListData => {
    if (!data || typeof data !== 'object') {
        return { list: [], total: 0 }
    }

    const dataRecord = data as Record<string, unknown>
    const listValue = dataRecord.list
    const pagination =
        (dataRecord.pagination as Record<string, unknown> | undefined) || {}

    const rawList = Array.isArray(listValue) ? listValue : []
    const total = toNumber(pagination.total, rawList.length)

    return {
        list: rawList.map(mapService),
        total,
    }
}

const getServicesFromInternalApi = async (
    params: Record<string, string | string[] | undefined>,
): Promise<ServicesListData> => {
    const headerStore = await headers()
    const host =
        headerStore.get('x-forwarded-host') || headerStore.get('host') || ''
    const protocol =
        headerStore.get('x-forwarded-proto') ||
        (process.env.NODE_ENV === 'development' ? 'http' : 'https')

    if (!host) {
        return { list: [], total: 0 }
    }

    const pageIndex = toNumber(params.pageIndex, 1) || 1
    const pageSize = toNumber(params.pageSize, 10) || 10
    const url = new URL('/api/client/services', `${protocol}://${host}`)

    Object.entries(params).forEach(([key, value]) => {
        if (
            key === 'pageIndex' ||
            key === 'pageSize' ||
            key === 'query' ||
            key === 'sortKey' ||
            key === 'order'
        ) {
            return
        }

        if (typeof value === 'string' && value.trim()) {
            url.searchParams.set(key, value)
        }
    })

    url.searchParams.set('page', String(pageIndex))
    url.searchParams.set('limit', String(pageSize))

    if (typeof params.query === 'string' && params.query.trim()) {
        url.searchParams.set('search', params.query.trim())
    }

    if (typeof params.sortKey === 'string' && params.sortKey.trim()) {
        url.searchParams.set('sort_by', params.sortKey.trim())
    }
    if (typeof params.order === 'string' && params.order.trim()) {
        url.searchParams.set('sort_direction', params.order.trim())
    }

    try {
        const cookie = headerStore.get('cookie') || ''
        const response = await fetch(url.toString(), {
            method: 'GET',
            cache: 'no-store',
            headers: cookie ? { cookie } : undefined,
        })

        const payload = ((await response.json()) as ServicesApiResponse) || {}

        if (!response.ok || payload.status === false) {
            return { list: [], total: 0 }
        }

        return normalizeServicesData(payload.data)
    } catch {
        return { list: [], total: 0 }
    }
}

export default async function Page({ searchParams }: PageProps) {
    const params = await searchParams
    const data = await getServicesFromInternalApi(params)

    return (
        <ProductListProvider productList={data.list}>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Services</h3>
                        </div>
                        <ProducListTableTools />
                        <ProductListTable
                            productListTotal={data.total}
                            pageIndex={
                                parseInt(params.pageIndex as string) || 1
                            }
                            pageSize={parseInt(params.pageSize as string) || 10}
                        />
                    </div>
                </AdaptiveCard>
            </Container>
            <ProductListSelected />
        </ProductListProvider>
    )
}
