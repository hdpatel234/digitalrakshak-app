import { create } from 'zustand'
import type {
    Tickets,
    Filter,
    StatusOption,
    DepartmentOption,
    PriorityOption,
} from '../_components/types'

export const initialFilterData = {
    status: 'all',
    department: 'all',
    priority: 'all',
}

export type TicketListState = {
    filterData: Filter
    ticketList: Tickets
    initialLoading: boolean
    statusOptions: StatusOption[]
    departmentOptions: DepartmentOption[]
    priorityOptions: PriorityOption[]
}

type TicketListAction = {
    setFilterData: (payload: Filter) => void
    setTicketList: (payload: Tickets) => void
    setInitialLoading: (payload: boolean) => void
    setStatusOptions: (payload: StatusOption[]) => void
    setDepartmentOptions: (payload: DepartmentOption[]) => void
    setPriorityOptions: (payload: PriorityOption[]) => void
}

const initialState: TicketListState = {
    filterData: initialFilterData,
    ticketList: [],
    initialLoading: true,
    statusOptions: [],
    departmentOptions: [],
    priorityOptions: [],
}

export const useTicketListStore = create<TicketListState & TicketListAction>(
    (set) => ({
        ...initialState,
        setFilterData: (payload) => set(() => ({ filterData: payload })),
        setTicketList: (payload) => set(() => ({ ticketList: payload })),
        setInitialLoading: (payload) =>
            set(() => ({ initialLoading: payload })),
        setStatusOptions: (payload) => set(() => ({ statusOptions: payload })),
        setDepartmentOptions: (payload) =>
            set(() => ({ departmentOptions: payload })),
        setPriorityOptions: (payload) =>
            set(() => ({ priorityOptions: payload })),
    }),
)
