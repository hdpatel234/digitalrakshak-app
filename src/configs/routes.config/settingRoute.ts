import { USER_PERMISSIONS } from '@/constants/permissions.constant'
import type { Routes } from '@/@types/routes'

const settingRoute: Routes = {
    '/settings/company-profile': {
        key: 'settings.companyProfile',
        authority: [],
        permissions: [USER_PERMISSIONS.SETTINGS_COMPANY_PROFILE],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },

    '/settings/team-members': {
        key: 'settings.teamMembersList',
        authority: [],
        permissions: [USER_PERMISSIONS.SETTINGS_TEAM_MEMBERS_LIST],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },

    '/settings/team-members/add': {
        key: 'settings.teamMembersAdd',
        authority: [],
        permissions: [USER_PERMISSIONS.SETTINGS_TEAM_MEMBERS_ADD],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },

    '/settings/api-keys': {
        key: 'settings.apiKeys',
        authority: [],
        permissions: [USER_PERMISSIONS.SETTINGS_API_KEYS],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },

    '/settings/webhooks': {
        key: 'settings.webhooks',
        authority: [],
        permissions: [USER_PERMISSIONS.SETTINGS_WEBHOOKS],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
}

export default settingRoute
