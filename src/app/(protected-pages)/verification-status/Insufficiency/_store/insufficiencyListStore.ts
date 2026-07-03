import { create } from 'zustand'
import type { Customer, Filter } from '../types'

export const initialFilterData = {
    status: 'insufficiency',
}

export type InsufficiencyListState = {
    initialLoading: boolean
    customerList: Customer[]
    filterData: Filter
    selectedCustomer: Partial<Customer>[]
}

type InsufficiencyListAction = {
    setCustomerList: (customerList: Customer[]) => void
    setFilterData: (payload: Filter) => void
    setSelectedCustomer: (checked: boolean, customer: Customer) => void
    setSelectAllCustomer: (customer: Customer[]) => void
    setInitialLoading: (payload: boolean) => void
}

const initialState: InsufficiencyListState = {
    initialLoading: true,
    customerList: [],
    filterData: initialFilterData,
    selectedCustomer: [],
}

export const useInsufficiencyListStore = create<
    InsufficiencyListState & InsufficiencyListAction
>((set) => ({
    ...initialState,
    setFilterData: (payload) => set(() => ({ filterData: payload })),
    setSelectedCustomer: (checked, row) =>
        set((state) => {
            const prevData = state.selectedCustomer
            if (checked) {
                return { selectedCustomer: [...prevData, ...[row]] }
            } else {
                if (
                    prevData.some((prevCustomer) => row.id === prevCustomer.id)
                ) {
                    return {
                        selectedCustomer: prevData.filter(
                            (prevCustomer) => prevCustomer.id !== row.id,
                        ),
                    }
                }
                return { selectedCustomer: prevData }
            }
        }),
    setSelectAllCustomer: (row) => set(() => ({ selectedCustomer: row })),
    setCustomerList: (customerList) => set(() => ({ customerList })),
    setInitialLoading: (payload) => set(() => ({ initialLoading: payload })),
}))
