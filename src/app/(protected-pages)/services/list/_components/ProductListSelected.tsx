'use client'

import StickyFooter from '@/components/shared/StickyFooter'
import Button from '@/components/ui/Button'
import { useProductListStore } from '../_store/productListStore'
import { TbChecks, TbPackage, TbSend } from 'react-icons/tb'
import { useRouter } from 'next/navigation'

const ProductListSelected = () => {
    const router = useRouter()

    const selectedProduct = useProductListStore(
        (state) => state.selectedProduct,
    )
    const setSelectAllProduct = useProductListStore(
        (state) => state.setSelectAllProduct,
    )

    const handleCreatePackage = () => {
        router.push('/packages/create')
        setSelectAllProduct([])
    }

    const handleInviteCandidates = () => {
        router.push('/candidates/list')
        setSelectAllProduct([])
    }

    if (selectedProduct.length === 0) {
        return null
    }

    return (
        <StickyFooter
            className="flex items-center justify-between py-4 bg-white dark:bg-gray-800"
            stickyClass="-mx-4 sm:-mx-8 border-t border-gray-200 dark:border-gray-700 px-8"
            defaultClass="container mx-auto px-8 rounded-xl border border-gray-200 dark:border-gray-600 mt-4"
        >
            <div className="container mx-auto">
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <span className="text-lg text-primary">
                            <TbChecks />
                        </span>
                        <span className="font-semibold flex items-center gap-1">
                            <span className="heading-text">
                                {selectedProduct.length} Services
                            </span>
                            <span>selected</span>
                        </span>
                    </span>

                    <div className="flex items-center">
                        <Button
                            size="sm"
                            className="ltr:mr-3 rtl:ml-3"
                            variant="solid"
                            icon={<TbPackage />}
                            onClick={handleCreatePackage}
                        >
                            Create Package
                        </Button>
                        <Button
                            size="sm"
                            variant="solid"
                            icon={<TbSend />}
                            onClick={handleInviteCandidates}
                        >
                            Invite Candidates
                        </Button>
                    </div>
                </div>
            </div>
        </StickyFooter>
    )
}

export default ProductListSelected
