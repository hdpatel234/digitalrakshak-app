import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import { headers } from 'next/headers'
import Progress from '@/components/ui/Progress'

type VerificationReportData = {
    discrepancyDistribution: {
        title: string
        percent: number
        color: string
    }[]
    trustIndex: {
        statusLabel: string
        percent: number
        message: string
        footer: string
    }
}

async function getVerificationReportData(): Promise<VerificationReportData | null> {
    const headerStore = await headers()
    const host = headerStore.get('x-forwarded-host') || headerStore.get('host') || ''
    const protocol = headerStore.get('x-forwarded-proto') || (process.env.NODE_ENV === 'development' ? 'http' : 'https')

    if (!host) {
        return null
    }

    const url = new URL('/api/client/reports/verification', 'http://localhost')
    
    try {
        const { internalServerFetch } = await import('@/utils/serverFetch')
        const response = await internalServerFetch(url.pathname + url.search, undefined, {
            method: 'GET',
            cache: 'no-store',
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
    const data = await getVerificationReportData()

    if (!data) {
        return (
            <Container>
                <div className="text-center py-10">Failed to load verification report data.</div>
            </Container>
        )
    }

    const { discrepancyDistribution, trustIndex } = data

    return (
        <Container>
            <div className="flex flex-col gap-6">
                <div>
                    <h3 className="mb-1 text-2xl font-bold text-gray-900 dark:text-gray-100">Anomalies & Discrepancy Audits</h3>
                    <p className="text-gray-500 dark:text-gray-400">Analyze overall candidate risk score percentages and identify common background discrepancy factors.</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AdaptiveCard>
                        <h4 className="font-bold text-gray-900 dark:text-gray-100">Discrepancy Distribution Anomalies</h4>
                        <p className="mb-6 mt-2 text-sm text-gray-500 dark:text-gray-400">Most common background screening mismatch points recorded this year.</p>
                        
                        <div className="flex flex-col gap-6">
                            {discrepancyDistribution.map((item, index) => (
                                <div key={index} className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between font-semibold text-gray-700 dark:text-gray-300 text-sm">
                                        <span>{item.title}</span>
                                        <span>{item.percent}%</span>
                                    </div>
                                    <Progress 
                                        percent={item.percent} 
                                        customColorClass={item.color}
                                        showInfo={false}
                                    />
                                </div>
                            ))}
                        </div>
                    </AdaptiveCard>

                    <AdaptiveCard>
                        <h4 className="font-bold text-gray-900 dark:text-gray-100">Candidate Trust Index Proportions</h4>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Proportions of clear verification files vs identified risk levels.</p>
                        
                        <div className="flex flex-col items-center justify-center py-10 flex-grow text-center">
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
                                {trustIndex.statusLabel}
                            </div>
                            <div className="text-5xl font-bold text-emerald-500 mb-2">
                                {trustIndex.percent}%
                            </div>
                            <div className="text-sm font-semibold text-gray-500">
                                {trustIndex.message}
                            </div>
                        </div>

                        <div className="text-center text-xs text-gray-400 mt-auto border-t border-gray-200 dark:border-gray-700 pt-4">
                            {trustIndex.footer}
                        </div>
                    </AdaptiveCard>
                </div>
            </div>
        </Container>
    )
}
