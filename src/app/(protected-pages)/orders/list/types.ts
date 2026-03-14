export type Order = {
    id: string
    displayId: string
    date: number
    customer: string
    status: number
    paymentMehod: string
    paymentIdendifier: string
    totalAmount: number
    totalAmountInPaise: number
    paymentProviderName: string
}

export type Orders = Order[]

export type Filter = {
    date: [Date, Date]
    status: string
    paymentMethod: string[]
}

export type StatusOption = {
    key: string
    name: string
}

export type PaymentMethodOption = {
    id: string
    name: string
    code: string
}
