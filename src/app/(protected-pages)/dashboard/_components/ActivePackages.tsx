'use client'
import React from 'react';
import { FiStar, FiArrowRight } from 'react-icons/fi';
import { TbShoppingCartPlus, TbUserPlus } from 'react-icons/tb';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui';
import Tooltip from '@/components/ui/Tooltip';
import Link from 'next/link';
import { useDashboardData } from './DashboardProvider';
import { useRouter } from 'next/navigation';

interface PackageItemProps {
    id: string | number;
    title: string;
    services: string | number;
    count: string | number;
    type?: string;
}

const PackageItem = ({ id, title, services, count, type }: PackageItemProps) => {
    const router = useRouter();

    const handleCreateOrder = () => {
        router.push(`/orders/create?packageId=${id}`);
    };

    const handleAddCandidate = () => {
        router.push(`/candidates/create?packageId=${id}`);
    };

    return (
        <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-800 last:border-0 group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors px-2 rounded-lg -mx-2">
            <div>
                <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h4>
                    {type === 'admin' && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300">Global</span>
                    )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{services} services</p>
            </div>
            
            <div className="flex items-center gap-4">
                <Badge className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium" content={count} />
                
                <div className="flex items-center gap-2">
                    <Tooltip title="Place Order">
                        <button 
                            onClick={handleCreateOrder}
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors dark:text-gray-400 dark:hover:bg-blue-500/20 dark:hover:text-blue-300"
                        >
                            <TbShoppingCartPlus className="w-5 h-5" />
                        </button>
                    </Tooltip>
                    <Tooltip title="Add Candidate">
                        <button 
                            onClick={handleAddCandidate}
                            className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors dark:text-gray-400 dark:hover:bg-emerald-500/20 dark:hover:text-emerald-300"
                        >
                            <TbUserPlus className="w-5 h-5" />
                        </button>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};

const ActivePackages = () => {
    const { data, loading } = useDashboardData();

    if (loading || !data?.active_packages) {
        return (
            <Card className="h-full flex flex-col p-0" bodyClass="p-0 flex flex-col h-full">
                <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Skeleton variant="circle" className="w-5 h-5" />
                        <Skeleton className="w-32 h-6" />
                    </div>
                    <div className="flex items-center gap-3">
                        <Skeleton className="w-20 h-4" />
                        <Skeleton className="w-16 h-4" />
                    </div>
                </div>
                <div className="px-5 flex-1 overflow-y-auto max-h-[400px]">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
                            <div className="flex items-center gap-3 w-full">
                                <Skeleton variant="circle" className="w-10 h-10" />
                                <div className="w-full">
                                    <Skeleton className="w-3/4 h-5 mb-1" />
                                    <Skeleton className="w-1/2 h-4" />
                                </div>
                            </div>
                            <Skeleton className="w-16 h-8 rounded-full shrink-0 ml-4" />
                        </div>
                    ))}
                </div>
            </Card>
        );
    }

    const packages = data.active_packages.map((pkg: any) => ({
        id: pkg.id,
        title: pkg.name,
        services: pkg.services_count ?? 'N/A',
        count: pkg.price ? `₹${pkg.price}` : 'Free',
        type: pkg.type
    }));

    return (
        <Card className="h-full flex flex-col p-0" bodyClass="p-0 flex flex-col h-full">
            <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <FiStar className="text-blue-500 w-5 h-5" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active packages</h2>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{packages.length} Packages</span>
                    <Link href="/packages/list" className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1 hover:underline">
                        View all <FiArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
            <div className="px-5 flex-1 overflow-y-auto max-h-[400px]">
                {packages.length > 0 ? (
                    packages.map((pkg, index) => (
                        <PackageItem key={index} {...pkg} />
                    ))
                ) : (
                    <div className="py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                        No active packages found
                    </div>
                )}
            </div>
        </Card>
    );
};

export default ActivePackages;
