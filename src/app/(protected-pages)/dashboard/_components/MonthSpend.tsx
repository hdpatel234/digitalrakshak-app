'use client'
import React from 'react';
import Card from '@/components/ui/Card';
import { FiDollarSign, FiActivity, FiClock, FiCalendar } from 'react-icons/fi';
import { useDashboardData } from './DashboardProvider';

const MonthSpend = () => {
    const { data, loading } = useDashboardData();

    if (loading || !data?.month_spend) {
        return <Card className="h-full relative overflow-hidden flex flex-col p-8 min-h-[300px] animate-pulse bg-gray-100 dark:bg-gray-800"></Card>;
    }

    const { month_spend } = data;
    const { total, currency } = month_spend;
    const symbol = currency === 'INR' ? '₹' : '$';

    return (
        <Card className="h-full relative overflow-hidden flex flex-col p-8 min-h-[300px]">
            {/* Header */}
            <div className="z-10 relative mb-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 tracking-widest uppercase mt-1">Spend Summary</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
                            API usage limits recharged auto
                        </p>
                    </div>
                    <div className="text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 p-2.5 rounded-xl shrink-0 ml-4">
                        <FiDollarSign className="w-5 h-5 stroke-[2.5]" />
                    </div>
                </div>
            </div>
            
            {/* List */}
            <div className="z-10 relative flex-1 flex flex-col justify-between mt-2 pt-4 border-t border-gray-100 dark:border-gray-800/60">
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
