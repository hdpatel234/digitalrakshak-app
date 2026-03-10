'use client'

import { useMemo, useState } from 'react'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { useProductListStore } from '../_store/productListStore'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import { useRouter } from 'next/navigation'
import { TbEye, TbPencil, TbTrash } from 'react-icons/tb'
import { NumericFormat } from 'react-number-format'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { Product } from '../types'

type ProductListTableProps = {
    productListTotal: number
    pageIndex?: number
    pageSize?: number
}

const ProductListTable = ({
    productListTotal,
    pageIndex = 1,
    pageSize = 10,
}: ProductListTableProps) => {
    const router = useRouter()
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [toDeleteId, setToDeleteId] = useState('')

    const productList = useProductListStore((state) => state.productList)
    const selectedProduct = useProductListStore(
        (state) => state.selectedProduct,
    )
    const setSelectAllProduct = useProductListStore(
        (state) => state.setSelectAllProduct,
    )
    const setProductList = useProductListStore((state) => state.setProductList)
    const setSelectedProduct = useProductListStore(
        (state) => state.setSelectedProduct,
    )
    const initialLoading = useProductListStore((state) => state.initialLoading)

    const { onAppendQueryParams } = useAppendQueryParams()

    const isAdminPackage = (product: Product) =>
        String(product.type || '').toLowerCase() === 'admin'

    const canManagePackage = (product: Product) => !isAdminPackage(product)

    const handleEdit = (product: Product) => {
        if (!canManagePackage(product)) {
            return
        }

        router.push(`/packages/edit/${product.id}`)
    }

    const handleView = (product: Product) => {
        router.push(`/packages/edit/${product.id}`)
    }

    const handleDelete = (product: Product) => {
        if (!canManagePackage(product)) {
            return
        }

        setToDeleteId(product.id)
        setDeleteConfirmationOpen(true)
    }

    const handleCancelDelete = () => {
        setDeleteConfirmationOpen(false)
        setToDeleteId('')
    }

    const handleConfirmDelete = () => {
        const newProductList = productList.filter(
            (product) => product.id !== toDeleteId,
        )
        const newSelectedProduct = selectedProduct.filter(
            (product) => product.id !== toDeleteId,
        )

        setProductList(newProductList)
        setSelectAllProduct(newSelectedProduct)
        handleCancelDelete()
    }

    const columns: ColumnDef<Product>[] = useMemo(
        () => [
            {
                header: 'Package Code',
                accessorKey: 'packageCode',
                cell: (props) => props.row.original.packageCode || '-',
            },
            {
                header: 'Name',
                accessorKey: 'name',
            },
            {
                header: 'Description',
                accessorKey: 'description',
                cell: (props) => props.row.original.description || '-',
            },
            {
                header: 'Price',
                accessorKey: 'price',
                cell: (props) => {
                    const { price } = props.row.original
                    return (
                        <span className="font-bold heading-text">
                            <NumericFormat
                                fixedDecimalScale
                                prefix="₹"
                                displayType="text"
                                value={price}
                                decimalScale={2}
                                thousandSeparator={true}
                            />
                        </span>
                    )
                },
            },
            {
                header: 'Action',
                id: 'action',
                cell: (props) => {
                    const row = props.row.original
                    const showViewOnly = isAdminPackage(row)

                    return (
                        <div className="flex items-center gap-3">
                            {showViewOnly ? (
                                <Tooltip title="View">
                                    <div
                                        className="text-xl cursor-pointer select-none font-semibold"
                                        role="button"
                                        onClick={() => handleView(row)}
                                    >
                                        <TbEye />
                                    </div>
                                </Tooltip>
                            ) : (
                                <>
                                    <Tooltip title="Edit">
                                        <div
                                            className="text-xl cursor-pointer select-none font-semibold"
                                            role="button"
                                            onClick={() => handleEdit(row)}
                                        >
                                            <TbPencil />
                                        </div>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <div
                                            className="text-xl cursor-pointer select-none font-semibold"
                                            role="button"
                                            onClick={() => handleDelete(row)}
                                        >
                                            <TbTrash />
                                        </div>
                                    </Tooltip>
                                </>
                            )}
                        </div>
                    )
                },
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    )

    const handlePaginationChange = (page: number) => {
        onAppendQueryParams({
            pageIndex: String(page),
        })
    }

    const handleSelectChange = (value: number) => {
        onAppendQueryParams({
            pageSize: String(value),
            pageIndex: '1',
        })
    }

    const handleSort = (sort: OnSortParam) => {
        const sortFieldMap: Record<string, string> = {
            packageCode: 'package_code',
            type: 'type',
            name: 'package_name',
            description: 'description',
            price: 'total_amount',
        }

        onAppendQueryParams({
            sortKey: sortFieldMap[sort.key] || 'package_name',
            order: sort.order || 'asc',
        })
    }

    const handleRowSelect = (checked: boolean, row: Product) => {
        setSelectedProduct(checked, row)
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<Product>[]) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            setSelectAllProduct(originalRows)
        } else {
            setSelectAllProduct([])
        }
    }

    return (
        <>
            <DataTable
                selectable
                columns={columns}
                data={productList}
                noData={productList.length === 0}
                loading={initialLoading}
                pagingData={{
                    total: productListTotal,
                    pageIndex,
                    pageSize,
                }}
                checkboxChecked={(row) =>
                    selectedProduct.some((selected) => selected.id === row.id)
                }
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                onSort={handleSort}
                onCheckBoxChange={handleRowSelect}
                onIndeterminateCheckBoxChange={handleAllRowSelect}
            />
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Remove package"
                onClose={handleCancelDelete}
                onRequestClose={handleCancelDelete}
                onCancel={handleCancelDelete}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    Are you sure you want to remove this package? This action
                    can&apos;t be undo.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default ProductListTable
