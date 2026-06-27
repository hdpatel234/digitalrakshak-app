import React from 'react';
import { FiStar } from 'react-icons/fi';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

const PackageItem = ({ title, services, count }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
        <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-0.5">{title}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{services} services</p>
        </div>
        <Badge className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium" content={count} />
    </div>
);

const ActivePackages = () => {
    const packages = [
        { title: 'Basic KYC', services: '2', count: '412' },
        { title: 'Employee Verification', services: '6', count: '286' },
        { title: 'Executive Background', services: '8', count: '64' },
        { title: 'Vendor Verification', services: '3', count: '138' },
    ];

    return (
        <Card className="mb-6 h-full flex flex-col p-0" bodyClass="p-0 flex flex-col h-full">
            <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
                <FiStar className="text-blue-500 w-5 h-5" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active packages</h2>
            </div>
            <div className="px-5 flex-1">
                {packages.map((pkg, index) => (
                    <PackageItem key={index} {...pkg} />
                ))}
            </div>
        </Card>
    );
};

export default ActivePackages;
