'use client'
import React from 'react';
import { FiCheckCircle, FiClock, FiMail, FiShield, FiInfo } from 'react-icons/fi';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import { useDashboardData } from './DashboardProvider';

const ActivityItem = ({ title, subtitle, time, icon: Icon, iconClass }) => (
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
        return <Card className="mb-6 h-[400px] animate-pulse bg-gray-100 dark:bg-gray-800"></Card>;
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
        <Card className="mb-6 p-0" bodyClass="p-0">
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
