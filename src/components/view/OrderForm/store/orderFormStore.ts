import { create } from 'zustand'
import type {
    Candidate,
    ProductOption,
    Products,
    SelectedProduct,
} from '../types'

export type OrderFormState = {
    productList: Products
    productOption: ProductOption[]
    selectedProduct: SelectedProduct[]
    candidateList: Candidate[]
    selectedCandidates: Candidate[]
    paymentMethodId: string
    paymentProviderId: string
    prefillPaymentProviderId: string
    validationErrors: {
        package: string
        candidates: string
        paymentProvider: string
    }
}

type OrderFormAction = {
    setProductList: (payload: Products) => void
    setProductOption: (payload: ProductOption[]) => void
    setSelectedProduct: (payload: SelectedProduct[]) => void
    setCandidateList: (payload: Candidate[]) => void
    setSelectedCandidates: (payload: Candidate[]) => void
    setPaymentMethodId: (payload: string) => void
    setPaymentProviderId: (payload: string) => void
    setPrefillPaymentProviderId: (payload: string) => void
    setValidationErrors: (payload: OrderFormState['validationErrors']) => void
}

const initialState: OrderFormState = {
    productList: [],
    productOption: [],
    selectedProduct: [],
    candidateList: [],
    selectedCandidates: [],
    paymentMethodId: '',
    paymentProviderId: '',
    prefillPaymentProviderId: '',
    validationErrors: {
        package: '',
        candidates: '',
        paymentProvider: '',
    },
}

export const useOrderFormStore = create<OrderFormState & OrderFormAction>(
    (set) => ({
        ...initialState,
        setProductOption: (payload) => set(() => ({ productOption: payload })),
        setProductList: (payload) => set(() => ({ productList: payload })),
        setSelectedProduct: (payload) =>
            set(() => ({ selectedProduct: payload })),
        setCandidateList: (payload) => set(() => ({ candidateList: payload })),
        setSelectedCandidates: (payload) =>
            set(() => ({ selectedCandidates: payload })),
        setPaymentMethodId: (payload) =>
            set(() => ({ paymentMethodId: payload })),
        setPaymentProviderId: (payload) =>
            set(() => ({ paymentProviderId: payload })),
        setPrefillPaymentProviderId: (payload) =>
            set(() => ({ prefillPaymentProviderId: payload })),
        setValidationErrors: (payload) =>
            set(() => ({ validationErrors: payload })),
    }),
)
