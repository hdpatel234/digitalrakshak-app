import ApiService from '@/services/ApiService'

export async function apiAddTeamMember<T, U extends Record<string, unknown>>(
    data: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/client/settings/users',
        method: 'post',
        data,
    })
}

export async function apiGetTeamMember<T>(id: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/client/settings/users/${id}`,
        method: 'get',
    })
}

export async function apiUpdateTeamMember<T, U extends Record<string, unknown>>(
    id: string,
    data: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/client/settings/users/${id}`,
        method: 'put',
        data,
    })
}
