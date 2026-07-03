'use client'

import { useState } from 'react'
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import { Select, Checkbox, Button } from '@/components/ui'
import { HiOutlineDownload } from 'react-icons/hi'

const formatOptions = [
    { value: 'csv', label: 'Excel Spreadsheet (CSV)' },
    { value: 'json', label: 'JSON Data' },
    { value: 'pdf', label: 'PDF Document' },
]

const dateRangeOptions = [
    { value: 'all', label: 'Complete Lifespan Records' },
    { value: 'last30', label: 'Last 30 Days' },
    { value: 'last90', label: 'Last 90 Days' },
    { value: 'thisYear', label: 'This Year' },
]

export default function Page() {
    const [format, setFormat] = useState(formatOptions[0])
    const [dateRange, setDateRange] = useState(dateRangeOptions[0])
    
    const [collections, setCollections] = useState({
        candidateProfiles: true,
        walletRecharges: true,
        systemAuditLogs: true,
        supportHelperTickets: true,
    })

    const handleCollectionChange = (key: keyof typeof collections) => {
        setCollections(prev => ({
            ...prev,
            [key]: !prev[key]
        }))
    }

    return (
        <Container>
            <div className="flex flex-col gap-6">
                <div>
                    <h3 className="mb-1 text-2xl font-bold text-gray-900 dark:text-gray-100">Database Data Export Wizard</h3>
                    <p className="text-gray-500 dark:text-gray-400">Download end-to-end encrypted compliance logs, invoices, and candidate profiles in multiple formats.</p>
                </div>
                
                <div className="max-w-3xl">
                    <AdaptiveCard>
                        <div className="flex flex-col gap-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Export File Format</label>
                                    <Select 
                                        options={formatOptions}
                                        value={format}
                                        onChange={(val: any) => setFormat(val)}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Billing / Date Range</label>
                                    <Select 
                                        options={dateRangeOptions}
                                        value={dateRange}
                                        onChange={(val: any) => setDateRange(val)}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <label className="text-xs font-semibold text-gray-500 uppercase">Select Collections to Include</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div 
                                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex items-center cursor-pointer"
                                        onClick={() => handleCollectionChange('candidateProfiles')}
                                    >
                                        <Checkbox 
                                            checked={collections.candidateProfiles} 
                                            onChange={() => handleCollectionChange('candidateProfiles')}
                                        >
                                            Candidate profiles
                                        </Checkbox>
                                    </div>
                                    <div 
                                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex items-center cursor-pointer"
                                        onClick={() => handleCollectionChange('walletRecharges')}
                                    >
                                        <Checkbox 
                                            checked={collections.walletRecharges} 
                                            onChange={() => handleCollectionChange('walletRecharges')}
                                        >
                                            Wallet recharges
                                        </Checkbox>
                                    </div>
                                    <div 
                                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex items-center cursor-pointer"
                                        onClick={() => handleCollectionChange('systemAuditLogs')}
                                    >
                                        <Checkbox 
                                            checked={collections.systemAuditLogs} 
                                            onChange={() => handleCollectionChange('systemAuditLogs')}
                                        >
                                            System audit logs
                                        </Checkbox>
                                    </div>
                                    <div 
                                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex items-center cursor-pointer"
                                        onClick={() => handleCollectionChange('supportHelperTickets')}
                                    >
                                        <Checkbox 
                                            checked={collections.supportHelperTickets} 
                                            onChange={() => handleCollectionChange('supportHelperTickets')}
                                        >
                                            Support helper tickets
                                        </Checkbox>
                                    </div>
                                </div>
                            </div>

                            <Button 
                                variant="solid" 
                                color="indigo-600"
                                className="w-full h-12 flex items-center justify-center gap-2"
                                size="lg"
                            >
                                <HiOutlineDownload className="text-xl" />
                                <span>Compile & Export Data Package</span>
                            </Button>
                        </div>
                    </AdaptiveCard>
                </div>
            </div>
        </Container>
    )
}
