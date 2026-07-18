import DashboardHeader from './_components/DashboardHeader'
import DashboardStats from './_components/DashboardStats'
import VerificationTrendChart from './_components/VerificationTrendChart'
import RecentActivity from './_components/RecentActivity'
import ServiceUsageChart from './_components/ServiceUsageChart'
import MonthSpend from './_components/MonthSpend'
import ActivePackages from './_components/ActivePackages'
import LatestCandidates from './_components/LatestCandidates'
import getServerSession from '@/server/actions/auth/getServerSession'
import { DashboardProvider } from './_components/DashboardProvider'
import AuthorityCheck from '@/components/shared/AuthorityCheck'
import { USER_PERMISSIONS } from '@/constants/permissions.constant'
import { ADMIN, USER } from '@/constants/roles.constant'

export default async function Page() {
    const session = await getServerSession()
    const userName = session?.user?.name || 'User'
    const userAuthority = session?.user?.authority || []
    const userPermissions = session?.user?.permissions || []
    
    return (
        <div>
            <DashboardProvider>
                <div className="flex flex-col gap-4 max-w-full overflow-x-hidden">
                    <DashboardHeader userName={userName} userAuthority={userAuthority} userPermissions={userPermissions} />
                    
                    <AuthorityCheck authority={[ADMIN, USER]} permissions={[USER_PERMISSIONS.DASHBOARD_STATS]}>
                        <DashboardStats />
                    </AuthorityCheck>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <AuthorityCheck authority={[ADMIN, USER]} permissions={[USER_PERMISSIONS.DASHBOARD_VERIFICATION_TREND]}>
                            <div className="lg:col-span-2">
                                <VerificationTrendChart />
                            </div>
                        </AuthorityCheck>
                        <AuthorityCheck authority={[ADMIN, USER]} permissions={[USER_PERMISSIONS.DASHBOARD_SERVICE_USAGE]}>
                            <div>
                                <ServiceUsageChart />
                            </div>
                        </AuthorityCheck>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <AuthorityCheck authority={[ADMIN, USER]} permissions={[USER_PERMISSIONS.REPORT_SPENDING_REPORT]}>
                            <div className="lg:col-span-1">
                                <MonthSpend />
                            </div>
                        </AuthorityCheck>
                        <AuthorityCheck authority={[ADMIN, USER]} permissions={[USER_PERMISSIONS.DASHBOARD_RECENT_ACTIVITY]}>
                            <div className="lg:col-span-2">
                                <RecentActivity />
                            </div>
                        </AuthorityCheck>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <AuthorityCheck authority={[ADMIN, USER]} permissions={[USER_PERMISSIONS.DASHBOARD_LATEST_CANDIDATES]}>
                            <LatestCandidates />
                        </AuthorityCheck>
                        <AuthorityCheck authority={[ADMIN, USER]} permissions={[USER_PERMISSIONS.DASHBOARD_ACTIVE_PACKAGES]}>
                            <ActivePackages />
                        </AuthorityCheck>
                    </div>
                </div>
            </DashboardProvider>
        </div>
    )
}