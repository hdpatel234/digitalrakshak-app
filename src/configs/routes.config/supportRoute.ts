import type { Routes } from '@/@types/routes'

const supportRoute: Routes = {
    '/support/my-tickets': {
        key: 'support.myTickets',
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },

    '/support/open-ticket': {
        key: 'support.openTicket',
        authority: [],
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
