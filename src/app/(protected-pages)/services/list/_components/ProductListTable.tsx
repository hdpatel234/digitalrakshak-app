'use client'

import { useMemo } from 'react'
import DataTable from '@/components/shared/DataTable'
import Tooltip from '@/components/ui/Tooltip'
import { useProductListStore } from '../_store/productListStore'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import { useRouter } from 'next/navigation'
import { TbEye } from 'react-icons/tb'
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

    const productList = useProductListStore((state) => state.productList)
    const selectedProduct = useProductListStore(
        (state) => state.selectedProduct,
    )
    const setSelectAllProduct = useProductListStore(
        (state) => state.setSelectAllProduct,
    )
    const setSelectedProduct = useProductListStore(
        (state) => state.setSelectedProduct,
    )
    const initialLoading = useProductListStore((state) => state.initialLoading)

    const { onAppendQueryParams } = useAppendQueryParams()

    const handleView = (product: Product) => {
        router.push(`/services/edit/${product.id}`)
    }

    const ActionColumn = ({ onView }: { onView: () => void }) => {
        return (
            <div className="flex items-center gap-3">
                <Tooltip title="View">
                    <div
                        className={`text-xl cursor-pointer select-none font-semibold`}
                        role="button"
                        onClick={onView}
                    >
                        <TbEye />
                    </div>
                </Tooltip>
            </div>
        )
    }

    const columns: ColumnDef<Product>[] = useMemo(
        () => [
            {
                header: 'Service Code',
                accessorKey: 'serviceCode',
                cell: (props) => props.row.original.serviceCode || '-',
            },
            {
                header: 'Category',
                accessorKey: 'category',
                cell: (props) => props.row.original.category || '-',
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
                cell: (props) => (
                    <ActionColumn
                        onView={() => handleView(props.row.original)}
                    />
                ),
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
            serviceCode: 'service_code',
            category: 'service_category_name',
            name: 'service_name',
            description: 'description',
            price: 'price',
        }

        onAppendQueryParams({
            sortKey: sortFieldMap[sort.key] || 'service_name',
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
    )
}

export default ProductListTable
