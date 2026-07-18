'use client'
import React from 'react';
import Card from '@/components/ui/Card';
import { Skeleton } from '@/components/ui';
import { FiDollarSign, FiActivity, FiClock, FiCalendar } from 'react-icons/fi';
import { useDashboardData } from './DashboardProvider';

const MonthSpend = () => {
    const { data, loading } = useDashboardData();

    if (loading || !data?.month_spend) {
        return (
            <Card className="h-full relative overflow-hidden flex flex-col p-8 min-h-[300px]">
                <div className="z-10 relative pb-4 border-b border-gray-100 dark:border-gray-800/60 mb-2">
                    <Skeleton className="w-48 h-6 mb-1" />
                    <Skeleton className="w-64 h-4 mt-1" />
                </div>
                
                <div className="z-10 relative flex-1 flex flex-col justify-between mt-2 pt-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between py-2 group">
                            <div className="flex items-center">
                                <Skeleton className="w-9 h-9 rounded-lg mr-4 shrink-0" />
                                <div>
                                    <Skeleton className="w-16 h-3 mb-1.5" />
                                    <Skeleton className="w-20 h-3" />
                                </div>
                            </div>
                            <Skeleton className="w-20 h-6" />
                        </div>
                    ))}
                </div>
                <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-indigo-50/40 dark:bg-indigo-900/10 rounded-full pointer-events-none" />
            </Card>
        );
    }

    const { month_spend } = data;
    const { total, currency } = month_spend;
    const symbol = currency === 'INR' ? '₹' : '$';

    return (
        <Card className="h-full relative overflow-hidden flex flex-col p-8 min-h-[300px]">
            {/* Header */}
            <div className="z-10 relative pb-4 border-b border-gray-100 dark:border-gray-800/60 mb-2">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Spend Summary</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">API usage limits recharged auto</p>
            </div>
            
            {/* List */}
            <div className="z-10 relative flex-1 flex flex-col justify-between mt-2 pt-4">
                {/* Weekly */}
                <div className="flex items-center justify-between py-2 group">
                    <div className="flex items-center">
                        <div className="p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg mr-4 group-hover:bg-gray-100 dark:group-hover:bg-gray-800 transition-colors">
                            <FiActivity className="w-4 h-4 text-gray-400" />
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">Weekly</p>
                            <p className="text-[13px] text-gray-500 font-medium mt-0.5">Avg. usage</p>
                        </div>
                    </div>
                    <p className="text-xl font-bold text-slate-800 dark:text-gray-200">{symbol}{(total / 4).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                
                {/* Monthly (Highlighted) */}
                <div className="flex items-center justify-between py-3 relative">
                    <div className="absolute -left-8 w-1.5 h-full bg-indigo-500 rounded-r-md"></div>
                    <div className="flex items-center">
                        <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/40 rounded-lg mr-4">
                            <FiClock className="w-4 h-4 text-indigo-500" />
                        </div>
                        <div>
                            <p className="text-[11px] text-indigo-500 font-bold uppercase tracking-widest">Monthly</p>
                            <p className="text-[13px] text-indigo-400 font-medium mt-0.5">Current cycle</p>
                        </div>
                    </div>
                    <p className="text-[1.75rem] leading-none font-extrabold text-indigo-600 dark:text-indigo-400">{symbol}{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                
                {/* Yearly */}
                <div className="flex items-center justify-between py-2 group">
                    <div className="flex items-center">
                        <div className="p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg mr-4 group-hover:bg-gray-100 dark:group-hover:bg-gray-800 transition-colors">
                            <FiCalendar className="w-4 h-4 text-gray-400" />
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">Yearly</p>
                            <p className="text-[13px] text-gray-500 font-medium mt-0.5">Projected</p>
                        </div>
                    </div>
                    <p className="text-xl font-bold text-slate-800 dark:text-gray-200">{symbol}{(total * 12).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
            </div>
            
            {/* Decorative background circle */}
            <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-indigo-50/40 dark:bg-indigo-900/10 rounded-full pointer-events-none" />
        </Card>
    );
};

export default MonthSpend;
