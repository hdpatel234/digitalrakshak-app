import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import { headers } from 'next/headers'

type OrderReportData = {
    turnaroundSla: {
        title: string
        time: string
        description: string
    }[]
}

async function getOrderReportData(): Promise<OrderReportData | null> {
    const headerStore = await headers()
    const host = headerStore.get('x-forwarded-host') || headerStore.get('host') || ''
    const protocol = headerStore.get('x-forwarded-proto') || (process.env.NODE_ENV === 'development' ? 'http' : 'https')

    if (!host) {
        return null
    }

    const url = new URL('/api/client/reports/orders', `${protocol}://${host}`)
    
    try {
        const cookie = headerStore.get('cookie') || ''
        const response = await fetch(url.toString(), {
            method: 'GET',
            cache: 'no-store',
            headers: cookie ? { cookie } : undefined,
        })
        const payload = await response.json()
        if (payload?.status) {
            return payload.data
        }
        return null
    } catch {
        return null
    }
}

export default async function Page() {
    const data = await getOrderReportData()

    if (!data) {
        return (
            <Container>
                <div className="text-center py-10">Failed to load onboarding orders report data.</div>
            </Container>
        )
    }

    const { turnaroundSla } = data

    return (
        <Container>
            <div className="flex flex-col gap-6">
                <div>
                    <h3 className="mb-1 text-2xl font-bold text-gray-900 dark:text-gray-100">Onboarding Orders Reports</h3>
                    <p className="text-gray-500 dark:text-gray-400">Analyze volume thresholds, check success rates, and mean completion turnaround times (SLA).</p>
                </div>
                
                <AdaptiveCard>
                    <h4 className="mb-6 font-bold text-gray-900 dark:text-gray-100">Average Processing Turnaround SLA</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {turnaroundSla.map((item, index) => (
                            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col gap-2">
                                <div className="text-sm font-semibold text-gray-400">{item.title}</div>
                                <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                                    {item.time}
                                </div>
                                <div className="text-xs text-gray-400">
                                    {item.description}
                                </div>
                            </div>
                        ))}
                    </div>
                </AdaptiveCard>
            </div>
        </Container>
    )
}
