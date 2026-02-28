import dashboardsNavigationConfig from './dashboards.navigation.config'
import operationsNavigationConfig from './operations.navigation.config'
import billingNavigationConfig from './billing.navigation.config'
import supportComponentNavigationConfig from './support-components.navigation.config'
import reportComponentNavigationConfig from './report-components.navigation.config'
import settingComponentsNavigationConfig from './setting-components.navigation.config'
import type { NavigationTree } from '@/@types/navigation'

const navigationConfig: NavigationTree[] = [
    ...dashboardsNavigationConfig,
    ...operationsNavigationConfig,
    ...billingNavigationConfig,
    ...supportComponentNavigationConfig,
    ...reportComponentNavigationConfig,
    ...settingComponentsNavigationConfig,
]

export default navigationConfig
