'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { apiGetDashboardData } from '@/services/client/dashboard'

interface DashboardData {
    stats: any;
    verification_trend: any[];
    recent_activities: any[];
    service_usage: any[];
    month_spend: any;
    active_packages: any[];
    latest_candidates: any[];
}

interface DashboardContextType {
    data: DashboardData | null;
    loading: boolean;
    error: any;
}

const DashboardContext = createContext<DashboardContextType>({
    data: null,
    loading: true,
    error: null,
})

export const useDashboardData = () => useContext(DashboardContext)

export const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
    const [data, setData] = useState<DashboardData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<any>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response: any = await apiGetDashboardData()
                if (response?.data) {
                    setData(response.data)
                }
            } catch (err) {
                console.error('Failed to fetch dashboard data', err)
                setError(err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    return (
        <DashboardContext.Provider value={{ data, loading, error }}>
            {children}
        </DashboardContext.Provider>
    )
}
