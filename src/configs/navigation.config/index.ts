import dashboardsNavigationConfig from './dashboards.navigation.config'
import conceptsNavigationConfig from './concepts.navigation.config'
import type { NavigationTree } from '@/@types/navigation'

const navigationConfig: NavigationTree[] = [
    ...dashboardsNavigationConfig,
    ...conceptsNavigationConfig,
    // ...uiComponentNavigationConfig,
    // ...authNavigationConfig,
    // ...othersNavigationConfig,
    // ...guideNavigationConfig,
]

export default navigationConfig
