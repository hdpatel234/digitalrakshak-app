'use client'

import { useCallback, useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { FormItem } from '@/components/ui/Form'
import { useOrderFormStore } from '../store/orderFormStore'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import type { Product, ProductOption, SelectedProduct } from '../types'

type ApiResponsePayload = {
    status?: boolean
    success?: boolean
    message?: string
    data?: unknown
}

const ProductSelectSection = () => {
    const {
        productOption,
        productList,
        selectedProduct,
        setSelectedProduct,
        setProductList,
        setProductOption,
        validationErrors,
    } = useOrderFormStore()

    const [isLoading, setIsLoading] = useState(false)

    const mapApiSuccess = (payload: ApiResponsePayload) =>
        payload.status === true || payload.success === true

    const mapPackageToProduct = (item: unknown): Product | null => {
        const record =
            item && typeof item === 'object'
                ? (item as Record<string, unknown>)
                : {}

        const id = String(record.id ?? '').trim()
        const name = String(record.package_name ?? record.name ?? '').trim()
        const packageCode = String(record.package_code ?? '').trim()
        const rawPrice =
            record.total_price ?? record.final_price ?? record.price ?? 0
        const price = Number.parseFloat(String(rawPrice))
        const availableCandidates = Number.parseInt(
            String(record.available_candidates ?? 0),
            10,
        )

        if (!id || !name) {
            return null
        }

        return {
            id,
            name,
            productCode: packageCode || '-',
            img: '',
            price: Number.isFinite(price) ? price : 0,
            stock: Number.isInteger(availableCandidates)
                ? availableCandidates
                : 0,
        }
    }

    const fetchPackages = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/client/packages?page=1&limit=200', {
                method: 'GET',
                cache: 'no-store',
            })
            const payload = ((await response.json()) as ApiResponsePayload) || {}

            if (!response.ok || !mapApiSuccess(payload)) {
                toast.push(
                    <Notification type="danger">
                        {payload.message || 'Failed to fetch packages.'}
                    </Notification>,
                    { placement: 'top-center' },
                )
                setProductList([])
                setProductOption([])
                return
            }

            const dataRecord =
                payload.data && typeof payload.data === 'object'
                    ? (payload.data as Record<string, unknown>)
                    : {}
            const rawList = Array.isArray(dataRecord.list) ? dataRecord.list : []

            const packageList = rawList
                .map(mapPackageToProduct)
                .filter((item): item is Product => item !== null)

            const options: ProductOption[] = packageList.map((pkg) => ({
                label:
                    pkg.productCode && pkg.productCode !== '-'
                        ? `${pkg.name} (${pkg.productCode})`
                        : pkg.name,
                value: pkg.id,
                img: '',
                quantity: pkg.stock,
            }))

            setProductList(packageList)
            setProductOption(options)
        } catch {
            toast.push(
                <Notification type="danger">Failed to fetch packages.</Notification>,
                { placement: 'top-center' },
            )
            setProductList([])
            setProductOption([])
        } finally {
            setIsLoading(false)
        }
    }, [setProductList, setProductOption])

    useEffect(() => {
        fetchPackages()
    }, [fetchPackages])

    const handleOptionSelect = (option: ProductOption | null) => {
        if (!option) {
            setSelectedProduct([])
            return
        }

        const selected = productList.find(
            (product) => product.id === option.value,
        )

        if (selected) {
            setSelectedProduct([{ ...selected, quantity: 1 }])
        }
    }

    const selectedPackage = selectedProduct[0] as SelectedProduct | undefined
    const selectedOption =
        productOption.find((option) => option.value === selectedPackage?.id) ||
        null

    return (
        <>
            <Card id="selectProducts">
                <h4 className="mb-6">Select package</h4>
                <FormItem
                    label="Package"
                    invalid={Boolean(validationErrors.package)}
                    errorMessage={validationErrors.package}
                >
                    <Select<ProductOption>
                        instanceId="package-select"
                        options={productOption}
                        isLoading={isLoading}
                        isSearchable
                        value={selectedOption}
                        placeholder="Select package"
                        onChange={handleOptionSelect}
                    />
                </FormItem>
                <div className="mt-4">
                    {isLoading && (
                        <p className="text-sm text-gray-500">
                            Loading packages...
                        </p>
                    )}
                    {!isLoading && !selectedPackage && (
                        <p className="text-sm text-gray-500">
                            No package selected yet.
                        </p>
                    )}
                    {!isLoading && selectedPackage && (
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-between gap-3">
                                <p className="font-semibold">{selectedPackage.name}</p>
                                <Button
                                    type="button"
                                    size="xs"
                                    onClick={() => setSelectedProduct([])}
                                >
                                    Remove
                                </Button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Code: {selectedPackage.productCode}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Available candidates: {selectedPackage.stock}
                            </p>
                        </div>
                    )}
                </div>
            </Card>
        </>
    )
}

export default ProductSelectSection
