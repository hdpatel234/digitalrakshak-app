import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import TicketListTable from './_components/TicketListTable'
import TicketListActionTools from './_components/TicketListActionTools'
import TicketListTableTools from './_components/TicketListTableTools'
import TicketListProvider from './_components/TicketListProvider'
import type { PageProps } from '@/@types/common'
import type { Ticket, StatusOption, DepartmentOption, PriorityOption } from './_components/types'
import { headers } from 'next/headers'
import dayjs from 'dayjs'

type TicketsApiResponse = {
    status?: boolean
    message?: string
    data?: unknown
}

type TicketsListData = {
    list: Ticket[]
    total: number
    statusList: StatusOption[]
    departmentList: DepartmentOption[]
    priorityList: PriorityOption[]
}

const toNumber = (value: unknown, fallback = 0) => {
    const parsed =
        typeof value === 'number'
            ? value
            : Number.parseInt(String(value ?? ''), 10)
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

const mapTicket = (item: unknown): Ticket => {
    const record =
        item && typeof item === 'object'
            ? (item as Record<string, unknown>)
            : {}

    return {
        id: String(record.id ?? ''),
        ticketNumber: String(record.ticket_number ?? ''),
        subject: String(record.subject ?? ''),
        departmentId: String(record.department_id ?? ''),
        departmentName: String(record.department_name ?? ''),
        priorityId: String(record.priority_id ?? ''),
        priorityName: String(record.priority_name ?? ''),
        status: String(record.status ?? ''),
        createdAt: parseDateToUnix(record.created_at),
    }
}

const mapSortKey = (value: string) => {
    switch (value) {
        case 'date':
            return 'support_tickets.created_at'
        case 'ticketNumber':
            return 'ticket_number'
        case 'subject':
            return 'subject'
        default:
            return value
    }
}

const normalizeTicketsData = (data: unknown): TicketsListData => {
    if (!data || typeof data !== 'object') {
        return { list: [], total: 0, statusList: [], departmentList: [], priorityList: [] }
    }

    const dataRecord = data as Record<string, unknown>
    const listValue = dataRecord.list
    const pagination =
        (dataRecord.pagination as Record<string, unknown> | undefined) || {}
    const statusListValue = dataRecord.status_list ?? dataRecord.statusList ?? []
    const departmentsValue = dataRecord.departments ?? []
    const prioritiesValue = dataRecord.priorities ?? []

    const rawList = Array.isArray(listValue) ? listValue : []
    const total = toNumber(pagination.total, rawList.length)

    const statusList = Array.isArray(statusListValue)
        ? statusListValue
              .map((item) => {
                  if (!item || typeof item !== 'object') return null
                  const record = item as Record<string, unknown>
                  const key = String(record.key ?? '').trim()
                  if (!key) return null
                  return { key, name: String(record.name ?? key).trim() }
              })
              .filter((opt): opt is StatusOption => opt !== null)
        : []

    const departmentList = Array.isArray(departmentsValue)
        ? departmentsValue
              .map((item): DepartmentOption | null => {
                  if (!item || typeof item !== 'object') return null
                  const record = item as Record<string, unknown>
                  const id = String(record.id ?? '').trim()
                  if (!id) return null
                  return { id, name: String(record.name ?? id).trim() }
              })
              .filter((opt): opt is DepartmentOption => opt !== null)
        : []

    const priorityList = Array.isArray(prioritiesValue)
        ? prioritiesValue
              .map((item): PriorityOption | null => {
                  if (!item || typeof item !== 'object') return null
                  const record = item as Record<string, unknown>
                  const id = String(record.id ?? '').trim()
                  if (!id) return null
                  return { id, name: String(record.name ?? id).trim() }
              })
              .filter((opt): opt is PriorityOption => opt !== null)
        : []

    return {
        list: rawList.map(mapTicket),
        total,
        statusList,
        departmentList,
        priorityList,
    }
}

const getTicketsFromInternalApi = async (
    params: Record<string, string | string[] | undefined>,
): Promise<TicketsListData> => {
    const headerStore = await headers()
    const host =
        headerStore.get('x-forwarded-host') || headerStore.get('host') || ''
    const protocol =
        headerStore.get('x-forwarded-proto') ||
        (process.env.NODE_ENV === 'development' ? 'http' : 'https')

    if (!host) {
        return { list: [], total: 0, statusList: [], departmentList: [], priorityList: [] }
    }

    const pageIndex = toNumber(params.pageIndex, 1) || 1
    const pageSize = toNumber(params.pageSize, 10) || 10
    const url = new URL('/api/client/tickets', `${protocol}://${host}`)

    if (typeof params.query === 'string' && params.query.trim()) {
        url.searchParams.set('search', params.query.trim())
    }

    if (typeof params.status === 'string' && params.status.trim() && params.status !== 'all') {
        url.searchParams.set('status', params.status.trim())
    }
    
    if (typeof params.department === 'string' && params.department.trim() && params.department !== 'all') {
        url.searchParams.set('department_id', params.department.trim())
    }
    
    if (typeof params.priority === 'string' && params.priority.trim() && params.priority !== 'all') {
        url.searchParams.set('priority_id', params.priority.trim())
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

        const payload = ((await response.json()) as TicketsApiResponse) || {}

        if (!response.ok || payload.status === false) {
            return { list: [], total: 0, statusList: [], departmentList: [], priorityList: [] }
        }

        return normalizeTicketsData(payload.data)
    } catch {
        return { list: [], total: 0, statusList: [], departmentList: [], priorityList: [] }
    }
}

export default async function Page({ searchParams }: PageProps) {
    const params = await searchParams
    const data = await getTicketsFromInternalApi(params)

    return (
        <TicketListProvider
            ticketList={data.list}
            statusOptions={data.statusList}
            departmentOptions={data.departmentList}
            priorityOptions={data.priorityList}
        >
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>My Tickets</h3>
                            <TicketListActionTools />
                        </div>
                        <TicketListTableTools />
                        <TicketListTable
                            ticketListTotal={data.total}
                            pageIndex={parseInt(params.pageIndex as string) || 1}
                            pageSize={parseInt(params.pageSize as string) || 10}
                        />
                    </div>
                </AdaptiveCard>
            </Container>
        </TicketListProvider>
    )
}
