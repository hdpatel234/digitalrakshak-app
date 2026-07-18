'use client'
import React from 'react';
import { FiCheckCircle, FiClock, FiMail, FiShield, FiInfo } from 'react-icons/fi';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui';
import { useDashboardData } from './DashboardProvider';

interface ActivityItemProps {
    title: string;
    subtitle: string;
    time: string;
    icon: React.ElementType;
    iconClass: string;
}

const ActivityItem = ({ title, subtitle, time, icon: Icon, iconClass }: ActivityItemProps) => (
    <div className="flex items-start justify-between py-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
        <div className="flex items-start gap-4">
            <div className={`mt-1 p-1.5 rounded-full bg-white dark:bg-gray-800 border ${iconClass}`}>
                <Icon className="w-4 h-4" />
            </div>
            <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
            </div>
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">{time}</span>
    </div>
);

const RecentActivity = () => {
    const { data, loading } = useDashboardData();

    if (loading || !data?.recent_activities) {
        return (
            <Card className="p-0 h-full" bodyClass="p-0">
                <div className="p-5 border-b border-gray-200 dark:border-gray-800">
                    <Skeleton className="w-32 h-6 mb-1" />
                    <Skeleton className="w-48 h-4" />
                </div>
                <div className="px-5 pb-2">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-start justify-between py-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
                            <div className="flex items-start gap-4 w-full">
                                <Skeleton variant="circle" className="w-8 h-8 shrink-0 mt-1" />
                                <div className="w-full">
                                    <Skeleton className="w-3/4 h-5 mb-1.5" />
                                    <Skeleton className="w-1/2 h-4" />
                                </div>
                            </div>
                            <Skeleton className="w-16 h-4 shrink-0" />
                        </div>
                    ))}
                </div>
            </Card>
        );
    }

    const { recent_activities } = data;

    const activities = recent_activities.map((act: any) => {
        let icon = FiInfo;
        let iconClass = 'text-gray-500 border-gray-200 dark:border-gray-900';

        if (act.type === 'success') {
            icon = FiCheckCircle;
            iconClass = 'text-green-500 border-green-200 dark:border-green-900';
        } else if (act.type === 'warning') {
            icon = FiShield;
            iconClass = 'text-red-500 border-red-200 dark:border-red-900';
        } else if (act.type === 'info') {
            icon = FiCheckCircle;
            iconClass = 'text-blue-500 border-blue-200 dark:border-blue-900';
        }

        return {
            title: act.description,
            subtitle: act.type,
            time: act.timestamp,
            icon,
            iconClass
        };
    });

    return (
        <Card className="p-0 h-full" bodyClass="p-0">
            <div className="p-5 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent activity</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Live verification events</p>
            </div>
            <div className="px-5 pb-2">
                {activities.map((activity, index) => (
                    <ActivityItem key={index} {...activity} />
                ))}
            </div>
        </Card>
    );
};

export default RecentActivity;
