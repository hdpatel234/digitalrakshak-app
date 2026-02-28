'use client'

import Button from '@/components/ui/Button'
import InputGroup from '@/components/ui/InputGroup'
import useTheme from '@/utils/hooks/useTheme'
import { THEME_ENUM } from '@/constants/theme.constant'
import type { Direction } from '@/@types/theme'
import useTranslation from '@/utils/hooks/useTranslation'

const dirList = [
    { value: THEME_ENUM.DIR_LTR, label: 'displaySettings.ltr' },
    { value: THEME_ENUM.DIR_RTL, label: 'displaySettings.rtl' },
]

const DirectionSwitcher = ({
    callBackClose,
}: {
    callBackClose?: () => void
}) => {
    const t = useTranslation('header')
    const setDirection = useTheme((state) => state.setDirection)
    const direction = useTheme((state) => state.direction)

    const onDirChange = (val: Direction) => {
        setDirection(val)
        callBackClose?.()
    }

    return (
        <InputGroup size="sm">
            {dirList.map((dir) => (
                <Button
                    key={dir.value}
                    active={direction === dir.value}
                    onClick={() => onDirChange(dir.value)}
                >
                    {t(dir.label)}
                </Button>
            ))}
        </InputGroup>
    )
}

export default DirectionSwitcher
