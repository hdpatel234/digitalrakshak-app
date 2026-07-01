'use client'

import { useProductListStore } from '../_store/productListStore'
import ServiceCard from './ServiceCard'
import type { Product } from '../types'

type ServiceListGridProps = {
    productListTotal: number
    pageIndex?: number
    pageSize?: number
}

const ServiceListGrid = ({
    productListTotal,
    pageIndex = 1,
    pageSize = 10,
}: ServiceListGridProps) => {
    const productList = useProductListStore((state) => state.productList)
    const initialLoading = useProductListStore((state) => state.initialLoading)

    if (initialLoading) {
        return <div className="flex justify-center p-8">Loading...</div>
    }

    if (productList.length === 0) {
        return <div className="flex justify-center p-8 text-gray-500">No services found.</div>
    }

    return (
        <div className="flex flex-col gap-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {productList.map((product: Product) => (
                    <div key={product.id}>
                        <ServiceCard service={product} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ServiceListGrid
