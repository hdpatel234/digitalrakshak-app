'use client'
import React from 'react';
import { FiArrowRight, FiStar } from 'react-icons/fi';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { useDashboardData } from './DashboardProvider';
import Link from 'next/link';

interface CandidateItemProps {
    initials: string;
    name: string;
    email: string;
    packagesCount: number;
    status: string;
    statusColor: {
        bg: string;
        text: string;
        badge: string;
    };
}

const CandidateItem = ({ initials, name, email, packagesCount, status, statusColor }: CandidateItemProps) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
        <div className="flex items-center gap-4">
            <Avatar className={`${statusColor.bg} ${statusColor.text} font-semibold`} size="md" shape="circle">
                {initials}
            </Avatar>
            <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">{name}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{email}</p>
            </div>
        </div>
        <Badge className={`border ${statusColor.badge} font-medium px-3 py-1 rounded-full`} content={status} />
    </div>
);

const LatestCandidates = () => {
    const { data, loading } = useDashboardData();

    if (loading || !data?.latest_candidates) {
        return <Card className="mb-6 h-[400px] flex flex-col p-0 animate-pulse bg-gray-100 dark:bg-gray-800"></Card>;
    }

    const getStatusColor = (status: string) => {
        if (status === 'Verified') {
            return {
                bg: 'bg-green-50 dark:bg-green-900/30',
                text: 'text-green-700 dark:text-green-400',
                badge: 'border-green-200 text-green-600 bg-green-50 dark:border-green-900/50 dark:text-green-400 dark:bg-green-900/20'
            };
        } else if (status === 'Failed' || status === 'Flagged') {
            return {
                bg: 'bg-red-50 dark:bg-red-900/30',
                text: 'text-red-700 dark:text-red-400',
                badge: 'border-red-200 text-red-600 bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:bg-red-900/20'
            };
        } else {
            return {
                bg: 'bg-blue-50 dark:bg-blue-900/30',
                text: 'text-blue-700 dark:text-blue-400',
                badge: 'border-gray-200 text-gray-600 bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:bg-gray-800'
            };
        }
    };

    const candidates = data.latest_candidates.map((cand: any) => {
        const names = cand.name.split(' ');
        const initials = names.length > 1 ? `${names[0][0]}${names[1][0]}` : names[0].substring(0, 2).toUpperCase();

        return {
            initials,
            name: cand.name,
            email: cand.email || 'N/A',
            packagesCount: cand.packages_count || 0,
            status: cand.status || 'Pending',
            statusColor: getStatusColor(cand.status || 'Pending')
        };
    });

    return (
        <Card className="mb-6 h-full flex flex-col p-0" bodyClass="p-0 flex flex-col h-full">
            <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <FiStar className="text-blue-500 w-5 h-5" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Latest Candidates</h2>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{candidates.length} Candidates</span>
                    <Link href="/candidates/list" className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1 hover:underline">
                        View all <FiArrowRight className="w-4 h-4" />
                    </Link>
                </div>
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
