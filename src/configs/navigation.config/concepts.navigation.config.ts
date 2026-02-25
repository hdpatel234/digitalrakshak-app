import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE,
} from '@/constants/navigation.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { NavigationTree } from '@/@types/navigation'

const conceptsNavigationConfig: NavigationTree[] = [
    {
        key: 'concepts',
        path: '',
        title: 'Operations',
        translateKey: 'nav.operations',
        icon: 'operations',
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
                key: 'concepts.candidates',
                path: `/candidates/list`,
                title: 'Candidates',
                translateKey: 'nav.conceptsCandidates.candidates',
                icon: 'customers',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN, USER],
                subMenu: [
                    {
                        key: 'concepts.candidates.candidateList',
                        path: `/candidates/list`,
                        title: 'Simple',
                        translateKey: 'nav.conceptsCandidates.candidateList',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        subMenu: [],
                    },
                    {
                        key: 'concepts.candidates.candidateCreate',
                        path: `/candidates/create`,
                        title: 'Create',
                        translateKey: 'nav.conceptsCandidates.candidateCreate',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        subMenu: [],
                    },
                                        {
                        key: 'concepts.candidates.candidateImport',
                        path: `/candidates/import`,
                        title: 'Import',
                        translateKey: 'nav.conceptsCandidates.candidateImport',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        subMenu: [],
                    },
                ],
            },
            {
                key: 'concepts.services.serviceList',
                path: `/services/list`,
                title: 'Services',
                translateKey: 'nav.conceptsServices.services',
                icon: 'services',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                subMenu: [],
            },
            {
                key: 'concepts.packages.packagesList',
                path: `/packages/list`,
                title: 'Packages',
                translateKey: 'nav.conceptsProducts.products',
                icon: 'products',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                subMenu: [],
            },
            {
                key: 'concepts.orders.ordersList',
                path: '/orders/list',
                title: 'Orders',
                translateKey: 'nav.conceptsOrders.orders',
                icon: 'orders',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                subMenu: [],
            },
        ],
    },
]

export default conceptsNavigationConfig
