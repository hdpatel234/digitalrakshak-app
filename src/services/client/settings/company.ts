import ApiService from '@/services/ApiService'

export async function apiGetCompany<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/client/settings/company',
        method: 'get',
    })
}

export async function apiUpdateCompany<T, U = Record<string, unknown> | FormData>(
    data: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/client/settings/company',
        method: 'post', // Changed to POST with _method=PUT in data to support file uploads in Laravel
        data,
    })
}
