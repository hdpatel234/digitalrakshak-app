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
            // Candidates
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
                        icon: 'customerList',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        subMenu: [],
                    },
                    {
                        key: 'concepts.candidates.candidateCreate',
                        path: `/candidates/create`,
                        title: 'Create',
                        translateKey: 'nav.conceptsCandidates.candidateCreate',
                        icon: 'customerCreate',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        subMenu: [],
                    },
                    {
                        key: 'concepts.candidates.candidateImport',
                        path: `/candidates/import`,
                        title: 'Import',
                        translateKey: 'nav.conceptsCandidates.candidateImport',
                        icon: 'customerImport',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        subMenu: [],
                    },
                ],
            },

            // Invitations
            {
                key: 'concepts.invitations',
                path: '',
                title: 'Invitations',
                translateKey: 'nav.conceptsInvitations.invitations',
                icon: 'invitations',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN, USER],
                subMenu: [
                    {
                        key: 'concepts.invitations.invitationsAll',
                        path: `/invitations/all`,
                        title: 'All Invitations',
                        translateKey: 'nav.conceptsInvitations.invitationAll',
                        icon: 'customerList',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        subMenu: [],
                    },
                    {
                        key: 'concepts.invitations.invitationsSent',
                        path: `/invitations/sent`,
                        title: 'Sent Invitations',
                        translateKey: 'nav.conceptsInvitations.invitationSent',
                        icon: 'customerCreate',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        subMenu: [],
                    },
                    {
                        key: 'concepts.invitations.invitationsViewed',
                        path: `/invitations/viewed`,
                        title: 'Viewed Invitations',
                        translateKey: 'nav.conceptsInvitations.invitationViewed',
                        icon: 'customerImport',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        subMenu: [],
                    },
                    {
                        key: 'concepts.invitations.invitationsExpired',
                        path: `/invitations/expired`,
                        title: 'Expired Invitations',
                        translateKey: 'nav.conceptsInvitations.invitationExpired',
                        icon: 'customerImport',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        subMenu: [],
                    }
                ],
            },

            // Orders
            {
                key: 'concepts.orders.ordersList',
                path: '/orders/list',
                title: 'Orders',
                translateKey: 'nav.conceptsOrders.orders',
                icon: 'orders',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN, USER],
                subMenu: [
                    {
                        key: 'concepts.orders.orderList',
                        path: '/orders/list',
                        title: 'Simple',
                        translateKey: 'nav.conceptsOrders.orderList',
                        icon: 'orderList',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        subMenu: [],
                    },
                ],
            },

            // Packages
            {
                key: 'concepts.packages',
                path: `/packages/list`,
                title: 'Packages',
                translateKey: 'nav.conceptsProducts.products',
                icon: 'products',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN, USER],
                subMenu: [
                    {
                        key: 'concepts.packages.packageList',
                        path: `/packages/list`,
                        title: 'Simple',
                        translateKey: 'nav.conceptsProducts.productList',
                        icon: 'productList',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        subMenu: [],
                    },
                    {
                        key: 'concepts.packages.packageCreate',
                        path: `/packages/create`,
                        title: 'Create',
                        translateKey: 'nav.conceptsProducts.productCreate',
                        icon: 'productCreate',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        subMenu: [],
                    },
                ],
            },

            // Verification Status
            {
                key: 'concepts.verificationStatus',
                path: `/verification-status/list`,
                title: 'Verification Status',
                translateKey: 'nav.conceptsVerificationStatus.verificationStatus',
                icon: 'verificationStatus',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN, USER],
                subMenu: [
                    {
                        key: 'concepts.verificationStatus.verificationInProgress',
                        path: `/verification-status/in-progress`,
                        title: 'In Progress',
                        translateKey: 'nav.conceptsVerificationStatus.verificationInProgress',
                        icon: 'verificationInProgress',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        subMenu: [],
                    },
                    {
                        key: 'concepts.verificationStatus.verificationCompleted',
                        path: `/verification-status/completed`,
                        title: 'Completed',
                        translateKey: 'nav.conceptsVerificationStatus.verificationCompleted',
                        icon: 'verificationCompleted',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        subMenu: [],
                    },
                    {
                        key: 'concepts.verificationStatus.verificationReports',
                        path: `/verification-status/reports`,
                        title: 'Reports',
                        translateKey: 'nav.conceptsVerificationStatus.verificationReports',
                        icon: 'verificationReports',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        subMenu: [],
                    },
                    {
                        key: 'concepts.verificationStatus.verificationTracking',
                        path: `/verification-status/tracking`,
                        title: 'Tracking',
                        translateKey: 'nav.conceptsVerificationStatus.verificationTracking',
                        icon: 'verificationTracking',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        subMenu: [],
                    },
                ],
            },

            // Services
            {
                key: 'concepts.services',
                path: `/services/list`,
                title: 'Services',
                translateKey: 'nav.conceptsServices.services',
                icon: 'services',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN, USER],
                subMenu: [
                    {
                        key: 'concepts.services.serviceList',
                        path: `/services/list`,
                        title: 'Simple',
                        translateKey: 'nav.conceptsServices.serviceList',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        subMenu: [],
                    },
                ],
            },
        ],
    },
]

export default conceptsNavigationConfig
