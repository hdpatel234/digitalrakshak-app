import Container from '@/components/shared/Container'
import { headers } from 'next/headers'
import Link from 'next/link'
import { TbLayersLinked, TbUsers, TbPlus } from 'react-icons/tb'
import type { PageProps } from '@/@types/common'
import type { Product } from './types'

type PackagesApiResponse = {
    status?: boolean
    message?: string
    data?: unknown
}

type PackagesListData = {
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

const mapPackage = (item: unknown): Product => {
    const record =
        item && typeof item === 'object'
            ? (item as Record<string, unknown>)
            : {}

    const rawServices = Array.isArray(record.services) ? record.services : []
    const services = rawServices.map(s => {
        if (s && typeof s === 'object') {
            const svc = s as Record<string, unknown>
            return String(svc.service_name || svc.name || '')
        }
        return String(s)
    }).filter(Boolean)

    return {
        id: String(record.id ?? ''),
        packageCode: String(record.package_code ?? '-'),
        type: String(record.type ?? '-'),
        name: String(record.package_name ?? record.name ?? '-'),
        description: String(record.description ?? '-'),
        availableCandidates: toNumber(record.available_candidates, 0),
        price:
            Number.parseFloat(
                String(
                    record.total_price ??
                        record.final_price ??
                        record.price ??
                        record.total_price ??
                        0,
                ),
            ) || 0,
        services,
    }
}

const normalizePackagesData = (data: unknown): PackagesListData => {
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
        list: rawList.map(mapPackage),
        total,
    }
}

const getPackagesFromInternalApi = async (
    params: Record<string, string | string[] | undefined>,
): Promise<PackagesListData> => {
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
    const pageSize = toNumber(params.pageSize, 100) || 100
    const url = new URL('/api/client/packages', `${protocol}://${host}`)

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

        const payload = ((await response.json()) as PackagesApiResponse) || {}

        if (!response.ok || payload.status === false) {
            return { list: [], total: 0 }
        }

        return normalizePackagesData(payload.data)
    } catch {
        return { list: [], total: 0 }
    }
}

export default async function Page({ searchParams }: PageProps) {
    const params = await searchParams
    const data = await getPackagesFromInternalApi(params)

    return (
        <Container>
            <div className="max-w-7xl mx-auto w-full pb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                            Verification packages
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
                            Reusable bundles of services. Assign one to every candidate at invitation time.
                        </p>
                    </div>
                    <Link
                        href="/packages/create"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-sm whitespace-nowrap text-sm"
                    >
                        <TbPlus className="text-lg" />
                        Create package
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.list.map((pkg, index) => {
                        const isAdminPackage = String(pkg.type || '').toLowerCase() === 'admin'
                        const isEditable = !isAdminPackage

                        // Cycle through some light background tints for the cards to match the design
                        const colorThemes = [
                            'bg-blue-50/50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800/30',
                            'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700',
                            'bg-orange-50/50 border-orange-200 dark:bg-orange-900/10 dark:border-orange-800/30',
                            'bg-emerald-50/50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-800/30',
                        ]
                        const themeClass = colorThemes[index % colorThemes.length]

                        return (
                            <div
                                key={pkg.id}
                                className={`rounded-xl border p-5 shadow-sm flex flex-col h-full ${themeClass}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                        {pkg.name}
                                    </h3>
                                    <div className="bg-indigo-100 dark:bg-indigo-900/30 p-1.5 rounded-md flex-shrink-0 ml-4">
                                        <TbLayersLinked className="text-indigo-600 dark:text-indigo-400 text-xl" />
                                    </div>
                                </div>
                                
                                {pkg.description && pkg.description !== '-' && (
                                    <p className="text-gray-500 dark:text-gray-400 mb-5 text-sm">
                                        {pkg.description}
                                    </p>
                                )}

                                <div className="border-b border-gray-200/60 dark:border-gray-700/60 w-full mb-4"></div>

                                {pkg.services && pkg.services.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {pkg.services.map((service, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex px-2.5 py-1 text-xs rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 shadow-sm"
                                            >
                                                {service}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-auto">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm">
                                            <TbUsers className="text-base" />
                                            <span>{pkg.availableCandidates} candidates</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                                                {new Intl.NumberFormat('en-IN', {
                                                    style: 'currency',
                                                    currency: 'INR',
                                                    minimumFractionDigits: 0,
                                                    maximumFractionDigits: 0,
                                                }).format(pkg.price)}
                                            </span>
                                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium ml-1">
                                                /run
                                            </span>
                                        </div>
                                    </div>

                                    {isEditable && (
                                        <Link
                                            href={`/packages/edit/${pkg.id}`}
                                            className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm text-sm"
                                        >
                                            Edit package
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )
                    })}

                    <Link
                        href="/packages/create"
                        className="flex flex-col items-center justify-center py-12 px-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 dark:text-gray-400 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-all group min-h-[300px]"
                    >
                        <div className="bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-full mb-3">
                            <TbPlus className="text-2xl text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white mb-1">
                            Create new package
                        </span>
                        <span className="text-sm">
                            Click here to select services and compose a workflow
                        </span>
                    </Link>
                </div>
            </div>
        </Container>
    )
}
