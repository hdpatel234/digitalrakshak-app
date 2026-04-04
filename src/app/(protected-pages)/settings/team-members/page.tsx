import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import TeamListTable from './_components/TeamListTable'
import TeamListActionTools from './_components/TeamListActionTools'
import TeamListTableTools from './_components/TeamListTableTools'
import TeamListProvider from './_components/TeamListProvider'
import type { PageProps } from '@/@types/common'
import type { TeamMember, TeamListData } from './_components/types'
import { headers } from 'next/headers'

type ApiResponse = {
    status?: boolean
    message?: string
    data?: unknown
}

const toNumber = (value: unknown, fallback = 0) => {
    const parsed =
        typeof value === 'number'
            ? value
            : Number.parseInt(String(value ?? ''), 10)
    return Number.isFinite(parsed) ? parsed : fallback
}

const mapTeamMember = (item: unknown): TeamMember => {
    const record =
        item && typeof item === 'object'
            ? (item as Record<string, unknown>)
            : {}

    return {
        id: String(record.id ?? ''),
        client_id: toNumber(record.client_id),
        user_type: String(record.user_type ?? ''),
        first_name: String(record.first_name ?? ''),
        last_name: String(record.last_name ?? ''),
        email: String(record.email ?? ''),
        email_verified_at: record.email_verified_at ? String(record.email_verified_at) : null,
        phone_code: record.phone_code ? String(record.phone_code) : null,
        phone: record.phone ? String(record.phone) : null,
        avatar: record.avatar ? String(record.avatar) : null,
        last_login_at: record.last_login_at ? String(record.last_login_at) : null,
        last_login_ip: record.last_login_ip ? String(record.last_login_ip) : null,
        last_login_browser: record.last_login_browser ? String(record.last_login_browser) : null,
        last_login_device: record.last_login_device ? String(record.last_login_device) : null,
        last_login_os: record.last_login_os ? String(record.last_login_os) : null,
        last_login_provider: record.last_login_provider ? String(record.last_login_provider) : null,
        last_login_provider_id: record.last_login_provider_id ? String(record.last_login_provider_id) : null,
        is_active: toNumber(record.is_active, 1),
        is_admin: toNumber(record.is_admin, 0),
        created_at: record.created_at ? String(record.created_at) : null,
        updated_at: record.updated_at ? String(record.updated_at) : null,
    }
}

const normalizeTeamData = (data: unknown): TeamListData => {
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
        list: rawList.map(mapTeamMember),
        total,
    }
}

const mapSortKey = (value: string) => {
    switch (value) {
        case 'first_name':
            return 'first_name'
        case 'email':
            return 'email'
        case 'is_active':
            return 'is_active'
        default:
            return 'created_at'
    }
}

const getTeamMembersFromInternalApi = async (
    params: Record<string, string | string[] | undefined>,
): Promise<TeamListData> => {
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
    const url = new URL('/api/client/settings/users', `${protocol}://${host}`)

    if (typeof params.query === 'string' && params.query.trim()) {
        url.searchParams.set('search', params.query.trim())
    }

    if (typeof params.status === 'string' && params.status.trim() && params.status !== 'all') {
        url.searchParams.set('status', params.status.trim())
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

        const payload = ((await response.json()) as ApiResponse) || {}

        if (!response.ok || payload.status === false) {
            return { list: [], total: 0 }
        }

        return normalizeTeamData(payload.data)
    } catch {
        return { list: [], total: 0 }
    }
}

export default async function Page({ searchParams }: PageProps) {
    const params = await searchParams
    const data = await getTeamMembersFromInternalApi(params)

    return (
        <TeamListProvider
            teamList={data.list}
            filterData={{
                search: (params.query as string) || '',
                status: (params.status as string) || 'all',
            }}
        >
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Team Members</h3>
                            <TeamListActionTools />
                        </div>
                        <TeamListTableTools />
                        <TeamListTable
                            teamListTotal={data.total}
                            pageIndex={parseInt(params.pageIndex as string) || 1}
                            pageSize={parseInt(params.pageSize as string) || 10}
                        />
                    </div>
                </AdaptiveCard>
            </Container>
        </TeamListProvider>
    )
}
