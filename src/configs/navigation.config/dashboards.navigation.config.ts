import { DASHBOARDS_PREFIX_PATH } from '@/constants/route.constant'
import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { NavigationTree } from '@/@types/navigation'

const dashboardsNavigationConfig: NavigationTree[] = [
    {
        key: 'dashboard',
        path: '',
        title: 'Dashboard',
        translateKey: 'nav.dashboard.dashboard',
        icon: 'dashboard',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [ADMIN, USER],
        meta: {
            horizontalMenu: {
                layout: 'default',
            },
        },
        subMenu: [
            {
                key: 'dashboard.index',
                path: `${DASHBOARDS_PREFIX_PATH}`,
                title: 'Dashboard',
                translateKey: 'nav.dashboard.dashboard',
                icon: 'landing',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                subMenu: [],
            },
        ],
    },
]

export default dashboardsNavigationConfig
