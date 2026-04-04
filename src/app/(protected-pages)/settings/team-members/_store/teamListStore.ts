import { create } from 'zustand'
import type { TeamMember, FilterData } from '../_components/types'

export const initialFilterData: FilterData = {
    search: '',
    status: 'all',
}

export type TeamListState = {
    filterData: FilterData
    teamList: TeamMember[]
    initialLoading: boolean
}

type TeamListAction = {
    setFilterData: (payload: FilterData) => void
    setTeamList: (payload: TeamMember[]) => void
    setInitialLoading: (payload: boolean) => void
}

const initialState: TeamListState = {
    filterData: initialFilterData,
    teamList: [],
    initialLoading: true,
}

export const useTeamListStore = create<TeamListState & TeamListAction>((set) => ({
    ...initialState,
    setFilterData: (payload) => set(() => ({ filterData: payload })),
    setTeamList: (payload) => set(() => ({ teamList: payload })),
    setInitialLoading: (payload) => set(() => ({ initialLoading: payload })),
}))
