'use client'
import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import Link from 'next/link'
import signOut from '@/server/actions/auth/handleSignOut'
import useCurrentSession from '@/utils/hooks/useCurrentSession'
import useTranslation from '@/utils/hooks/useTranslation'
import {
    PiUserDuotone,
    PiGearDuotone,
    PiPulseDuotone,
    PiSignOutDuotone,
} from 'react-icons/pi'

import type { JSX } from 'react'

type DropdownList = {
    key: string
    labelKey: string
    path: string
    icon: JSX.Element
}

const dropdownItemList: DropdownList[] = [
    {
        key: 'accountSetting',
        labelKey: 'profileDropdown.accountSetting',
        path: '/account/settings',
        icon: <PiGearDuotone />,
    },
    {
        key: 'activityLog',
        labelKey: 'profileDropdown.activityLog',
        path: '/account/activity-log',
        icon: <PiPulseDuotone />,
    },
]

const _UserDropdown = () => {
    const { session } = useCurrentSession()
    const t = useTranslation('header')

    const handleSignOut = async () => {
        await signOut()
    }

    const avatarProps = {
        ...(session?.user?.avatar
            ? { src: session?.user?.avatar }
            : { icon: <PiUserDuotone /> }),
    }

    return (
        <Dropdown
            className="flex"
            toggleClassName="flex items-center"
            renderTitle={
                <div className="cursor-pointer flex items-center">
                    <Avatar size={32} {...avatarProps} />
                </div>
            }
            placement="bottom-end"
        >
            <Dropdown.Item variant="header">
                <div className="py-2 px-3 flex items-center gap-3">
                    <Avatar {...avatarProps} />
                    <div>
                        <div className="font-bold text-gray-900 dark:text-gray-100">
                            {session?.user?.name || t('profileDropdown.anonymous')}
                        </div>
                        <div className="text-xs">
                            {session?.user?.email ||
                                t('profileDropdown.noEmailAvailable')}
                        </div>
                    </div>
                </div>
            </Dropdown.Item>
            <Dropdown.Item variant="divider" />
            {dropdownItemList.map((item) => (
                <Dropdown.Item
                    key={item.key}
                    eventKey={item.key}
                    className="px-0"
                >
                    <Link className="flex h-full w-full px-2" href={item.path}>
                        <span className="flex gap-2 items-center w-full">
                            <span className="text-xl">{item.icon}</span>
                            <span>{t(item.labelKey)}</span>
                        </span>
                    </Link>
                </Dropdown.Item>
            ))}
            <Dropdown.Item variant="divider" />
            <Dropdown.Item
                eventKey="signOut"
                className="gap-2"
                onClick={handleSignOut}
            >
                <span className="text-xl">
                    <PiSignOutDuotone />
                </span>
                <span>{t('profileDropdown.signOut')}</span>
            </Dropdown.Item>
        </Dropdown>
    )
}

const UserDropdown = withHeaderItem(_UserDropdown)

export default UserDropdown
