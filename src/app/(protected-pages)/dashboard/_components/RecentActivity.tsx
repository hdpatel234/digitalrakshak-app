import React from 'react';
import { FiCheckCircle, FiClock, FiMail, FiShield } from 'react-icons/fi';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';

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
    const activities = [
        {
            title: 'Ananya Iyer',
            subtitle: 'Executive Background',
            time: '2m ago',
            icon: FiCheckCircle,
            iconClass: 'text-green-500 border-green-200 dark:border-green-900',
        },
        {
            title: 'Rohan Das',
            subtitle: 'Awaiting Aadhaar OTP',
            time: '12m ago',
            icon: FiClock,
            iconClass: 'text-yellow-500 border-yellow-200 dark:border-yellow-900',
        },
        {
            title: 'vikram.s@vertex.in',
            subtitle: 'Invitation sent',
            time: '38m ago',
            icon: FiMail,
            iconClass: 'text-blue-500 border-blue-200 dark:border-blue-900',
        },
        {
            title: 'Karan Joshi',
            subtitle: 'Face match mismatch',
            time: '1h ago',
            icon: FiShield,
            iconClass: 'text-red-500 border-red-200 dark:border-red-900',
        },
        {
            title: 'Priya Sharma',
            subtitle: 'Basic KYC',
            time: '2h ago',
            icon: FiCheckCircle,
            iconClass: 'text-green-500 border-green-200 dark:border-green-900',
        },
        {
            title: 'Aditya Patel',
            subtitle: 'Vendor Verification',
            time: '3h ago',
            icon: FiCheckCircle,
            iconClass: 'text-green-500 border-green-200 dark:border-green-900',
        }
    ];

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
