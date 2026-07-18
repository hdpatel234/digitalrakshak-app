'use client'
import React from 'react';
import { FiUsers, FiClock, FiCheckCircle, FiShield, FiZap, FiCreditCard } from 'react-icons/fi';
import Card from '@/components/ui/Card';
import { Skeleton } from '@/components/ui';
import { useDashboardData } from './DashboardProvider';
import GrowShrinkValue from '@/components/shared/GrowShrinkValue';
import { NumericFormat } from 'react-number-format';
import classNames from 'classnames';
import type { ReactNode } from 'react';

type StatisticCardProps = {
    title: string
    value: number | ReactNode
    icon: ReactNode
    growShrink: number
    iconClass: string
    compareFrom: string
}

const StatisticCard = (props: StatisticCardProps) => {
    const { title, value, icon, growShrink, iconClass, compareFrom } = props

    return (
        <Card>
            <div className="flex justify-between relative">
                <div>
                    <div className="mb-4 text-sm font-semibold">{title}</div>
                    <h3 className="mb-1 text-2xl font-bold">{value}</h3>
                    <div className="inline-flex items-center flex-wrap gap-1">
                        <GrowShrinkValue
                            className="font-bold"
                            value={growShrink}
                            suffix="%"
                            positiveIcon="+"
                            negativeIcon=""
                        />
                        <span className="text-sm text-gray-500">{compareFrom}</span>
                    </div>
                </div>
                <div
                    className={classNames(
                        'flex items-center justify-center min-h-12 min-w-12 max-h-12 max-w-12 text-gray-900 rounded-full text-2xl',
                        iconClass,
                    )}
                >
                    {icon}
                </div>
            </div>
        </Card>
    )
}

const DashboardStats = () => {
    const { data, loading } = useDashboardData();

    if (loading || !data?.stats) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <div className="flex justify-between relative">
                            <div>
                                <Skeleton className="w-24 h-4 mb-4" />
                                <Skeleton className="w-16 h-8 mb-1" />
                                <Skeleton className="w-32 h-4" />
                            </div>
                            <Skeleton variant="circle" className="w-12 h-12" />
                        </div>
                    </Card>
                ))}
            </div>
        );
    }

    const { stats } = data;

    const statsConfig = [
        {
            title: 'Total Candidates',
            value: stats.total_verifications || 0,
            growShrink: 12.5,
            compareFrom: 'from last month',
            iconClass: 'bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-100',
            icon: <FiUsers />,
        },
        {
            title: 'In Progress',
            value: stats.in_progress || 0,
            growShrink: 8.4,
            compareFrom: 'from last month',
            iconClass: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100',
            icon: <FiZap />,
        },
        {
            title: 'Insufficiency',
            value: stats.flagged || 0,
            growShrink: -2.1,
            compareFrom: 'from last month',
            iconClass: 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-100',
            icon: <FiShield />,
        },
        {
            title: 'Verification Completed',
            value: stats.completed || 0,
            growShrink: 15.3,
            compareFrom: 'from last month',
            iconClass: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-100',
            icon: <FiCheckCircle />,
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {statsConfig.map((stat, index) => (
                <StatisticCard 
                    key={index} 
                    title={stat.title}
                    value={<NumericFormat displayType="text" value={stat.value} thousandSeparator={true} />}
                    growShrink={stat.growShrink}
                    compareFrom={stat.compareFrom}
                    iconClass={stat.iconClass}
                    icon={stat.icon}
                />
            ))}
        </div>
    );
};

export default DashboardStats;
