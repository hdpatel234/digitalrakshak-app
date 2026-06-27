import React from 'react';
import { FiUsers, FiClock, FiCheckCircle, FiShield, FiCreditCard, FiZap, FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';
import Card from '@/components/ui/Card';

const StatCard = ({ title, value, change, changeText, isPositive, isNegative, icon: Icon }) => (
    <Card className="flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wider uppercase">{title}</h3>
            <Icon className="text-gray-400 dark:text-gray-500 w-5 h-5" />
        </div>
        <div>
            <div className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">{value}</div>
            <div className="flex items-center text-sm">
                {isPositive && <FiArrowUpRight className="text-green-500 mr-1" />}
                {isNegative && <FiArrowDownRight className="text-red-500 mr-1" />}
                <span className={`${isPositive ? 'text-green-500 font-medium' : isNegative ? 'text-red-500 font-medium' : 'text-green-500 font-medium'}`}>
                    {change}
                </span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">{changeText}</span>
            </div>
        </div>
    </Card>
);

const DashboardStats = () => {
    const stats = [
        {
            title: 'Candidates Added',
            value: '1,482',
            change: '+12.4%',
            changeText: 'vs last 30 days',
            isPositive: true,
            icon: FiUsers,
        },
        {
            title: 'Form Pending',
            value: '42',
            change: '-8.1%',
            changeText: 'vs last 30 days',
            isNegative: true,
            icon: FiClock,
        },
        {
            title: 'In Progress',
            value: '1,410',
            change: '+18.2%',
            changeText: 'vs last 30 days',
            isPositive: true,
            icon: FiZap,
        },
        {
            title: 'Insufficiency',
            value: '30',
            change: '+2.1%',
            changeText: 'review required',
            isNegative: true,
            icon: FiShield,
        },
        {
            title: 'On Hold',
            value: '14',
            change: '-1.5%',
            changeText: 'needs attention',
            isNegative: true,
            icon: FiCreditCard,
        },
        {
            title: 'Verification Completed',
            value: '12,842',
            change: '+4.6%',
            changeText: 'success rate',
            isPositive: true,
            icon: FiCheckCircle,
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
            ))}
        </div>
    );
};

export default DashboardStats;
