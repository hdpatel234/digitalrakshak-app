import { create } from 'zustand'
import type { Transactions, Filter, StatusOption } from '../types'
import dayjs from 'dayjs'

export const initialFilterData = {
    date: [dayjs().subtract(1, 'week').toDate(), new Date()] as [Date, Date],
    status: 'all',
    search: '',
}

export type TransactionListState = {
    filterData: Filter
    transactionList: Transactions
    initialLoading: boolean
    statusOptions: StatusOption[]
}

type TransactionListAction = {
    setFilterData: (payload: Filter) => void
    setTransactionList: (payload: Transactions) => void
    setInitialLoading: (payload: boolean) => void
    setStatusOptions: (payload: StatusOption[]) => void
}

const initialState: TransactionListState = {
    filterData: initialFilterData,
    transactionList: [],
    initialLoading: true,
    statusOptions: [],
}

export const useTransactionListStore = create<TransactionListState & TransactionListAction>(
    (set) => ({
        ...initialState,
        setFilterData: (payload) => set(() => ({ filterData: payload })),
        setTransactionList: (payload) => set(() => ({ transactionList: payload })),
        setInitialLoading: (payload) =>
            set(() => ({ initialLoading: payload })),
        setStatusOptions: (payload) => set(() => ({ statusOptions: payload })),
    }),
)
