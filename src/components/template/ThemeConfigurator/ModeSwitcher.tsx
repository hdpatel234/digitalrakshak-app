'use client'

import useTheme from '@/utils/hooks/useTheme'
import Switcher from '@/components/ui/Switcher'
import { MODE_DARK, MODE_LIGHT } from '@/constants/theme.constant'

const ModeSwitcher = () => {
    const mode = useTheme((state) => state.mode)
    const setMode = useTheme((state) => state.setMode)

    const onSwitchChange = (checked: boolean) => {
        setMode(checked ? MODE_DARK : MODE_LIGHT)
    }

    return (
        <div>
            <Switcher checked={mode === MODE_DARK} onChange={onSwitchChange} />
        </div>
    )
}

export default ModeSwitcher
