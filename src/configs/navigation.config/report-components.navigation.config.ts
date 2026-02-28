import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { NavigationTree } from '@/@types/navigation'

const reportComponentNavigationConfig: NavigationTree[] = [
    {
        key: 'reports',
        path: '',
        title: 'Reports',
        translateKey: 'nav.reports.reports',
        icon: 'reports',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [ADMIN, USER],
        meta: {
            horizontalMenu: {
                layout: 'columns',
                columns: 4,
            },
        },
        subMenu: [
            {
                key: 'report.spending',
                path: `/report/spending`,
                title: 'Spending Report',
                translateKey: 'nav.reports.spendingReport',
                icon: 'spendingReport',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                meta: {},
                subMenu: [],
            },
            {
                key: 'report.orders',
                path: `/report/orders`,
                title: 'Orders Report',
                translateKey: 'nav.reports.ordersReport',
                icon: 'ordersReport',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                meta: {},
                subMenu: [],
            },
            {
                key: 'report.verification',
                path: `/report/verification`,
                title: 'Verification Report',
                translateKey: 'nav.reports.verificationReport',
                icon: 'verificationReport',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                meta: {},
                subMenu: [],
            },
            {
                key: 'report.export',
                path: `/report/export`,
                title: 'Export Data',
                translateKey: 'nav.reports.exportData',
                icon: 'exportData',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                meta: {},
                subMenu: [],
            }
        ],
    },
]

export default reportComponentNavigationConfig
