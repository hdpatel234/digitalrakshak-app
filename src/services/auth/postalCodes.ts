import ApiService from './../ApiService'

export async function apiGetPostalCodeLocation<T>(params: { postal_code: string }) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/auth/postal-codes',
        method: 'get',
        params,
    })
}
