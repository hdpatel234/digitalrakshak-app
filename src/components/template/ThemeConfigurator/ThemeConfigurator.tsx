import ModeSwitcher from './ModeSwitcher'
import LayoutSwitcher from './LayoutSwitcher'
import ThemeSwitcher from './ThemeSwitcher'
import DirectionSwitcher from './DirectionSwitcher'
import CopyButton from './CopyButton'
import useTranslation from '@/utils/hooks/useTranslation'

export type ThemeConfiguratorProps = {
    callBackClose?: () => void
}

const ThemeConfigurator = ({ callBackClose }: ThemeConfiguratorProps) => {

    const t = useTranslation('header')

    return (
        <div className="flex flex-col h-full justify-between">
            <div className="flex flex-col gap-y-10 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h6>{t('displaySettings.darkMode')}</h6>
                        <span>{t('displaySettings.darkModeDescription')}</span>
                    </div>
                    <ModeSwitcher />
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <h6>{t('displaySettings.direction')}</h6>
                        <span>{t('displaySettings.directionDescription')}</span>
                    </div>
                    <DirectionSwitcher callBackClose={callBackClose} />
                </div>
                <div>
                    <h6 className="mb-3">{t('displaySettings.theme')}</h6>
                    <ThemeSwitcher />
                </div>
                <div>
                    <h6 className="mb-3">{t('displaySettings.layout')}</h6>
                    <LayoutSwitcher />
                </div>
            </div>
            <CopyButton callBackClose={callBackClose}/>
        </div>
    )
}

export default ThemeConfigurator
