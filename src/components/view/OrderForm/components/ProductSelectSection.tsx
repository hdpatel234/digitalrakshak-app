'use client'

import { useCallback, useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import { FormItem } from '@/components/ui/Form'
import { TbLayersLinked, TbUsers } from 'react-icons/tb'
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
                        {isLoading && (
                            <div className="col-span-full py-8 text-center text-gray-500">
                                Loading packages...
                            </div>
                        )}
                        {!isLoading && productList.length === 0 && (
                            <div className="col-span-full py-8 text-center text-gray-500">
                                No packages available.
                            </div>
                        )}
                        {!isLoading && productList.map((pkg, index) => {
                            const isSelected = selectedPackage?.id === pkg.id
                            
                            const colorThemes = [
                                'bg-blue-50/50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800/30',
                                'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700',
                                'bg-orange-50/50 border-orange-200 dark:bg-orange-900/10 dark:border-orange-800/30',
                                'bg-emerald-50/50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-800/30',
                            ]
                            const baseTheme = colorThemes[index % colorThemes.length]
                            const themeClass = isSelected 
                                ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-600 ring-2 ring-indigo-600'
                                : `${baseTheme} hover:border-indigo-400 hover:shadow-md`

                            return (
                                <div
                                    key={pkg.id}
                                    onClick={() => handleOptionSelect({ value: pkg.id, label: pkg.name, quantity: pkg.stock, img: '' })}
                                    className={`rounded-xl border p-5 shadow-sm flex flex-col h-full cursor-pointer transition-all ${themeClass}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                            {pkg.name}
                                        </h3>
                                        <div className="bg-indigo-100 dark:bg-indigo-900/30 p-1.5 rounded-md flex-shrink-0 ml-4">
                                            <TbLayersLinked className="text-indigo-600 dark:text-indigo-400 text-xl" />
                                        </div>
                                    </div>
                                    
                                    <p className="text-xs text-gray-500 mb-6">Code: {pkg.productCode}</p>
                                    
                                    <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-200/60 dark:border-gray-700/60">
                                        <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm">
                                            <TbUsers className="text-base" />
                                            <span>{pkg.stock} candidates</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                                                {new Intl.NumberFormat('en-IN', {
                                                    style: 'currency',
                                                    currency: 'INR',
                                                    minimumFractionDigits: 0,
                                                    maximumFractionDigits: 0,
                                                }).format(pkg.price)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </FormItem>
            </Card>
        </>
    )
}

export default ProductSelectSection
