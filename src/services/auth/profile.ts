import ApiService from './../ApiService'

type UpdateProfileResponse<T = unknown> = {
    status?: boolean
    success?: boolean
    message?: string
    data?: T
}

export async function apiUpdateProfile<T = unknown>(data: FormData) {
    return ApiService.fetchDataWithAxios<UpdateProfileResponse<T>, FormData>({
        url: '/auth/profile',
        method: 'post',
        data,
    })
}

export async function apiGetPermissions<T = string[]>() {
    return ApiService.fetchDataWithAxios<{ status: boolean; message: string; data: T }>({
        url: '/auth/permissions',
        method: 'get',
    })
}
