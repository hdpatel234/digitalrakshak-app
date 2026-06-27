'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import Chart from '@/components/shared/Chart';

const ServiceUsageChart = () => {
    const series = [45, 25, 15, 15];
    const labels = ['Aadhaar OTP', 'PAN Validate', 'Face AI Match', 'Education'];
    const colors = ['#4f46e5', '#10b981', '#f59e0b', '#818cf8'];

    return (
        <Card className="h-full flex flex-col p-6">
            <div className="pb-4 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Service Usage Share</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total volume split across gateway services.</p>
            </div>
            
            <div className="flex-1 flex flex-col md:flex-row items-center justify-center pt-8 pb-4">
                <div className="flex justify-center w-full md:w-1/2 h-[260px]">
                    <Chart
                        type="donut"
                        series={series}
                        height={260}
                        customOptions={{
                            labels: labels,
                            colors: colors,
                            dataLabels: { enabled: false },
                            legend: { show: false },
                            stroke: { show: false },
                            plotOptions: {
                                pie: {
                                    donut: {
                                        size: '75%',
                                        labels: {
                                            show: true,
                                            name: {
                                                show: true,
                                                fontSize: '12px',
                                                fontFamily: 'inherit',
                                                fontWeight: 600,
                                                color: '#6b7280',
                                                offsetY: -10
                                            },
                                            value: {
                                                show: true,
                                                fontSize: '24px',
                                                fontFamily: 'inherit',
                                                fontWeight: 700,
                                                color: '#111827',
                                                offsetY: 5,
                                                formatter: function (val) {
                                                    return val;
                                                }
                                            },
                                            total: {
                                                show: true,
                                                showAlways: true,
                                                label: 'TOTAL HITS',
                                                fontSize: '14px',
                                                fontFamily: 'inherit',
                                                fontWeight: 700,
                                                color: '#9ca3af',
                                                formatter: function () {
                                                    return '4,120'
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }}
                    />
                </div>
                
                <div className="flex flex-col space-y-6 w-full md:w-1/2 mt-8 md:mt-0 md:pl-12">
                    {labels.map((label, index) => (
                        <div key={label} className="flex items-center text-sm">
                            <span 
                                className="w-3 h-3 rounded-full mr-4 flex-shrink-0" 
                                style={{ backgroundColor: colors[index] }}
                            />
                            <div className="flex justify-between w-full">
                                <span className="text-gray-600 dark:text-gray-400 font-medium whitespace-nowrap">
                                    {label}
                                </span>
                                <span className="text-gray-800 dark:text-gray-200 font-bold ml-4">
                                    {series[index]}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};

export default ServiceUsageChart;
