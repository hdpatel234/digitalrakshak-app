import ApiService from '@/services/ApiService'

export async function apiGetCompany<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/client/settings/company',
        method: 'get',
    })
}

export async function apiUpdateCompany<T, U extends Record<string, unknown>>(
    data: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/client/settings/company',
        method: 'put',
        data,
    })
}
