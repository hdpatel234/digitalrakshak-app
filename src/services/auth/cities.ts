import ApiService from './../ApiService'

export async function apiGetCities<T>(stateId: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/auth/cities',
        method: 'get',
        params: {
            state_id: stateId,
        },
    })
}
