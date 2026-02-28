import { lazy } from 'react'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'

const conceptsRoute: Routes = {
    // Candidates
    '/candidates/list': {
        key: 'concepts.candidates.candidateList',
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        }
    },
    '/candidates/create': {
        key: 'concepts.candidates.candidateCreate',
        authority: [ADMIN, USER],
        meta: {
            header: {
                title: 'Create candidate',
                description: 'Create a new candidate',
                contained: true,
            },
        }
    },
    '/candidates/import': {
        key: 'concepts.candidates.candidateImport',
        authority: [ADMIN, USER],
        meta: {
            header: {
                title: 'Import candidates',
                description: 'Import candidates in bulk using a CSV file',
                contained: true,
            },
        }
    },

    '/candidates/edit/[slug]': {
        key: 'concepts.candidates.candidateEdit',
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        },
        dynamicRoute: true
    },

    '/candidates/details/[slug]': {
        key: 'concepts.candidates.candidateDetails',
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        },
        dynamicRoute: true
    },

    // Invitations
    '/invitations/all': {
        key: 'concepts.invitations.invitationsAll',
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        }
    },

    '/invitations/sent': {
        key: 'concepts.invitations.invitationsSent',
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        }
    },

    '/invitations/viewed': {
        key: 'concepts.invitations.invitationsViewed',
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        }
    },

    '/invitations/expired': {
        key: 'concepts.invitations.invitationsExpired',
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        }
    },

    // Verification Status
    '/verification-status/in-progress': {
        key: 'concepts.verificationStatus.verificationInProgress',
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        }
    },
    '/verification-status/completed': {
        key: 'concepts.verificationStatus.verificationCompleted',
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        }
    },
    '/verification-status/reports': {
        key: 'concepts.verificationStatus.verificationReports',
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        }
    },
    '/verification-status/tracking': {
        key: 'concepts.verificationStatus.verificationTracking',
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        }
    },

    // Packages
    '/packages/list': {
        key: 'concepts.packages.packagesList',
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        }
    },
    '/packages/create': {
        key: 'concepts.packages.packagesList',
        authority: [ADMIN, USER],
        meta: {
            header: {
                title: 'Create package',
                description: 'Create a new package',
                contained: true,
            },
        }
    },
    '/packages/edit/[slug]': {
        key: 'concepts.packages.packagesList',
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        },
        dynamicRoute: true
    },
    '/packages/details/[slug]': {
        key: 'concepts.packages.packagesList',
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        },
        dynamicRoute: true
    },

    // Services
    '/services/list': {
        key: 'concepts.services.serviceList',
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        }
    },
    '/services/create': {
        key: 'concepts.services.serviceList',
        authority: [ADMIN, USER],
        meta: {
            header: {
                title: 'Create service',
                description: 'Create a new service',
                contained: true,
            },
        }
    },
    '/services/edit/[slug]': {
        key: 'concepts.services.serviceList',
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        },
        dynamicRoute: true
    },

    // Orders
    '/orders/list': {
        key: 'concepts.orders.ordersList',
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        }
    },
    '/orders/create': {
        key: 'concepts.orders.ordersList',
        authority: [ADMIN, USER],
        meta: {
            header: {
                title: 'Create order',
                description: 'Create a new order',
                contained: true,
            },
        }
    },
    '/orders/details/[slug]': {
        key: 'concepts.orders.ordersList',
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        },
        dynamicRoute: true
    },

    // Others
    '/concepts/ai/chat': {
        key: 'concepts.ai.chat',
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        },
    },
    '/concepts/ai/image': {
        key: 'concepts.ai.image',
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
            pageBackgroundType: 'plain',
        },
    },
    '/concepts/projects/scrum-board': {
        key: 'concepts.projects.scrumBoard',
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        },
    },
    '/concepts/projects/project-list': {
        key: 'concepts.projects.projectList',
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
            pageBackgroundType: 'plain',
        },
    },
    '/concepts/projects/tasks': {
        key: 'concepts.projects.projectTasks',
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        },
    },
    '/concepts/projects/project-details/[slug]': {
        key: 'concepts.projects.projectDetails',
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
            pageBackgroundType: 'plain',
        },
        dynamicRoute: true,
    },
    '/concepts/projects/tasks/[slug]': {
        key: 'concepts.projects.projectIssue',
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        },
        dynamicRoute: true,
    },
    '/concepts/customers/customer-list': {
        key: 'concepts.customers.customerList',
        authority: [ADMIN, USER],
    },
    '/concepts/customers/customer-edit/[slug]': {
        key: 'concepts.customers.customerEdit',
        authority: [ADMIN, USER],
        meta: {
            header: {
                title: 'Edit customer',
                description:
                    'Manage customer details, purchase history, and preferences.',
                contained: true,
            },
            footer: false,
        },
        dynamicRoute: true,
    },
    '/concepts/customers/customer-create': {
        key: 'concepts.customers.customerCreate',
        authority: [ADMIN, USER],
        meta: {
            header: {
                title: 'Create customer',
                description:
                    'Manage customer details, track purchases, and update preferences easily.',
                contained: true,
            },
            footer: false,
        },
    },
    '/concepts/customers/customer-details/[slug]': {
        key: 'concepts.customers.customerDetails',
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        },
        dynamicRoute: true,
    },
    '/concepts/products/product-list': {
        key: 'concepts.products.productList',
        authority: [ADMIN, USER],
    },
    '/concepts/products/product-edit/[slug]': {
        key: 'concepts.products.productEdit',
        authority: [ADMIN, USER],
        meta: {
            header: {
                title: 'Edit product',
                description:
                    'Quickly manage product details, stock, and availability.',
                contained: true,
            },
            footer: false,
        },
        dynamicRoute: true,
    },
    '/concepts/products/product-create': {
        key: 'concepts.products.productCreate',
        authority: [ADMIN, USER],
        meta: {
            header: {
                title: 'Create product',
                description:
                    'Quickly add products to your inventory. Enter key details, manage stock, and set availability.',
                contained: true,
            },
            footer: false,
        },
    },
    '/concepts/orders/order-list': {
        key: 'concepts.orders.orderList',
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        },
    },
    '/concepts/orders/order-create': {
        key: 'concepts.orders.orderCreate',
        authority: [ADMIN, USER],
        meta: {
            header: {
                title: 'Create order',
                contained: true,
                description:
                    'Create new customer orders quickly and accurately',
            },
            footer: false,
        },
    },
    '/concepts/orders/order-edit/[slug]': {
        key: 'concepts.orders.orderEdit',
        authority: [ADMIN, USER],
        meta: {
            header: {
                title: 'Edit order',
                contained: true,
                description: 'Manage and track orders efficiently',
            },
            footer: false,
        },
        dynamicRoute: true,
    },
    '/concepts/orders/order-details/[slug]': {
        key: 'concepts.orders.orderDetails',
        authority: [ADMIN, USER],
        meta: {
            header: {
                contained: true,
                title: lazy(
                    () =>
                        import(
                            '@/app/(protected-pages)/concepts/orders/order-details/[id]/_components/OrderDetailHeader'
                        ),
                ),
                extraHeader: lazy(
                    () =>
                        import(
                            '@/app/(protected-pages)/concepts/orders/order-details/[id]/_components/OrderDetailHeaderExtra'
                        ),
                ),
            },
            pageContainerType: 'contained',
        },
        dynamicRoute: true,
    },
    '/concepts/account/settings': {
        key: 'concepts.account.settings',
        authority: [ADMIN, USER],
        meta: {
            header: {
                title: 'Settings',
            },
            pageContainerType: 'contained',
        },
    },
    '/concepts/account/activity-log': {
        key: 'concepts.account.activityLog',
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        },
    },
    '/concepts/account/pricing': {
        key: 'concepts.account.pricing',
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        },
    },
    '/concepts/account/roles-permissions': {
        key: 'concepts.account.rolesPermissions',
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
            pageBackgroundType: 'plain',
        },
    },
    '/concepts/help-center/support-hub': {
        key: 'concepts.helpCenter.supportHub',
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'gutterless',
            pageBackgroundType: 'plain',
        },
    },
    '/concepts/help-center/article/[slug]': {
        key: 'concepts.helpCenter.article',
        authority: [ADMIN, USER],
        dynamicRoute: true,
        meta: {
            pageContainerType: 'contained',
            pageBackgroundType: 'plain',
        },
    },
    '/concepts/help-center/edit-article/[slug]': {
        key: 'concepts.helpCenter.editArticle',
        authority: [ADMIN, USER],
        dynamicRoute: true,
        meta: {
            pageBackgroundType: 'plain',
            footer: false,
        },
    },
    '/concepts/help-center/manage-article': {
        key: 'concepts.helpCenter.manageArticle',
        authority: [ADMIN, USER],
        meta: {
            pageBackgroundType: 'plain',
            footer: false,
        },
    },
    '/concepts/file-manager': {
        key: 'concepts.fileManager',
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
            pageBackgroundType: 'plain',
        },
    },
    '/concepts/calendar': {
        key: 'concepts.calendar',
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
            pageBackgroundType: 'plain',
        },
    },
    '/concepts/mail': {
        key: 'concepts.mail',
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        },
    },
    '/concepts/chat': {
        key: 'concepts.chat',
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        },
    },
}

export default conceptsRoute
