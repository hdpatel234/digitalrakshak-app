"use client"
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import ProductListProvider from './_components/ProductListProvider'
import ServiceListGrid from './_components/ServiceListGrid'
import ProductListSelected from './_components/ProductListSelected'
import Skeleton from '@/components/ui/Skeleton'
import type { PageProps } from '@/@types/common'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
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
        icon: record.icon ? String(record.icon) : undefined,
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

const getServicesFromClientApi = async (
    params: Record<string, string | string[] | undefined>,
): Promise<ServicesListData> => {
    const pageIndex = toNumber(params.pageIndex, 1) || 1
    const pageSize = toNumber(params.pageSize, 10) || 10
    const url = new URL('/api/client/services', window.location.origin)

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
        const response = await fetch(url.pathname + url.search, {
            method: 'GET',
            cache: 'no-store',
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

export default function Page() {
    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries())
    
    const [data, setData] = useState<ServicesListData>({ list: [], total: 0 })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchServices = async () => {
            setLoading(true)
            const result = await getServicesFromClientApi(params)
            setData(result)
            setLoading(false)
        }
        fetchServices()
    }, [searchParams])

    return (
        <ProductListProvider productList={data.list}>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Services</h3>
                        </div>
                        {loading && data.list.length === 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <div
                                        key={`skeleton-${index}`}
                                        className="rounded-xl border p-5 shadow-sm flex flex-col h-full bg-white dark:bg-gray-800"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <Skeleton width="60%" height={24} />
                                            <Skeleton variant="circle" width={32} height={32} />
                                        </div>
                                        <Skeleton width="100%" height={16} className="mt-2" />
                                        <Skeleton width="80%" height={16} className="mt-1 mb-5" />
                                        <div className="mt-auto">
                                            <div className="flex justify-between items-center mb-4">
                                                <Skeleton width={100} height={20} />
                                                <Skeleton width={80} height={24} />
                                            </div>
                                            <Skeleton width="100%" height={40} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <ServiceListGrid
                                productListTotal={data.total}
                                pageIndex={
                                    parseInt(params.pageIndex as string) || 1
                                }
                                pageSize={parseInt(params.pageSize as string) || 10}
                            />
                        )}
                    </div>
                </AdaptiveCard>
            </Container>
            <ProductListSelected />
        </ProductListProvider>
    )
}
