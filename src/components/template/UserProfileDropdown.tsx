'use client'
import { useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import useCurrentSession from '@/utils/hooks/useCurrentSession'
import useTranslation from '@/utils/hooks/useTranslation'
import appConfig from '@/configs/app.config'
import { callInternalLogout } from '@/services/auth/logout'
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

    const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false)
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const onLogoutClick = () => {
        setConfirmLogoutOpen(true)
    }

    const handleConfirmLogout = async () => {
        setIsLoggingOut(true)
        try {
            await callInternalLogout()
            await signOut({ callbackUrl: appConfig.unAuthenticatedEntryPath })
        } catch (error) {
            setIsLoggingOut(false)
        }
    }

    const handleCloseModal = () => {
        if (!isLoggingOut) {
            setConfirmLogoutOpen(false)
        }
    }

    const avatarProps = {
        ...(session?.user?.avatar
            ? { src: session?.user?.avatar }
            : { icon: <PiUserDuotone /> }),
    }

    return (
        <>
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
                    onClick={onLogoutClick}
                >
                    <span className="text-xl">
                        <PiSignOutDuotone />
                    </span>
                    <span>{t('profileDropdown.signOut')}</span>
                </Dropdown.Item>
            </Dropdown>
            <Dialog
                isOpen={confirmLogoutOpen}
                onClose={handleCloseModal}
                onRequestClose={handleCloseModal}
            >
                <div className="flex flex-col h-full justify-between">
                    <h5 className="mb-4">Confirm Logout</h5>
                    <div className="mb-6">
                        {isLoggingOut ? (
                            <div className="flex items-center gap-2">
                                <Spinner />
                                <span>Logging you out...</span>
                            </div>
                        ) : (
                            <p>Are you sure you want to log out?</p>
                        )}
                    </div>
                    <div className="text-right mt-4">
                        <Button
                            className="ltr:mr-2 rtl:ml-2"
                            variant="plain"
                            onClick={handleCloseModal}
                            disabled={isLoggingOut}
                        >
                            Cancel
                        </Button>
                        <Button variant="solid" onClick={handleConfirmLogout} loading={isLoggingOut}>
                            Yes, Logout
                        </Button>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

const UserDropdown = withHeaderItem(_UserDropdown)

export default UserDropdown
