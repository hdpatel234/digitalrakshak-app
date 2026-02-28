import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { NavigationTree } from '@/@types/navigation'

const settingComponentNavigationConfig: NavigationTree[] = [
    {
        key: 'settings',
        path: '',
        title: 'Settings',
        translateKey: 'nav.settings.settings',
        icon: 'settings',
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
                key: 'settings.companyProfile',
                path: `/settings/company-profile`,
                title: 'Company Profile',
                translateKey: 'nav.settings.companyProfile',
                icon: 'companyProfile',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                meta: {},
                subMenu: [],
            },
            {
                key: 'settings.teamMembers',
                path: `/settings/team-members`,
                title: 'Team Members',
                translateKey: 'nav.settings.teamMembers',
                icon: 'teamMembers',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                meta: {},
                subMenu: [],
            },
            {
                key: 'settings.apiKeys',
                path: `/settings/api-keys`,
                title: 'API Keys',
                translateKey: 'nav.settings.apiKeys',
                icon: 'apiKeys',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                meta: {},
                subMenu: [],
            },
            {
                key: 'settings.webhooks',
                path: `/settings/webhooks`,
                title: 'Webhooks',
                translateKey: 'nav.settings.webhooks',
                icon: 'webhooks',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                meta: {},
                subMenu: [],
            }
        ],
    },
]

export default settingComponentNavigationConfig
