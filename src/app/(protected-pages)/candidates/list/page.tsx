"use client"
import CustomerListProvider from './_components/CustomerListProvider'
import type { PageProps } from '@/@types/common'
import ClientContent from './_components/ClientContent'
import type { Customer, StatusOption } from './types'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type CandidateListApiResponse = {
    status?: boolean
    message?: string
    data?: unknown
}

type CandidateListData = {
    list: Customer[]
    total: number
    totalPages: number
    nextPage: number | null
    limit: number
    statusList: StatusOption[]
}

const toNumber = (value: unknown, fallback = 0) => {
    const num =
        typeof value === 'number'
            ? value
            : Number.parseInt(String(value ?? ''), 10)
    return Number.isFinite(num) ? num : fallback
}

const toNullableNumber = (value: unknown): number | null => {
    const num =
        typeof value === 'number'
            ? value
            : Number.parseInt(String(value ?? ''), 10)

    return Number.isFinite(num) ? num : null
}

const toCandidateRecord = (item: unknown): Record<string, unknown> => {
    if (item && typeof item === 'object') {
        return item as Record<string, unknown>
    }
    return {}
}

const mapCandidateToCustomer = (item: unknown, index: number): Customer => {
    const record = toCandidateRecord(item)
    const firstName = String(
        record.first_name ?? record.firstName ?? record.firstname ?? '',
    )
    const lastName = String(
        record.last_name ?? record.lastName ?? record.lastname ?? '',
    )
    const fullName = String(record.name ?? `${firstName} ${lastName}`.trim())

    const personalInfo =
        record.personalInfo && typeof record.personalInfo === 'object'
            ? (record.personalInfo as Record<string, unknown>)
            : {}

    const city = String(personalInfo.city ?? record.city ?? '').trim()
    const state = String(personalInfo.state ?? record.state ?? '').trim()
    const country = String(personalInfo.country ?? record.country ?? '').trim()
    const composedLocation = [city, state, country]
        .filter((value) => Boolean(value))
        .join(', ')
    const location =
        composedLocation ||
        String(personalInfo.location ?? record.location ?? '').trim() ||
        '-'

    const id = String(record.id ?? record.candidate_id ?? `candidate-${index}`)
    const status = String(record.status ?? 'active').toLowerCase()

    const packageName = String(record.package_name ?? record.package ?? '-')
    const packageId = (record.package_id ?? record.packageId ?? null) as number | string | null
    const progress = toNumber(record.progress ?? record.completion, 0)
    
    let assignedDateStr = String(record.created_at ?? record.createdAt ?? record.assigned_date ?? record.assignedDate ?? '');
    if (!assignedDateStr) {
        assignedDateStr = new Date().toISOString();
    }
    const dateObj = new Date(assignedDateStr);
    const assignedDate = isNaN(dateObj.getTime()) ? assignedDateStr : dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    return {
        id,
        name: fullName || '-',
        firstName,
        lastName,
        email: String(record.email ?? ''),
        img: String(record.img ?? record.image ?? record.avatar ?? ''),
        role: String(record.role ?? 'candidate'),
        lastOnline: toNumber(record.lastOnline, Date.now()),
        status,
        package: packageName,
        packageId,
        progress,
        assignedDate,
        personalInfo: {
            location,
            title: String(personalInfo.title ?? ''),
            birthday: String(personalInfo.birthday ?? ''),
            phoneNumber: String(
                personalInfo.phoneNumber ?? record.phone_number ?? '',
            ),
            dialCode: String(personalInfo.dialCode ?? record.dialCode ?? ''),
            address: String(personalInfo.address ?? ''),
            postcode: String(personalInfo.postcode ?? ''),
            city,
            state,
            country,
            facebook: String(personalInfo.facebook ?? ''),
            twitter: String(personalInfo.twitter ?? ''),
            pinterest: String(personalInfo.pinterest ?? ''),
            linkedIn: String(personalInfo.linkedIn ?? ''),
        },
        orderHistory: [],
        paymentMethod: [],
        subscription: [],
        totalSpending: toNumber(record.totalSpending, 0),
    }
}

const mapStatusOption = (item: unknown): StatusOption | null => {
    if (!item || typeof item !== 'object') {
        return null
    }

    const record = item as Record<string, unknown>
    const key = String(record.key ?? '').trim()
    const name = String(record.name ?? key).trim()

    if (!key) {
        return null
    }

    return { key, name: name || key }
}

const normalizeCandidateListData = (
    data: unknown,
    pageSize: number,
): CandidateListData => {
    if (!data || typeof data !== 'object') {
        return {
            list: [],
            total: 0,
            totalPages: 0,
            nextPage: null,
            limit: pageSize,
            statusList: [],
        }
    }

    const dataRecord = data as Record<string, unknown>
    const pagination =
        (dataRecord.pagination as Record<string, unknown> | undefined) ||
        (dataRecord.meta as Record<string, unknown> | undefined) ||
        {}

    const listValue =
        dataRecord.list ??
        dataRecord.items ??
        dataRecord.results ??
        dataRecord.candidates ??
        dataRecord.data ??
        []

    const rawList = Array.isArray(listValue) ? listValue : []
    const limit =
        toNumber(
            pagination.per_page ??
            pagination.pageSize ??
            pagination.limit ??
            dataRecord.limit,
            pageSize,
        ) || pageSize

    const total =
        toNumber(
            pagination.total ??
            pagination.total_items ??
            pagination.totalRecords ??
            dataRecord.total,
            rawList.length,
        ) || rawList.length

    const totalPages =
        toNumber(
            pagination.total_pages ??
            pagination.totalPages ??
            pagination.last_page ??
            dataRecord.totalPages,
            Math.ceil(total / Math.max(limit, 1)),
        ) || Math.ceil(total / Math.max(limit, 1))

    const nextPageValue =
        pagination.next_page ?? pagination.nextPage ?? dataRecord.nextPage
    const nextPage =
        nextPageValue === null || nextPageValue === undefined
            ? null
            : toNullableNumber(nextPageValue)

    const statusListValue = dataRecord.status_list ?? dataRecord.statusList ?? []
    const statusList = Array.isArray(statusListValue)
        ? statusListValue
            .map(mapStatusOption)
            .filter((option): option is StatusOption => option !== null)
        : []

    return {
        list: rawList.map(mapCandidateToCustomer),
        total,
        totalPages,
        nextPage,
        limit,
        statusList,
    }
}

const getCandidatesFromClientApi = async (
    params: Record<string, string | string[] | undefined>,
): Promise<CandidateListData> => {
    const pageIndex = toNumber(params.pageIndex, 1) || 1
    const pageSize = toNumber(params.pageSize, 10) || 10
    
    // Keep compatibility with external API naming for pagination/search.
    const queryParams: Record<string, string> = { ...params as Record<string, string> };
    queryParams.page = String(pageIndex);
    queryParams.limit = String(pageSize);
    if (queryParams.query && !queryParams.search) {
        queryParams.search = queryParams.query;
    }

    try {
        const response = await fetch('/api/client/candidates?' + new URLSearchParams(queryParams).toString(), {
            method: 'GET',
            cache: 'no-store',
        })

        console.log('response', response)

        const payload =
            ((await response.json()) as CandidateListApiResponse) || {}

        if (!response.ok || payload.status === false) {
            return {
                list: [],
                total: 0,
                totalPages: 0,
                nextPage: null,
                limit: pageSize,
                statusList: [],
            }
        }

        return normalizeCandidateListData(payload.data, pageSize)
    } catch (error) {
        console.error('[Server API Error] fetching candidates/list failed:', error)
        return {
            list: [],
            total: 0,
            totalPages: 0,
            nextPage: null,
            limit: pageSize,
            statusList: [],
        }
    }
}

export default function Page() {
    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries())
    
    const [data, setData] = useState<CandidateListData>({ list: [], total: 0 } as unknown as CandidateListData)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            
            const result = await getCandidatesFromClientApi(params)
            setData(result)
            setLoading(false)
        }
        fetchData()
    }, [searchParams])

    return (
        <CustomerListProvider customerList={data.list} loading={loading}>
            <ClientContent data={data} params={params} />
        </CustomerListProvider>
    )
}
