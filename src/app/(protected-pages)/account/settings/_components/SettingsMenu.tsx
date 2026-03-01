'use client'

import Menu from '@/components/ui/Menu'
import ScrollBar from '@/components/ui/ScrollBar'
import { useSettingsStore } from '../_store/settingsStore'
import { TbUserSquare, TbLock, TbBell, TbFileDollar, TbRefreshDot } from 'react-icons/tb'
import { useSearchParams } from 'next/navigation'
import type { View } from '../types'
import type { ReactNode } from 'react'
import useTranslation from '@/utils/hooks/useTranslation'

const { MenuItem } = Menu

const menuList: { label: string; value: View; icon: ReactNode }[] = [
    { label: 'settingsMenu.profile', value: 'profile', icon: <TbUserSquare /> },
    { label: 'settingsMenu.security', value: 'security', icon: <TbLock /> },
    // { label: 'Notification', value: 'notification', icon: <TbBell /> },
    // { label: 'Billing', value: 'billing', icon: <TbFileDollar /> },
    // { label: 'Integration', value: 'integration', icon: <TbRefreshDot /> },
]

export const SettingsMenu = ({ onChange }: { onChange?: () => void }) => {
    const searchParams = useSearchParams()

    const t = useTranslation('header')

    const { currentView, setCurrentView } = useSettingsStore()

    const currentPath =
        searchParams.get('category') || searchParams.get('label') || 'inbox'

    const handleSelect = (value: View) => {
        setCurrentView(value)
        onChange?.()
    }

    return (
        <div className="flex flex-col justify-between h-full">
            <ScrollBar className="h-full overflow-y-auto">
                <Menu className="mx-2 mb-10">
                    {menuList.map((menu) => (
                        <MenuItem
                            key={menu.value}
                            eventKey={menu.value}
                            className={`mb-2 ${
                                currentView === menu.value
                                    ? 'bg-gray-100 dark:bg-gray-700'
                                    : ''
                            }`}
                            isActive={currentPath === menu.value}
                            onSelect={() => handleSelect(menu.value)}
                        >
                            <span className="text-2xl ltr:mr-2 rtl:ml-2">
                                {menu.icon}
                            </span>
                            <span>{t(menu.label)}</span>
                        </MenuItem>
                    ))}
                </Menu>
            </ScrollBar>
        </div>
    )
}

export default SettingsMenu
