import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { NavigationTree } from '@/@types/navigation'

const supportComponentNavigationConfig: NavigationTree[] = [
    {
        key: 'support',
        path: '',
        title: 'Support',
        translateKey: 'nav.support.support',
        icon: 'support',
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
                key: 'support.myTickets',
                path: `/support/my-tickets`,
                title: 'My Tickets',
                translateKey: 'nav.support.myTickets',
                icon: 'myTickets',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                meta: {},
                subMenu: [],
            },
            {
                key: 'support.openTicket',
                path: `/support/open-ticket`,
                title: 'Open Ticket',
                translateKey: 'nav.support.openTicket',
                icon: 'openTicket',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                meta: {},
                subMenu: [],
            },
            {
                key: 'support.knowledgeBase',
                path: `/support/knowledge-base`,
                title: 'Knowledge Base',
                translateKey: 'nav.support.knowledgeBase',
                icon: 'knowledgeBase',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                meta: {},
                subMenu: [],
            }
        ],
    },
]

export default supportComponentNavigationConfig
