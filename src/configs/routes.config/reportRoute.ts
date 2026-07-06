import { USER_PERMISSIONS } from '@/constants/permissions.constant'
import type { Routes } from '@/@types/routes'

const reportRoute: Routes = {
    '/report/spending': {
        key: 'report.spending',
        authority: [],
        permissions: [USER_PERMISSIONS.REPORT_SPENDING_REPORT],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },

    '/report/orders': {
        key: 'report.orders',
        authority: [],
        permissions: [USER_PERMISSIONS.REPORT_ORDER_REPORT],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },

    '/report/verification': {
        key: 'report.verification',
        authority: [],
        permissions: [USER_PERMISSIONS.REPORT_VERIFICATION_REPORT],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },

    '/report/export': {
        key: 'report.export',
        authority: [],
        permissions: [USER_PERMISSIONS.REPORT_EXPORT_DATA],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
}

export default reportRoute
