import React from 'react';
import { FiPlus } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import Link from 'next/link';

const DashboardHeader = ({ userName = 'User' }: { userName?: string }) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {userName}</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Here's what's happening across your verifications today.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
                <Link href="/candidates/create">
                    <Button variant="default" icon={<FiPlus className="w-4 h-4" />}>
                        New candidate
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default DashboardHeader;
