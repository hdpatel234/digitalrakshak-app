type ChangePasswordPayload = {
    current_password: string
    new_password: string
}

type ChangePasswordResult<T = unknown> = {
    status?: boolean
    success?: boolean
    message?: string
    data?: T
    error?: string
}

export async function apiChangePassword<T = unknown>(
    payload: ChangePasswordPayload,
) {
    const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify(payload),
    })

    const result = (await response.json()) as ChangePasswordResult<T>

    if (!response.ok) {
        throw new Error(result.message || 'Failed to change password')
    }

    return result
}
