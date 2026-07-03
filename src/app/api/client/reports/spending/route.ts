import { NextResponse } from 'next/server'

export async function GET() {
    return NextResponse.json({
        status: true,
        data: {
            overview: {
                totalYearToDateSpend: 3420.00,
                efficiencyIncrease: 18,
                averageCostPerHire: 24.50,
                activeSlaGuarantee: 99.98,
            },
            monthlyBudgetConsumption: {
                categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun'],
                series: [
                    {
                        name: 'Consumption',
                        data: [1500, 2000, 2500, 3000, 3500]
                    }
                ]
            }
        }
    })
}
