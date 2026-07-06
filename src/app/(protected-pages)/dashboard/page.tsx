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
import AuthorityCheck from '@/components/shared/AuthorityCheck'
import { USER_PERMISSIONS } from '@/constants/permissions.constant'
import { ADMIN, USER } from '@/constants/roles.constant'

export default async function Page() {
    const session = await getServerSession()
    const userName = session?.user?.name || 'User'
    const userAuthority = session?.user?.authority || []
    const userPermissions = session?.user?.permissions || []
    
    return (
        <Container>
            <DashboardProvider>
                <div className="flex flex-col gap-4">
                    <DashboardHeader userName={userName} userAuthority={userAuthority} userPermissions={userPermissions} />
                    
                    <AuthorityCheck userAuthority={userAuthority} authority={[ADMIN, USER]} userPermissions={userPermissions} permissions={[USER_PERMISSIONS.DASHBOARD_STATS]}>
                        <DashboardStats />
                    </AuthorityCheck>
                    
                    <AuthorityCheck userAuthority={userAuthority} authority={[ADMIN, USER]} userPermissions={userPermissions} permissions={[USER_PERMISSIONS.DASHBOARD_VERIFICATION_TREND]}>
                        <VerificationTrendChart />
                    </AuthorityCheck>
                    
                    <AuthorityCheck userAuthority={userAuthority} authority={[ADMIN, USER]} userPermissions={userPermissions} permissions={[USER_PERMISSIONS.DASHBOARD_RECENT_ACTIVITY]}>
                        <RecentActivity />
                    </AuthorityCheck>
                    
                    <AuthorityCheck userAuthority={userAuthority} authority={[ADMIN, USER]} userPermissions={userPermissions} permissions={[USER_PERMISSIONS.DASHBOARD_SERVICE_USAGE, USER_PERMISSIONS.REPORT_SPENDING_REPORT]}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <AuthorityCheck userAuthority={userAuthority} authority={[ADMIN, USER]} userPermissions={userPermissions} permissions={[USER_PERMISSIONS.DASHBOARD_SERVICE_USAGE]}>
                                <div className="lg:col-span-2">
                                    <ServiceUsageChart />
                                </div>
                            </AuthorityCheck>
                            <AuthorityCheck userAuthority={userAuthority} authority={[ADMIN, USER]} userPermissions={userPermissions} permissions={[USER_PERMISSIONS.REPORT_SPENDING_REPORT]}>
                                <div>
                                    <MonthSpend />
                                </div>
                            </AuthorityCheck>
                        </div>
                    </AuthorityCheck>
                    
                    <AuthorityCheck userAuthority={userAuthority} authority={[ADMIN, USER]} userPermissions={userPermissions} permissions={[USER_PERMISSIONS.DASHBOARD_ACTIVE_PACKAGES, USER_PERMISSIONS.DASHBOARD_LATEST_CANDIDATES]}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <AuthorityCheck userAuthority={userAuthority} authority={[ADMIN, USER]} userPermissions={userPermissions} permissions={[USER_PERMISSIONS.DASHBOARD_ACTIVE_PACKAGES]}>
                                <ActivePackages />
                            </AuthorityCheck>
                            <AuthorityCheck userAuthority={userAuthority} authority={[ADMIN, USER]} userPermissions={userPermissions} permissions={[USER_PERMISSIONS.DASHBOARD_LATEST_CANDIDATES]}>
                                <LatestCandidates />
                            </AuthorityCheck>
                        </div>
                    </AuthorityCheck>
                </div>
            </DashboardProvider>
        </Container>
    )
}