import ApiService from './../ApiService'

export async function apiGetStates<T>(countryId: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/auth/states',
        method: 'get',
        params: {
            country_id: countryId,
        },
    })
}
