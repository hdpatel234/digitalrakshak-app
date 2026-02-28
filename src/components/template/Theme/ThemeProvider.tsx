'use client'
import { useEffect, useMemo, useState } from 'react'
import ThemeContext from './ThemeContext'
import ConfigProvider from '@/components/ui/ConfigProvider'
import appConfig from '@/configs/app.config'
import applyTheme from '@/utils/applyThemeSchema'
import presetThemeSchemaConfig from '@/configs/preset-theme-schema.config'
import {
    DIR_LTR,
    DIR_RTL,
    LAYOUT_COLLAPSIBLE_SIDE,
    LAYOUT_CONTENT_OVERLAY,
    LAYOUT_FRAMELESS_SIDE,
    LAYOUT_STACKED_SIDE,
    LAYOUT_TOP_BAR_CLASSIC,
    MODE_DARK,
    MODE_LIGHT,
} from '@/constants/theme.constant'
import useCurrentSession from '@/utils/hooks/useCurrentSession'
import type { Theme } from '@/@types/theme'
import type { CommonProps } from '@/@types/common'
import type { ControlSize, Direction, LayoutType, Mode } from '@/@types/theme'

interface ThemeProviderProps extends CommonProps {
    theme: Theme
    locale?: string
}

const ThemeProvider = ({ children, theme, locale }: ThemeProviderProps) => {
    const [themeState, setThemeState] = useState<Theme>(theme)
    const { session } = useCurrentSession()

    const handleSetTheme = (payload: (param: Theme) => Theme | Theme) => {
        setThemeState((prevTheme) => {
            const nextTheme =
                typeof payload === 'function' ? payload(prevTheme) : payload
            return nextTheme
        })
    }

    const sessionConfig = session?.config
    const sessionMode = sessionConfig?.mode
    const sessionDirection = sessionConfig?.direction
    const sessionLayout = sessionConfig?.layout
    const sessionTheme = sessionConfig?.theme
    const sessionPanelExpand = sessionConfig?.panelExpand
    const sessionSideNavCollapse = sessionConfig?.sideNavCollapse
    const sessionControlSize = sessionConfig?.controlSize

    const validModes = useMemo<Mode[]>(() => [MODE_LIGHT, MODE_DARK], [])
    const validDirections = useMemo<Direction[]>(() => [DIR_LTR, DIR_RTL], [])
    const validLayouts = useMemo<LayoutType[]>(
        () => [
            LAYOUT_COLLAPSIBLE_SIDE,
            LAYOUT_STACKED_SIDE,
            LAYOUT_TOP_BAR_CLASSIC,
            LAYOUT_FRAMELESS_SIDE,
            LAYOUT_CONTENT_OVERLAY,
        ],
        [],
    )
    const validControlSizes = useMemo<ControlSize[]>(
        () => ['sm', 'md', 'lg'],
        [],
    )

    useEffect(() => {
        const nextMode = validModes.includes(sessionMode as Mode)
            ? (sessionMode as Mode)
            : undefined
        const nextDirection = validDirections.includes(
            sessionDirection as Direction,
        )
            ? (sessionDirection as Direction)
            : undefined
        const nextLayout = validLayouts.includes(sessionLayout as LayoutType)
            ? (sessionLayout as LayoutType)
            : undefined
        const nextTheme =
            sessionTheme && sessionTheme in presetThemeSchemaConfig
                ? sessionTheme
                : undefined
        const nextControlSize = validControlSizes.includes(
            sessionControlSize as ControlSize,
        )
            ? (sessionControlSize as ControlSize)
            : undefined
        const nextPanelExpand =
            sessionPanelExpand === 'true'
                ? true
                : sessionPanelExpand === 'false'
                  ? false
                  : undefined
        const nextSideNavCollapse =
            sessionSideNavCollapse === 'true'
                ? true
                : sessionSideNavCollapse === 'false'
                  ? false
                  : undefined

        handleSetTheme((prevTheme) => {
            const hasChanges =
                (nextMode && prevTheme.mode !== nextMode) ||
                (nextDirection && prevTheme.direction !== nextDirection) ||
                (nextLayout && prevTheme.layout.type !== nextLayout) ||
                (nextTheme && prevTheme.themeSchema !== nextTheme) ||
                (nextControlSize && prevTheme.controlSize !== nextControlSize) ||
                (typeof nextPanelExpand === 'boolean' &&
                    prevTheme.panelExpand !== nextPanelExpand) ||
                (typeof nextSideNavCollapse === 'boolean' &&
                    prevTheme.layout.sideNavCollapse !== nextSideNavCollapse)

            if (!hasChanges) {
                return prevTheme
            }

            return {
                ...prevTheme,
                mode: nextMode || prevTheme.mode,
                direction: nextDirection || prevTheme.direction,
                themeSchema: nextTheme || prevTheme.themeSchema,
                controlSize: nextControlSize || prevTheme.controlSize,
                panelExpand:
                    typeof nextPanelExpand === 'boolean'
                        ? nextPanelExpand
                        : prevTheme.panelExpand,
                layout: {
                    ...prevTheme.layout,
                    type: nextLayout || prevTheme.layout.type,
                    sideNavCollapse:
                        typeof nextSideNavCollapse === 'boolean'
                            ? nextSideNavCollapse
                            : prevTheme.layout.sideNavCollapse,
                },
            }
        })
    }, [
        sessionMode,
        sessionDirection,
        sessionLayout,
        sessionTheme,
        sessionPanelExpand,
        sessionSideNavCollapse,
        sessionControlSize,
        validModes,
        validDirections,
        validLayouts,
        validControlSizes,
    ])

    return (
        <ThemeContext.Provider
            value={{
                theme: themeState,
                setTheme: handleSetTheme,
            }}
        >
            <ConfigProvider
                value={{
                    ...themeState,
                    locale: locale || appConfig.locale,
                }}
            >
                {children}
            </ConfigProvider>
            <script
                suppressHydrationWarning
                dangerouslySetInnerHTML={{
                    __html: `(${applyTheme.toString()})(${JSON.stringify([
                        theme.themeSchema || 'default',
                        theme.mode,
                        presetThemeSchemaConfig,
                    ]).slice(1, -1)})`,
                }}
            />
        </ThemeContext.Provider>
    )
}

export default ThemeProvider
