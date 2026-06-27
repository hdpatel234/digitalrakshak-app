import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Chart from '@/components/shared/Chart';

const VerificationTrendChart = () => {
    const series = [
        { name: 'Total Verifications', data: [15, 28, 25, 5, 23, 27, 24, 15, 5, 20, 23, 10, 8, 22].map(x => x * 4) },
        { name: 'Successful', data: [15, 28, 25, 5, 23, 27, 24, 15, 5, 20, 23, 10, 8, 22] }
    ];

    return (
        <Card className="mb-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Verification trend</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Last 14 days</p>
                </div>
                <div className="flex bg-gray-50 dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
                    <Button size="sm" variant="solid" className="px-3 py-1 shadow-sm">14D</Button>
                    <Button size="sm" variant="plain" className="px-3 py-1 text-gray-500">30D</Button>
                    <Button size="sm" variant="plain" className="px-3 py-1 text-gray-500">90D</Button>
                </div>
            </div>
            <div className="h-[300px]">
                <Chart
                    type="area"
                    series={series}
                    xAxis={['Jun 14', 'Jun 15', 'Jun 16', 'Jun 17', 'Jun 18', 'Jun 19', 'Jun 20', 'Jun 21', 'Jun 22', 'Jun 23', 'Jun 24', 'Jun 25', 'Jun 26', 'Jun 27']}
                    height={300}
                    customOptions={{
                        colors: ['#3b82f6', '#10b981'],
                        stroke: { curve: 'smooth', width: 2 },
                        fill: {
                            type: 'gradient',
                            gradient: { shadeIntensity: 1, opacityFrom: 0.2, opacityTo: 0.0, stops: [0, 100] },
                        },
                        legend: { show: false },
                        dataLabels: { enabled: false },
                    }}
                />
            </div>
        </Card>
    );
};

export default VerificationTrendChart;
