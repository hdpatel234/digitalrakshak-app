import CustomerDetails from './_components/CustomerDetails'
import NoUserFound from '@/assets/svg/NoUserFound'
import { headers } from 'next/headers'
import isEmpty from 'lodash/isEmpty'
import type { Customer } from './types'

const mapCandidateToCustomer = (item: any): Customer & { invitations?: any[], candidateServices?: any[] } => {
    const record = item || {}
    const firstName = String(record.first_name ?? record.firstName ?? record.firstname ?? '')
    const lastName = String(record.last_name ?? record.lastName ?? record.lastname ?? '')
    const fullName = String(record.name ?? `${firstName} ${lastName}`.trim())

    const city = String(record.city ?? '').trim()
    const state = String(record.state ?? '').trim()
    const country = String(record.country ?? '').trim()
    const location = [city, state, country].filter(Boolean).join(', ') || '-'

    const id = String(record.id ?? '')
    const status = String(record.status ?? 'active').toLowerCase()

    return {
        id,
        name: fullName || '-',
        firstName,
        lastName,
        email: String(record.email ?? ''),
        img: String(record.img ?? record.image ?? record.avatar ?? ''),
        role: String(record.role ?? 'candidate'),
        lastOnline: Date.now() / 1000,
        status,
        package: String(record.package_name ?? record.package ?? '-'),
        progress: 0,
        assignedDate: record.created_at ?? new Date().toISOString(),
        personalInfo: {
            location,
            title: '',
            birthday: '',
            phoneNumber: String(record.phone_number ?? ''),
            dialCode: String(record.dialCode ?? ''),
            address: String(record.address ?? ''),
            postcode: String(record.postcode ?? ''),
            city,
            state,
            country,
            facebook: '',
            twitter: '',
            pinterest: '',
            linkedIn: '',
        },
        orderHistory: [],
        paymentMethod: [],
        subscription: [],
        totalSpending: 0,
        invitations: record.invitations ?? record.candidateInvitations ?? record.candidate_invitations ?? [],
        candidateServices: record.candidateServices ?? record.candidate_services ?? []
    }
}

const getCandidateFromInternalApi = async (id: string) => {
    const headerStore = await headers()
    const host =
        headerStore.get('x-forwarded-host') || headerStore.get('host') || ''
    const protocol =
        headerStore.get('x-forwarded-proto') ||
        (process.env.NODE_ENV === 'development' ? 'http' : 'https')

    if (!host) {
        return null
    }

    const url = new URL(`/api/client/candidates/${id}`, `${protocol}://${host}`)

    try {
        const cookie = headerStore.get('cookie') || ''
        const response = await fetch(url.toString(), {
            method: 'GET',
            cache: 'no-store',
            headers: cookie ? { cookie } : undefined,
        })

        const payload = await response.json()

        if (!response.ok || payload.status === false || !payload.data) {
            return null
        }

        return payload.data
    } catch {
        return null
    }
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params

    const rawCandidateData = await getCandidateFromInternalApi(params.id)

    if (isEmpty(rawCandidateData)) {
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <NoUserFound height={280} width={280} />
                <h2 className="mt-4">No candidate found!</h2>
            </div>
        )
    }

    const mappedData = mapCandidateToCustomer(rawCandidateData)

    return <CustomerDetails data={mappedData as any} />
}
