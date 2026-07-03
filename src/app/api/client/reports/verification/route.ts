import { NextResponse } from 'next/server'

export async function GET() {
    return NextResponse.json({
        status: true,
        data: {
            discrepancyDistribution: [
                {
                    title: 'Academic Tenure mismatch',
                    percent: 45,
                    color: 'bg-indigo-600'
                },
                {
                    title: 'Address / Location coordinates discrepancy',
                    percent: 25,
                    color: 'bg-blue-500'
                },
                {
                    title: 'PAN Name spelling anomalies',
                    percent: 18,
                    color: 'bg-orange-500'
                },
                {
                    title: 'Face AI Match mismatch',
                    percent: 12,
                    color: 'bg-rose-500'
                }
            ],
            trustIndex: {
                statusLabel: 'GREEN CLEAR STATUS',
                percent: 88.5,
                message: 'Excellent candidate health ratio',
                footer: 'Remaining 11.5% matches consist of minor spelling anomalies and address tenures. Standard compliance limits optimized.'
            }
        }
    })
}
