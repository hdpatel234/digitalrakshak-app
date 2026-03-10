export type Product = {
    id: string
    serviceCode: string
    category: string
    name: string
    description: string
    price: number
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
