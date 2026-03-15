'use client'

import { useEffect } from 'react'
import { Form } from '@/components/ui/Form'
import Affix from '@/components/shared/Affix'
import Card from '@/components/ui/Card'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import ProductSelectSection from './components/ProductSelectSection'
import CustomerDetailSection from './components/CustomerDetailSection'
import PaymentMethodSection from './components/PaymentMethodSection'
import Navigator from './components/Navigator'
import { useOrderFormStore } from './store/orderFormStore'
import useLayoutGap from '@/utils/hooks/useLayoutGap'
import isEmpty from 'lodash/isEmpty'
import { useForm } from 'react-hook-form'
import type { ReactNode } from 'react'
import type { OrderFormSchema, SelectedProduct } from './types'
import type { CommonProps } from '@/@types/common'

type OrderFormProps = {
    children: ReactNode
    onFormSubmit: (values: OrderFormSchema) => void
    defaultValues?: OrderFormSchema
    defaultProducts?: SelectedProduct[]
    newOrder?: boolean
    showValidation?: boolean
    footerStickyMode?: 'fixed' | 'sticky'
} & CommonProps

const OrderForm = (props: OrderFormProps) => {
    const {
        onFormSubmit,
        children,
        defaultValues,
        defaultProducts,
        showValidation = false,
        footerStickyMode,
    } = props

    const {
        setSelectedProduct,
        selectedProduct,
        selectedCandidates,
        paymentProviderId,
    } = useOrderFormStore()

    const { getTopGapValue } = useLayoutGap()

    useEffect(() => {
        if (defaultProducts) {
            setSelectedProduct(defaultProducts)
        }
        if (!isEmpty(defaultValues)) {
            reset(defaultValues)
        }
        return () => {
            setSelectedProduct([])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onSubmit = (values: OrderFormSchema) => {
        onFormSubmit?.(values)
    }

    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
    } = useForm<OrderFormSchema>({
        defaultValues: {
            paymentMethod: '',
            ...(defaultValues ? defaultValues : {}),
        },
    })

    return (
        <div className="flex">
            <Form
                className="flex-1 flex flex-col overflow-hidden"
                onSubmit={handleSubmit(onSubmit)}
            >
                <Container>
                    <div className="flex gap-4">
                        <div className="w-[360px] hidden lg:block">
                            <Affix offset={getTopGapValue()}>
                                <Card>
                                    <Navigator />
                                </Card>
                            </Affix>
                        </div>

                        <div className="flex-1">
                            <div className="flex flex-col gap-4">
                                <ProductSelectSection />
                                <CustomerDetailSection
                                    control={control}
                                    errors={errors}
                                />
                                <PaymentMethodSection
                                    control={control}
                                    errors={errors}
                                />
                                <Card>
                                    <h4 className="mb-4">Order Summary</h4>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-300">
                                            Package Amount
                                        </span>
                                        <span className="font-semibold">
                                            ₹{''}
                                            {(
                                                selectedProduct[0]?.price || 0
                                            ).toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm mt-2">
                                        <span className="text-gray-600 dark:text-gray-300">
                                            Candidates
                                        </span>
                                        <span className="font-semibold">
                                            {selectedCandidates.length}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-base mt-4">
                                        <span className="font-semibold">
                                            Total (incl. GST)
                                        </span>
                                        <span className="font-bold heading-text">
                                            ₹{''}
                                            {(
                                                (selectedProduct[0]?.price ||
                                                    0) *
                                                selectedCandidates.length
                                            ).toFixed(2)}
                                        </span>
                                    </div>
                                    {showValidation && (
                                        <div className="mt-4 rounded-lg border border-error bg-error-subtle px-3 py-2 text-sm text-error">
                                            {!selectedProduct[0] && (
                                                <div>
                                                    Please select a package.
                                                </div>
                                            )}
                                            {selectedProduct[0] &&
                                                selectedCandidates.length ===
                                                    0 && (
                                                    <div>
                                                        Please select at least
                                                        one candidate.
                                                    </div>
                                                )}
                                            {selectedProduct[0] &&
                                                selectedCandidates.length > 0 &&
                                                !paymentProviderId && (
                                                    <div>
                                                        Please select a payment
                                                        provider.
                                                    </div>
                                                )}
                                        </div>
                                    )}
                                </Card>
                            </div>
                        </div>
                    </div>
                </Container>
                <BottomStickyBar forceFixed={footerStickyMode === 'fixed'}>
                    {children}
                </BottomStickyBar>
            </Form>
        </div>
    )
}

export default OrderForm
