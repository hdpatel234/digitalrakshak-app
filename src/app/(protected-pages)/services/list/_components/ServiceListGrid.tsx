'use client'

import { useProductListStore } from '../_store/productListStore'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import Pagination from '@/components/ui/Pagination'
import ServiceCard from './ServiceCard'
import type { Product } from '../types'
import { Select } from '@/components/ui/Select'

type ServiceListGridProps = {
    productListTotal: number
    pageIndex?: number
    pageSize?: number
}

const pageSizeOptions = [
    { value: 10, label: '10 / page' },
    { value: 20, label: '20 / page' },
    { value: 30, label: '30 / page' },
    { value: 40, label: '40 / page' },
    { value: 50, label: '50 / page' },
]

const ServiceListGrid = ({
    productListTotal,
    pageIndex = 1,
    pageSize = 10,
}: ServiceListGridProps) => {
    const productList = useProductListStore((state) => state.productList)
    const initialLoading = useProductListStore((state) => state.initialLoading)
    const { onAppendQueryParams } = useAppendQueryParams()

    const handlePaginationChange = (page: number) => {
        onAppendQueryParams({
            pageIndex: String(page),
        })
    }

    const handleSelectChange = (option: any) => {
        onAppendQueryParams({
            pageSize: String(option.value),
            pageIndex: '1',
        })
    }

    if (initialLoading) {
        return <div className="flex justify-center p-8">Loading...</div>
    }

    if (productList.length === 0) {
        return <div className="flex justify-center p-8 text-gray-500">No services found.</div>
    }

    return (
        <div className="flex flex-col gap-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {productList.map((product: Product) => (
                    <div key={product.id}>
                        <ServiceCard service={product} />
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between mt-4">
                <Pagination
                    currentPage={pageIndex}
                    total={productListTotal}
                    pageSize={pageSize}
                    onChange={handlePaginationChange}
                />
                <div style={{ minWidth: 130 }}>
                    <Select
                        size="sm"
                        isSearchable={false}
                        value={pageSizeOptions.filter((option) => option.value === pageSize)}
                        options={pageSizeOptions}
                        onChange={handleSelectChange}
                    />
                </div>
            </div>
        </div>
    )
}

export default ServiceListGrid
