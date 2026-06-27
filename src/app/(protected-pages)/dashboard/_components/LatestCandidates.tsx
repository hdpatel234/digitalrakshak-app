import React from 'react';
import { FiArrowRight } from 'react-icons/fi';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';

const CandidateItem = ({ initials, name, email, status, statusColor }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
        <div className="flex items-center gap-4">
            <Avatar className={`${statusColor.bg} ${statusColor.text} font-semibold`} size="md" shape="circle">
                {initials}
            </Avatar>
            <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">{name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{email}</p>
            </div>
        </div>
        <Badge className={`border ${statusColor.badge} font-medium px-3 py-1 rounded-full`} content={status} />
    </div>
);

const LatestCandidates = () => {
    const candidates = [
        {
            initials: 'PS',
            name: 'Priya Sharma',
            email: 'priya.sharma@acme.io',
            status: 'Failed',
            statusColor: {
                bg: 'bg-pink-50 dark:bg-pink-900/30',
                text: 'text-pink-700 dark:text-pink-400',
                badge: 'border-red-200 text-red-600 bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:bg-red-900/20'
            }
        },
        {
            initials: 'AI',
            name: 'Arjun Iyer',
            email: 'arjun.iyer@vertex.in',
            status: 'Invited',
            statusColor: {
                bg: 'bg-red-50 dark:bg-red-900/30',
                text: 'text-red-700 dark:text-red-400',
                badge: 'border-gray-200 text-gray-600 bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:bg-gray-800'
            }
        },
        {
            initials: 'AK',
            name: 'Ananya Kapoor',
            email: 'ananya.kapoor@northwind.co',
            status: 'Failed',
            statusColor: {
                bg: 'bg-yellow-50 dark:bg-yellow-900/30',
                text: 'text-yellow-700 dark:text-yellow-400',
                badge: 'border-red-200 text-red-600 bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:bg-red-900/20'
            }
        },
        {
            initials: 'RB',
            name: 'Rohan Bose',
            email: 'rohan.bose@stripe.com',
            status: 'Verified',
            statusColor: {
                bg: 'bg-green-50 dark:bg-green-900/30',
                text: 'text-green-700 dark:text-green-400',
                badge: 'border-green-200 text-green-600 bg-green-50 dark:border-green-900/50 dark:text-green-400 dark:bg-green-900/20'
            }
        },
        {
            initials: 'KM',
            name: 'Kabir Mehta',
            email: 'kabir.mehta@linear.app',
            status: 'Failed',
            statusColor: {
                bg: 'bg-teal-50 dark:bg-teal-900/30',
                text: 'text-teal-700 dark:text-teal-400',
                badge: 'border-red-200 text-red-600 bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:bg-red-900/20'
            }
        }
    ];

    return (
        <Card className="mb-6 h-full flex flex-col p-0" bodyClass="p-0 flex flex-col h-full">
            <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Latest candidates</h2>
                <a href="#" className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1 hover:underline">
                    View all <FiArrowRight className="w-4 h-4" />
                </a>
            </div>
            <div className="px-5 pb-2 flex-1">
                {candidates.map((candidate, index) => (
                    <CandidateItem key={index} {...candidate} />
                ))}
            </div>
        </Card>
    );
};

export default LatestCandidates;
