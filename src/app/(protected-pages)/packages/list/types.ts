export type Product = {
    id: string
    packageCode: string
    type: string
    name: string
    description: string
    availableCandidates: number
    price: number
    services: string[]
    icon?: string
}

export type Filter = {
    minAmount: number | string
    maxAmount: number | string
    productStatus: string
    productType: string[]
}

export type GetProductListResponse = {
    list: Product[]
    total: number
}
