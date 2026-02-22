'use server'
import type { SignInCredential } from '@/@types/auth'
import apiClient from '@/services/axios/ApiClient'

type PassportUser = {
    id?: string | number
    userId?: string | number
    first_name?: string
    last_name?: string
    name?: string
    userName?: string
    email?: string
    avatar?: string
    authority?: string[]
    is_admin?: boolean
}

type PassportLoginPayload = {
    token?: string
    access_token?: string
    refresh_token?: string
    token_type?: string
    expires_in?: number
    user?: PassportUser
    data?: PassportLoginPayload
}

export type ValidatedCredentialUser = {
    id: string
    userName: string
    email: string
    avatar: string
    authority: string[]
    accessToken: string
    refreshToken: string
    tokenType: string
    expiresIn: number
}

type PassportErrorPayload = {
    success?: boolean
    status?: boolean
    message?: string
    data?: PassportLoginPayload | []
    errors?: Record<string, string[]>
}

export type ValidateCredentialResult = {
    user: ValidatedCredentialUser | null
    message: string
}

const getErrorMessage = (
    message?: string,
    errors?: Record<string, string[]>,
): string => {
    if (errors && Object.keys(errors).length > 0) {
        return Object.values(errors).flat().join(' ')
    }
    return message || 'Invalid credentials'
}

export const validateCredentialWithResponse = async (
    values: SignInCredential,
): Promise<ValidateCredentialResult> => {
    const endpoint = '/v1/auth/login'

    const response = await apiClient.post(endpoint, values, false)
    const parsedResponse = (response || {}) as PassportErrorPayload &
        PassportLoginPayload

    const responseSuccess =
        typeof parsedResponse.success === 'boolean'
            ? parsedResponse.success
            : typeof parsedResponse.status === 'boolean'
              ? parsedResponse.status
              : Boolean(parsedResponse.user || parsedResponse.data)

    if (!responseSuccess) {
        return {
            user: null,
            message: getErrorMessage(
                parsedResponse.message,
                parsedResponse.errors,
            ),
        }
    }

    const responseData = parsedResponse.data
    const basePayload =
        responseData && !Array.isArray(responseData)
            ? (responseData as PassportLoginPayload)
            : (parsedResponse as PassportLoginPayload)
    const payload = (basePayload.data || basePayload) as PassportLoginPayload
    const user = payload.user

    if (!payload || !user) {
        console.error('Auth API failed', response)
        return {
            user: null,
            message: parsedResponse.message || 'Unable to log in',
        }
    }

    const userId = user.userId ?? user.id
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim()
    const userName = user.userName ?? user.name ?? fullName

    if (!userId || !userName || !user.email) {
        console.error('Auth API user fields are incomplete', {
            endpoint,
            hasUserId: Boolean(userId),
            hasUserName: Boolean(userName),
            hasEmail: Boolean(user.email),
        })
        return {
            user: null,
            message: parsedResponse.message || 'Unable to log in',
        }
    }

    const authority = Array.isArray(user.authority)
        ? user.authority
        : user.is_admin
            ? ['admin', 'user']
            : ['user']

    return {
        user: {
            id: String(userId),
            userName,
            email: user.email,
            avatar: user.avatar || '',
            authority,
            accessToken: payload.token || payload.access_token || '',
            refreshToken: payload.refresh_token || '',
            tokenType: payload.token_type || 'Bearer',
            expiresIn: payload.expires_in || 0,
        },
        message: parsedResponse.message || 'Login successful',
    }
}

const validateCredential = async (values: SignInCredential) => {
    const result = await validateCredentialWithResponse(values)
    return result.user
}

export default validateCredential
