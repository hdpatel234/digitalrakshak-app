import { create } from 'zustand'
import type {
    Orders,
    Filter,
    StatusOption,
    PaymentMethodOption,
} from '../types'
import dayjs from 'dayjs'

export const initialFilterData = {
    date: [dayjs().subtract(1, 'week').toDate(), new Date()] as [Date, Date],
    status: 'all',
    paymentMethod: [],
}

export type OrderListState = {
    filterData: Filter
    orderList: Orders
    initialLoading: boolean
    statusOptions: StatusOption[]
    paymentMethodOptions: PaymentMethodOption[]
}

type OrderListAction = {
    setFilterData: (payload: Filter) => void
    setOrderList: (payload: Orders) => void
    setInitialLoading: (payload: boolean) => void
    setStatusOptions: (payload: StatusOption[]) => void
    setPaymentMethodOptions: (payload: PaymentMethodOption[]) => void
}

const initialState: OrderListState = {
    filterData: initialFilterData,
    orderList: [],
    initialLoading: true,
    statusOptions: [],
    paymentMethodOptions: [],
}

export const useOrderListStore = create<OrderListState & OrderListAction>(
    (set) => ({
        ...initialState,
        setFilterData: (payload) => set(() => ({ filterData: payload })),
        setOrderList: (payload) => set(() => ({ orderList: payload })),
        setInitialLoading: (payload) =>
            set(() => ({ initialLoading: payload })),
        setStatusOptions: (payload) => set(() => ({ statusOptions: payload })),
        setPaymentMethodOptions: (payload) =>
            set(() => ({ paymentMethodOptions: payload })),
    }),
)
