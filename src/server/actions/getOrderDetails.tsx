import { auth } from '@/auth'
import apiClient from '@/services/axios/ApiClient'
import type { ClientOrderDetailResponse } from '@/app/(protected-pages)/orders/details/[id]/types'

const getOrderDetails = async (queryParams: {
    id?: string | string[] | undefined
    [key: string]: any
}): Promise<ClientOrderDetailResponse | null> => {
    try {
        const session = await auth()
        const accessToken = session?.accessToken || ''
        const tokenType = session?.tokenType || 'Bearer'

        if (!accessToken) {
            console.error('No accessToken found in session')
            return null
        }

        const id = queryParams.id
        if (!id) {
            console.error('No order ID provided to getOrderDetails')
            return null
        }

        const payload = await apiClient.request<ClientOrderDetailResponse>(
            'get',
            `/client/orders/${id}`,
            {},
            false,
            {
                headers: {
                    Accept: 'application/json',
                    Authorization: `${tokenType} ${accessToken}`,
                },
            },
        )

        if (payload && (payload.status === true || payload.success === true) && payload.data) {
            return payload.data
        }
        
        console.error('Failed to fetch order details from upstream:', payload?.message)
        return null
    } catch (error) {
        console.error('Error fetching order details in action:', error)
        return null
    }
}

export default getOrderDetails
