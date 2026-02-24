import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { NavigationTree } from '@/@types/navigation'
import { GUIDE_PREFIX_PATH } from '@/constants/route.constant'

const guideNavigationConfig: NavigationTree[] = [
    {
        key: 'guide',
        path: '',
        title: 'Help & Supports',
        translateKey: 'nav.helpSupports',
        icon: 'guide',
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
                key: 'guide.tickets',
                path: `https://support.digitalrakshak.com/`,
                title: 'Help Desk',
                translateKey: 'nav.guide.helpDesk',
                icon: 'mail',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                subMenu: [],
            },
            {
                key: 'guide.documentation',
                path: `${GUIDE_PREFIX_PATH}/documentation/introduction`,
                title: 'Documentation',
                translateKey: 'nav.guide.documentation',
                icon: 'documentation',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                subMenu: [],
            },
        ],
    },
]

export default guideNavigationConfig
