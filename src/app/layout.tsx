import { auth } from '@/auth'
import AuthProvider from '@/components/auth/AuthProvider'
import ThemeProvider from '@/components/template/Theme/ThemeProvider'
import pageMetaConfig from '@/configs/page-meta.config'
import LocaleProvider from '@/components/template/LocaleProvider'
import NavigationProvider from '@/components/template/Navigation/NavigationProvider'
import { getNavigation } from '@/server/actions/navigation/getNavigation'
import { getTheme } from '@/server/actions/theme'
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
import presetThemeSchemaConfig from '@/configs/preset-theme-schema.config'
import { getLocale, getMessages } from 'next-intl/server'
import type { ReactNode } from 'react'
import type { Direction, LayoutType, Mode, Theme } from '@/@types/theme'
import '@/assets/styles/app.css'

export const metadata = {
    ...pageMetaConfig,
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: ReactNode
}>) {
    const session = await auth()

    const locale = await getLocale()

    const messages = await getMessages()

    const navigationTree = await getNavigation()

    const theme = await getTheme()

    const sessionConfig = session?.config
    const validModes = [MODE_LIGHT, MODE_DARK] as const
    const validDirections = [DIR_LTR, DIR_RTL] as const
    const validLayouts = [
        LAYOUT_COLLAPSIBLE_SIDE,
        LAYOUT_STACKED_SIDE,
        LAYOUT_TOP_BAR_CLASSIC,
        LAYOUT_FRAMELESS_SIDE,
        LAYOUT_CONTENT_OVERLAY,
    ] as const

    const mode =
        sessionConfig && validModes.includes(sessionConfig.mode as Mode)
            ? (sessionConfig.mode as Mode)
            : (theme.mode as Mode)
    const direction =
        sessionConfig && validDirections.includes(sessionConfig.direction as Direction)
            ? (sessionConfig.direction as Direction)
            : (theme.direction as Direction)
    const layoutType =
        sessionConfig &&
        validLayouts.some((layout) => layout === sessionConfig.layout)
            ? (sessionConfig.layout as LayoutType)
            : (theme.layout.type as LayoutType)
    const themeSchema =
        sessionConfig &&
        sessionConfig.theme &&
        sessionConfig.theme in presetThemeSchemaConfig
            ? sessionConfig.theme
            : theme.themeSchema

    const resolvedTheme: Theme = {
        ...theme,
        mode,
        direction,
        themeSchema,
        layout: {
            ...theme.layout,
            type: layoutType,
        },
    }

    return (
        <AuthProvider session={session}>
            <html
                className={resolvedTheme.mode === 'dark' ? 'dark' : 'light'}
                lang={locale}
                dir={resolvedTheme.direction}
                suppressHydrationWarning
            >
                <body suppressHydrationWarning>
                    <LocaleProvider locale={locale} messages={messages}>
                        <ThemeProvider locale={locale} theme={resolvedTheme}>
                            <NavigationProvider navigationTree={navigationTree}>
                                {children}
                            </NavigationProvider>
                        </ThemeProvider>
                    </LocaleProvider>
                </body>
            </html>
        </AuthProvider>
    )
}
