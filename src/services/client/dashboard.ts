import ApiService from '../ApiService'

export async function apiGetDashboardData<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/client/dashboard/data',
        method: 'get',
    })
}
