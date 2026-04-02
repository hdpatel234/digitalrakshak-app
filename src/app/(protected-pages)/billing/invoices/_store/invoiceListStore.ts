import { create } from 'zustand'
import type { Invoices, Filter, StatusOption } from '../types'
import dayjs from 'dayjs'

export const initialFilterData = {
    date: [dayjs().subtract(1, 'week').toDate(), new Date()] as [Date, Date],
    status: 'all',
    search: '',
}

export type InvoiceListState = {
    filterData: Filter
    invoiceList: Invoices
    initialLoading: boolean
    statusOptions: StatusOption[]
}

type InvoiceListAction = {
    setFilterData: (payload: Filter) => void
    setInvoiceList: (payload: Invoices) => void
    setInitialLoading: (payload: boolean) => void
    setStatusOptions: (payload: StatusOption[]) => void
}

const initialState: InvoiceListState = {
    filterData: initialFilterData,
    invoiceList: [],
    initialLoading: true,
    statusOptions: [],
}

export const useInvoiceListStore = create<InvoiceListState & InvoiceListAction>(
    (set) => ({
        ...initialState,
        setFilterData: (payload) => set(() => ({ filterData: payload })),
        setInvoiceList: (payload) => set(() => ({ invoiceList: payload })),
        setInitialLoading: (payload) =>
            set(() => ({ initialLoading: payload })),
        setStatusOptions: (payload) => set(() => ({ statusOptions: payload })),
    }),
)
