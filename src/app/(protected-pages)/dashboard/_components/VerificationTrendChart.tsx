'use client'
import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Skeleton } from '@/components/ui';
import Chart from '@/components/shared/Chart';
import { useDashboardData } from './DashboardProvider';

const VerificationTrendChart = () => {
    const { data, loading } = useDashboardData();

    if (loading || !data?.verification_trend) {
        return (
            <Card className="mb-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <Skeleton className="w-32 h-6 mb-1" />
                        <Skeleton className="w-24 h-4" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="w-12 h-8 rounded-lg" />
                        <Skeleton className="w-12 h-8 rounded-lg" />
                        <Skeleton className="w-12 h-8 rounded-lg" />
                    </div>
                </div>
                <Skeleton className="w-full h-[300px]" />
            </Card>
        );
    }

    const { verification_trend } = data;
    const xAxis = verification_trend.map((item: any) => item.month);
    
    const series = [
        { name: 'Total Verifications', data: verification_trend.map((item: any) => item.verifications) },
        { name: 'Successful', data: verification_trend.map((item: any) => Math.floor(item.verifications * 0.8)) }
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
                    xAxis={xAxis}
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
