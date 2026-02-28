import dashboardsRoute from './dashboardsRoute'
import conceptsRoute from './conceptsRoute'
import authRoute from './authRoute'
import billingRoute from './billingRoute'
import supportRoute from './supportRoute'
import reportRoute from './reportRoute'
import settingRoute from './settingRoute'
import type { Routes } from '@/@types/routes'

export const protectedRoutes: Routes = {
    ...dashboardsRoute,
    ...conceptsRoute,
    ...billingRoute,
    ...supportRoute,
    ...reportRoute,
    ...settingRoute,
}

export const publicRoutes: Routes = {}

export const authRoutes = authRoute
