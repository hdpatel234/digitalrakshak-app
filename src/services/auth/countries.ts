import ApiService from './../ApiService'

export async function apiGetCountries<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/auth/countries',
        method: 'get',
    })
}