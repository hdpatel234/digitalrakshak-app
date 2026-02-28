import classNames from 'classnames'
import useTheme from '@/utils/hooks/useTheme'
import {
    LAYOUT_COLLAPSIBLE_SIDE,
    LAYOUT_STACKED_SIDE,
    LAYOUT_TOP_BAR_CLASSIC,
    LAYOUT_FRAMELESS_SIDE,
    LAYOUT_CONTENT_OVERLAY,
} from '@/constants/theme.constant'
import CollapsibleSideSvg from '@/assets/svg/CollapsibleSideSvg'
import StackedSideSvg from '@/assets/svg/StackedSideSvg'
import TopBarClassicSvg from '@/assets/svg/TopBarClassicSvg'
import FrameLessSideSvg from '@/assets/svg/FrameLessSideSvg'
import ContentOverlaySvg from '@/assets/svg/ContentOverlaySvg'
import type { LayoutType } from '@/@types/theme'
import useTranslation from '@/utils/hooks/useTranslation'

const layouts = [
    {
        value: LAYOUT_COLLAPSIBLE_SIDE,
        label: 'layoutOptions.collapsible',
        src: '/img/thumbs/layouts/classic.jpg',
        srcDark: '/img/thumbs/layouts/classic-dark.jpg',
        svg: <CollapsibleSideSvg height={'100%'} width={'100%'} />,
    },
    {
        value: LAYOUT_STACKED_SIDE,
        label: 'layoutOptions.stacked',
        src: '/img/thumbs/layouts/modern.jpg',
        srcDark: '/img/thumbs/layouts/modern-dark.jpg',
        svg: <StackedSideSvg height={'100%'} width={'100%'} />,
    },
    {
        value: LAYOUT_TOP_BAR_CLASSIC,
        label: 'layoutOptions.topBar',
        src: '/img/thumbs/layouts/stackedSide.jpg',
        srcDark: '/img/thumbs/layouts/stackedSide-dark.jpg',
        svg: <TopBarClassicSvg height={'100%'} width={'100%'} />,
    },
    {
        value: LAYOUT_FRAMELESS_SIDE,
        label: 'layoutOptions.frameless',
        src: '/img/thumbs/layouts/simple.jpg',
        srcDark: '/img/thumbs/layouts/simple-dark.jpg',
        svg: <FrameLessSideSvg height={'100%'} width={'100%'} />,
    },
    {
        value: LAYOUT_CONTENT_OVERLAY,
        label: 'layoutOptions.overlay',
        src: '/img/thumbs/layouts/decked.jpg',
        srcDark: '/img/thumbs/layouts/decked-dark.jpg',
        svg: <ContentOverlaySvg height={'100%'} width={'100%'} />,
    }
]

const LayoutSwitcher = () => {
    const t = useTranslation('header')
    const layoutType = useTheme((state) => state.layout.type)
    const setLayout = useTheme((state) => state.setLayout)

    return (
        <div>
            <div className="grid grid-cols-3 gap-4 w-full">
                {layouts.map((layout) => {
                    const active = layoutType === layout.value
                    return (
                        <div className="text-center" key={layout.value}>
                            <button
                                type="button"
                                className={classNames(
                                    'border-2 rounded-xl overflow-hidden',
                                    active
                                        ? 'border-primary dark:border-primary'
                                        : 'border-gray-200 dark:border-gray-700',
                                )}
                                onClick={() => setLayout(layout.value as LayoutType)}
                            >
                                {layout.svg}
                            </button>
                            <div className="mt-2 font-semibold">
                                {t(layout.label)}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default LayoutSwitcher
