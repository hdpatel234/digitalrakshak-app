import { ADMIN, USER } from '@/constants/roles.constant'
import { USER_PERMISSIONS } from '@/constants/permissions.constant'
import type { Routes } from '@/@types/routes'

const dashboardsRoute: Routes = {
    '/dashboard': {
        key: 'dashboard.index',
        authority: [ADMIN, USER],
        permissions: [USER_PERMISSIONS.DASHBOARD_STATS],
        meta: {
            pageContainerType: 'contained',
        },
    },
    '/dashboards/ecommerce': {
        key: 'dashboard.ecommerce',
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        },
    },
    '/dashboards/project': {
        key: 'dashboard.project',
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        },
    },
    '/dashboards/marketing': {
        key: 'dashboard.marketing',
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        },
    },
    '/dashboards/analytic': {
        key: 'dashboard.analytic',
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
            pageBackgroundType: 'plain',
        },
    },
}

export default dashboardsRoute
