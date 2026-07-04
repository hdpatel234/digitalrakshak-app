import AxiosBase from './axios/AxiosBase'
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

const ApiService = {
    fetchDataWithAxios<Response = unknown, Request = Record<string, unknown>>(
        param: AxiosRequestConfig<Request>,
    ) {
        // Global checkpoint for request
        console.log(`[API Request] ${param.method?.toUpperCase()} ${param.url}`, param)
        
        return new Promise<Response>((resolve, reject) => {
            AxiosBase(param)
                .then((response: AxiosResponse<Response>) => {
                    // Global checkpoint for success response
                    console.log(`[API Success] ${param.method?.toUpperCase()} ${param.url}`, response.data)
                    resolve(response.data)
                })
                .catch((errors: AxiosError) => {
                    // Global checkpoint for error response
                    console.error(`[API Error] ${param.method?.toUpperCase()} ${param.url}`, {
                        message: errors.message,
                        response: errors.response?.data,
                        status: errors.response?.status
                    })
                    reject(errors)
                })
        })
    },
}

export default ApiService
