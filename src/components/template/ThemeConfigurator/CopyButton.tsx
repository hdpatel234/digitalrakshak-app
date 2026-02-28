import { useState } from 'react'
import Notification from '@/components/ui/Notification'
import Button from '@/components/ui/Button'
import toast from '@/components/ui/toast'
import useTheme from '@/utils/hooks/useTheme'
import useTranslation from '@/utils/hooks/useTranslation'
import useCurrentSession from '@/utils/hooks/useCurrentSession'
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
import type { Direction, LayoutType, Mode } from '@/@types/theme'

type ConfigItem = {
    key?: string
    value?: string
    user_value?: string
    default_value?: string
}

type UpdateConfigResponse = {
    status?: boolean
    success?: boolean
    message?: string
    data?: {
        configs?: ConfigItem[]
    }
}

const CopyButton = ({
    callBackClose,
}: {
    callBackClose?: () => void
}) => {
    const mode = useTheme((state) => state.mode)
    const direction = useTheme((state) => state.direction)
    const layoutType = useTheme((state) => state.layout.type)
    const sideNavCollapse = useTheme((state) => state.layout.sideNavCollapse)
    const themeSchema = useTheme((state) => state.themeSchema)
    const panelExpand = useTheme((state) => state.panelExpand)
    const controlSize = useTheme((state) => state.controlSize)
    const setMode = useTheme((state) => state.setMode)
    const setDirection = useTheme((state) => state.setDirection)
    const setLayout = useTheme((state) => state.setLayout)
    const setSchema = useTheme((state) => state.setSchema)
    const setSideNavCollapse = useTheme((state) => state.setSideNavCollapse)
    const setPanelExpand = useTheme((state) => state.setPanelExpand)
    const { setSession } = useCurrentSession()
    const t = useTranslation('header')
    const [isSaving, setIsSaving] = useState(false)

    const showNotification = (
        type: 'success' | 'danger',
        title: string,
        message: string,
    ) => {
        toast.push(
            <Notification title={title} type={type}>
                {message}
            </Notification>,
            {
                placement: 'top-center',
            },
        )
    }

    const handleCopy = async () => {
        if (isSaving) {
            return
        }

        const payload: Record<string, string> = {
            mode,
            direction,
            layout: layoutType,
            theme: themeSchema || 'default',
            panelExpand: String(panelExpand),
            sideNavCollapse: String(sideNavCollapse),
            controlSize,
        }

        try {
            setIsSaving(true)

            const response = await fetch('/api/user/config', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })

            const responsePayload =
                ((await response.json().catch(() => ({}))) as UpdateConfigResponse) ||
                {}

            const isSuccess =
                response.ok &&
                (responsePayload.status === true ||
                    responsePayload.success === true)

            if (!isSuccess) {
                showNotification(
                    'danger',
                    t('displaySettings.saveTitle'),
                    responsePayload.message ||
                        'Failed to save display settings. Please try again.',
                )
                return
            }

            const configFromApi =
                responsePayload.data?.configs?.reduce<Record<string, string>>(
                    (acc, item) => {
                        if (!item.key) {
                            return acc
                        }
                        acc[item.key] = String(
                            item.user_value ?? item.value ?? item.default_value ?? '',
                        )
                        return acc
                    },
                    {},
                ) || payload

            const validModes: Mode[] = [MODE_LIGHT, MODE_DARK]
            const validDirections: Direction[] = [DIR_LTR, DIR_RTL]
            const validLayouts: LayoutType[] = [
                LAYOUT_COLLAPSIBLE_SIDE,
                LAYOUT_STACKED_SIDE,
                LAYOUT_TOP_BAR_CLASSIC,
                LAYOUT_FRAMELESS_SIDE,
                LAYOUT_CONTENT_OVERLAY,
            ]

            const mode = configFromApi.mode as Mode
            const direction = configFromApi.direction as Direction
            const layout = configFromApi.layout as LayoutType
            const themeSchema = configFromApi.theme

            if (validModes.includes(mode)) {
                setMode(mode)
            }

            if (validDirections.includes(direction)) {
                setDirection(direction)
            }

            if (validLayouts.includes(layout)) {
                setLayout(layout)
            }

            if (themeSchema && themeSchema in presetThemeSchemaConfig) {
                setSchema(themeSchema)
            }

            if (configFromApi.sideNavCollapse !== undefined) {
                setSideNavCollapse(configFromApi.sideNavCollapse === 'true')
            }

            if (configFromApi.panelExpand !== undefined) {
                setPanelExpand(configFromApi.panelExpand === 'true')
            }

            setSession((prevSession) => ({
                ...(prevSession || { expires: '', user: {} }),
                config: {
                    ...(prevSession?.config || {}),
                    ...configFromApi,
                },
            }))

            showNotification(
                'success',
                t('displaySettings.saveTitle'),
                responsePayload.message || t('displaySettings.saveSuccessMessage'),
            )

            callBackClose?.()
        } catch {
            showNotification(
                'danger',
                t('displaySettings.saveTitle'),
                'Failed to save display settings. Please try again.',
            )
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Button block variant="solid" onClick={handleCopy} loading={isSaving}>
            {t('displaySettings.saveDisplaySettings')}
        </Button>
    )
}

export default CopyButton
