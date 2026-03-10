'use client'

import ProductListSearch from './ProductListSearch'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'

const ProducListTableTools = () => {
    const { onAppendQueryParams } = useAppendQueryParams()

    const handleInputChange = (query: string) => {
        onAppendQueryParams({
            query,
        })
    }

    return (
        <div className="flex">
            <ProductListSearch onInputChange={handleInputChange} />
        </div>
    )
}

export default ProducListTableTools
