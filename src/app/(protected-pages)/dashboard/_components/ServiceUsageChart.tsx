import React from 'react';
import Card from '@/components/ui/Card';
import Chart from '@/components/shared/Chart';

const ServiceUsageChart = () => {
    const series = [
        { name: 'Volume', data: [850, 850, 400, 450, 880, 830, 350] }
    ];

    return (
        <Card className="mb-6 h-full flex flex-col">
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Service usage</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Verification volume by service</p>
            </div>
            <div className="h-[250px]">
                <Chart
                    type="bar"
                    series={series}
                    xAxis={['Aadhaar', 'PAN', 'Address', 'Face', 'Education', 'Employment', 'Bank']}
                    height={250}
                    customOptions={{
                        colors: ['#2563eb'],
                        plotOptions: {
                            bar: {
                                columnWidth: '40%',
                                borderRadius: 4,
                            }
                        },
                        dataLabels: { enabled: false },
                        legend: { show: false }
                    }}
                />
            </div>
        </Card>
    );
};

export default ServiceUsageChart;
