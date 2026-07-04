import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Chart from '@/components/shared/Chart'
import { headers } from 'next/headers'
import Card from '@/components/ui/Card'

type SpendingData = {
    overview: {
        totalYearToDateSpend: number
        efficiencyIncrease: number
        averageCostPerHire: number
        activeSlaGuarantee: number
    }
    monthlyBudgetConsumption: {
        categories: string[]
        series: { name: string; data: number[] }[]
    }
}

async function getSpendingData(): Promise<SpendingData | null> {
    const headerStore = await headers()
    const host = headerStore.get('x-forwarded-host') || headerStore.get('host') || ''
    const protocol = headerStore.get('x-forwarded-proto') || (process.env.NODE_ENV === 'development' ? 'http' : 'https')

    if (!host) {
        return null
    }

    const url = new URL('/api/client/reports/spending', 'http://localhost')
    
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
    const data = await getSpendingData()

    if (!data) {
        return (
            <Container>
                <div className="text-center py-10">Failed to load spending report data.</div>
            </Container>
        )
    }

    const { overview, monthlyBudgetConsumption } = data

    return (
        <Container>
            <div className="flex flex-col gap-6">
                <div>
                    <h3 className="mb-1 text-2xl font-bold text-gray-900 dark:text-gray-100">Corporate Spending Reports</h3>
                    <p className="text-gray-500 dark:text-gray-400">Real-time charts plotting gateway budget drain, transactions, and average check cost matrices.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="flex flex-col gap-2">
                        <div className="text-sm font-semibold text-gray-400 uppercase">Total Year-to-date Spend</div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            ${overview.totalYearToDateSpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className="text-sm font-semibold text-emerald-500">
                            {overview.efficiencyIncrease}% efficiency increase since Q1
                        </div>
                    </Card>
                    <Card className="flex flex-col gap-2">
                        <div className="text-sm font-semibold text-gray-400 uppercase">Average Cost Per Hire</div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            ${overview.averageCostPerHire.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className="text-sm text-gray-400">
                            Calculated across basic and premium packages
                        </div>
                    </Card>
                    <Card className="flex flex-col gap-2">
                        <div className="text-sm font-semibold text-gray-400 uppercase">Active SLA Guarantee</div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            {overview.activeSlaGuarantee}%
                        </div>
                        <div className="text-sm font-semibold text-indigo-500">
                            Automatic gateway rerouting live
                        </div>
                    </Card>
                </div>

                <AdaptiveCard>
                    <h4 className="mb-4">Monthly API Budget Consumption ($)</h4>
                    <Chart 
                        type="bar"
                        series={monthlyBudgetConsumption.series}
                        xAxis={monthlyBudgetConsumption.categories}
                        height={400}
                        customOptions={{
                            colors: ['#6366f1'],
                            plotOptions: {
                                bar: {
                                    borderRadius: 4,
                                    columnWidth: '40%',
                                }
                            },
                            dataLabels: {
                                enabled: false
                            },
                            grid: {
                                strokeDashArray: 4,
                            }
                        }}
                    />
                </AdaptiveCard>
            </div>
        </Container>
    )
}
