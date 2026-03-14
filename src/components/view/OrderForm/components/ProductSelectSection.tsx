'use client'

import { useCallback, useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Checkbox from '@/components/ui/Checkbox'
import ScrollBar from '@/components/ui/ScrollBar'
import AutoComplete from '@/components/shared/AutoComplete'
import { FormItem } from '@/components/ui/Form'
import { useOrderFormStore } from '../store/orderFormStore'
import classNames from '@/utils/classNames'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { TbSearch } from 'react-icons/tb'
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

    const [inputValue, setInputValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [productsDialogOpen, setProductsDialogOpen] = useState(false)

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

    const handleOptionSelect = (option: ProductOption) => {
        const selected = productList.find(
            (product) => product.id === option.value,
        )

        if (selected) {
            setSelectedProduct([{ ...selected, quantity: 1 }])
            setInputValue('')
        }
    }

    const handlePackageChecked = (checked: boolean, selected: Product) => {
        if (checked) {
            setSelectedProduct([{ ...selected, quantity: 1 }])
            return
        }
        setSelectedProduct([])
    }

    const selectedPackage = selectedProduct[0] as SelectedProduct | undefined

    return (
        <>
            <Card id="selectProducts">
                <h4 className="mb-6">Select package</h4>
                <FormItem
                    label="Package"
                    invalid={Boolean(validationErrors.package)}
                    errorMessage={validationErrors.package}
                >
                    <div className="flex items-center gap-2">
                        <AutoComplete<ProductOption>
                            data={productOption}
                            optionKey={(product) => product.label}
                            value={inputValue}
                            renderOption={(option) => (
                                <span>{option.label}</span>
                            )}
                            suffix={<TbSearch className="text-lg" />}
                            placeholder="Search package"
                            onInputChange={setInputValue}
                            onOptionSelected={handleOptionSelect}
                        />
                        <Button
                            type="button"
                            variant="solid"
                            onClick={() => setProductsDialogOpen(true)}
                        >
                            Browse Packages
                        </Button>
                    </div>
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
            <Dialog
                isOpen={productsDialogOpen}
                onClose={() => setProductsDialogOpen(false)}
                onRequestClose={() => setProductsDialogOpen(false)}
            >
                <div className="text-center mb-6">
                    <h4 className="mb-1">All packages</h4>
                    <p>Select one package for this order.</p>
                </div>
                <div className="mt-4">
                    <div className="mb-6">
                        <ScrollBar
                            className={classNames('overflow-y-auto h-80')}
                        >
                            {productList.map((pkg) => (
                                <div
                                    key={pkg.id}
                                    className="py-3 pr-5 rounded-lg flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="px-1">
                                            <Checkbox
                                                checked={selectedPackage?.id === pkg.id}
                                                onChange={(value) =>
                                                    handlePackageChecked(
                                                        value,
                                                        pkg,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div>
                                            <p className="heading-text font-bold">
                                                {pkg.name}
                                            </p>
                                            <p>ID: {pkg.productCode}</p>
                                        </div>
                                    </div>
                                    <div>
                                        Available Candidates:{' '}
                                        <span className="heading-text font-bold">
                                            {pkg.stock}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </ScrollBar>
                    </div>
                </div>
                <Button
                    block
                    type="button"
                    variant="solid"
                    onClick={() => setProductsDialogOpen(false)}
                >
                    Done
                </Button>
            </Dialog>
        </>
    )
}

export default ProductSelectSection
