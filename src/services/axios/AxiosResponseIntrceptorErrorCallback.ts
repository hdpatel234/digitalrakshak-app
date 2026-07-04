import type { AxiosError } from 'axios'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import React from 'react'

const AxiosResponseIntrceptorErrorCallback = (error: AxiosError) => {
    /** handle response error here */
    console.error('Global API Error:', error)

    // Display a global toast notification for the error
    const errorMessage = (error.response?.data as any)?.message || error.message || 'An unexpected error occurred'

    toast.push(
        React.createElement(
            Notification,
            { title: "API Error", type: "danger", duration: 5000 },
            errorMessage
        ),
        { placement: 'top-center' }
    )
}

export default AxiosResponseIntrceptorErrorCallback
