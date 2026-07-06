import { USER_PERMISSIONS } from '@/constants/permissions.constant'
import type { Routes } from '@/@types/routes'

const supportRoute: Routes = {
    '/support/my-tickets': {
        key: 'support.myTickets',
        authority: [],
        permissions: [USER_PERMISSIONS.SUPPORT_MY_TICKETS],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },

    '/support/open-ticket': {
        key: 'support.openTicket',
        authority: [],
        permissions: [USER_PERMISSIONS.SUPPORT_OPEN_TICKET],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },

    '/support/knowledge-base': {
        key: 'support.knowledgeBase',
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
}

export default supportRoute
