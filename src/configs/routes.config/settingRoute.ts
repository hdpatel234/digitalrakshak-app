import type { Routes } from '@/@types/routes'

const settingRoute: Routes = {
    '/settings/company-profile': {
        key: 'settings.companyProfile',
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },

    '/settings/team-members': {
        key: 'settings.teamMembers',
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },

    '/settings/api-keys': {
        key: 'settings.apiKeys',
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },

    '/settings/webhooks': {
        key: 'settings.webhooks',
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
}

export default settingRoute
