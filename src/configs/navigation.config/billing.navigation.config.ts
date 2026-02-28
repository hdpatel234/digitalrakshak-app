import { DASHBOARDS_PREFIX_PATH, UI_COMPONENTS_PREFIX_PATH } from '@/constants/route.constant'
import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { NavigationTree } from '@/@types/navigation'

const billingNavigationConfig: NavigationTree[] = [
    {
        key: 'billing',
        path: '',
        title: 'Billing',
        translateKey: 'nav.billing.billing',
        icon: 'billing',
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
                key: 'billing.index',
                path: `/billing/invoices`,
                title: 'Invoices',
                translateKey: 'nav.billing.invoices',
                icon: 'invoice',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                subMenu: [],
            },
            {
                key: 'billing.paymentHistory',
                path: `/billing/payment-history`,
                title: 'Payment History',
                translateKey: 'nav.billing.paymentHistory',
                icon: 'billingHistory',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                subMenu: [],
            },
            {
                key: 'billing.manageCredits',
                path: `/billing/manage-credits`,
                title: 'Manage Credits',
                translateKey: 'nav.billing.manageCredits',
                icon: 'manageCredits',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                subMenu: [],
            },
            {
                key: 'billing.paymentMethods',
                path: `/billing/payment-methods`,
                title: 'Payment Methods',
                translateKey: 'nav.billing.paymentMethods',
                icon: 'paymentMethods',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                subMenu: [],
            },
        ],
    },
]

export default billingNavigationConfig
