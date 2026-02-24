import { DASHBOARDS_PREFIX_PATH, UI_COMPONENTS_PREFIX_PATH } from '@/constants/route.constant'
import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { NavigationTree } from '@/@types/navigation'

const uiComponentNavigationConfig: NavigationTree[] = [
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
                layout: 'tabs',
                columns: 2,
            },
        },
        subMenu: [
            {
                key: 'billing.index',
                path: `/invoices`,
                title: 'Invoices',
                translateKey: 'nav.billing.invoices',
                icon: 'invoice',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                subMenu: [],
            },
            {
                key: 'billing.subscriptions',
                path: `/subscriptions`,
                title: 'Subscriptions', // TODO: translate
                translateKey: 'nav.billing.subscriptions',
                icon: 'subscription',   // TODO: add icon
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                subMenu: [],
            },
            {
                key: 'billing.paymentMethods',
                path: `/payment-methods`,
                title: 'Payment Methods',
                translateKey: 'nav.billing.paymentMethods',
                icon: 'paymentMethods',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                subMenu: [],
            },
            {
                key: 'billing.billingHistory',
                path: `/billing-history`,
                title: 'Billing History',
                translateKey: 'nav.billing.billingHistory',
                icon: 'billingHistory', // TODO: add icon
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                subMenu: [],
            },
        ],
    },
]

export default uiComponentNavigationConfig
