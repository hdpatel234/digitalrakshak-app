import { GUIDE_PREFIX_PATH } from '@/constants/route.constant'
import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { NavigationTree } from '@/@types/navigation'

const guideNavigationConfig: NavigationTree[] = [
    {
        key: 'guide',
        path: '',
        title: 'Help & Supports',
        translateKey: 'nav.helpSupports',
        icon: 'guide',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [ADMIN, USER],
        subMenu: [
            {
                key: 'guide.tickets',
                path: `https://support.digitalrakshak.com/`,
                title: 'Help Desk',
                translateKey: 'nav.guide.helpDesk',
                icon: 'mail',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.guide.helpDesk',
                        label: 'Help Desk support',
                    },
                },
                subMenu: [],
            },
        ],
    },
]

export default guideNavigationConfig
