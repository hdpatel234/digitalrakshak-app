import { USER_PERMISSIONS } from '@/constants/permissions.constant'
import type { Routes } from '@/@types/routes'

const billingRoute: Routes = {
    '/billing/invoices': {
        key: 'billing.index',
        authority: [],
        permissions: [USER_PERMISSIONS.BILLING_INVOICES],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },

    '/billing/payment-history': {
        key: 'billing.paymentHistory',
        authority: [],
        permissions: [USER_PERMISSIONS.BILLING_PAYMENT_HISTORY],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },

    '/billing/manage-credits': {
        key: 'billing.manageCredits',
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },

    '/billing/payment-methods': {
        key: 'billing.paymentMethods',
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
}

export default billingRoute
