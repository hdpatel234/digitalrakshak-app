import DashboardHeader from './_components/DashboardHeader'
import DashboardStats from './_components/DashboardStats'
import VerificationTrendChart from './_components/VerificationTrendChart'
import RecentActivity from './_components/RecentActivity'
import ServiceUsageChart from './_components/ServiceUsageChart'
import MonthSpend from './_components/MonthSpend'
import ActivePackages from './_components/ActivePackages'
import LatestCandidates from './_components/LatestCandidates'
import Container from '@/components/shared/Container'
import getServerSession from '@/server/actions/auth/getServerSession'
import { DashboardProvider } from './_components/DashboardProvider'

export default async function Page() {
    const session = await getServerSession()
    const userName = session?.user?.name || 'User'
    
    return (
        <Container>
            <DashboardProvider>
                <div className="flex flex-col gap-4">
                    <DashboardHeader userName={userName} userAuthority={session?.user?.authority || []} userPermissions={session?.user?.permissions || []} />
                    <DashboardStats />
                    
                    <VerificationTrendChart />
                    
                    <RecentActivity />
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <ServiceUsageChart />
                        </div>
                        <div>
                            <MonthSpend />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ActivePackages />
                        <LatestCandidates />
                    </div>
                </div>
            </DashboardProvider>
        </Container>
    )
}