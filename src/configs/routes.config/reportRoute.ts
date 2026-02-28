import type { Routes } from '@/@types/routes'

const reportRoute: Routes = {
    '/report/spending': {
        key: 'report.spending',
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },

    '/report/orders': {
        key: 'report.orders',
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },

    '/report/verification': {
        key: 'report.verification',
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },

    '/report/export': {
        key: 'report.export',
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
}

export default reportRoute
