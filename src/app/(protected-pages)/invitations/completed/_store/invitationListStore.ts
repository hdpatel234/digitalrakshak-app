import { create } from 'zustand'
import type {
    Invitation,
    InvitationsFilter,
    InvitationsPagination,
    InvitationsSorting,
} from '../types'

export const initialFilterData = {
    search: '',
    status: '',
    date_from: '',
    date_to: '',
    candidate_id: '',
    package_id: '',
    invitation_type: '',
    invited_by: '',
}

export type InvitationListState = {
    initialLoading: boolean
    invitationList: Invitation[]
    filterData: InvitationsFilter
    pagination: InvitationsPagination
    sorting: InvitationsSorting
    selectedInvitations: Invitation[]
}

type InvitationListAction = {
    setInvitationList: (list: Invitation[]) => void
    setFilterData: (payload: InvitationsFilter) => void
    setPagination: (payload: InvitationsPagination) => void
    setSorting: (payload: InvitationsSorting) => void
    setSelectedInvitation: (checked: boolean, invitation: Invitation) => void
    setSelectAllInvitations: (invitations: Invitation[]) => void
    setInitialLoading: (payload: boolean) => void
}

const initialState: InvitationListState = {
    initialLoading: true,
    invitationList: [],
    filterData: initialFilterData,
    pagination: {
        current_page: 1,
        per_page: 10,
        total: 0,
        last_page: 1,
    },
    sorting: {
        sort_by: 'candidate_invitations.created_at',
        sort_direction: 'desc',
    },
    selectedInvitations: [],
}

export const useInvitationListStore = create<
    InvitationListState & InvitationListAction
>((set) => ({
    ...initialState,
    setFilterData: (payload) => set(() => ({ filterData: payload })),
    setPagination: (payload) => set(() => ({ pagination: payload })),
    setSorting: (payload) => set(() => ({ sorting: payload })),
    setInvitationList: (list) => set(() => ({ invitationList: list })),
    setSelectedInvitation: (checked, invitation) =>
        set((state) => {
            const prevData = state.selectedInvitations
            if (checked) {
                if (prevData.some((item) => item.id === invitation.id)) {
                    return { selectedInvitations: prevData }
                }
                return { selectedInvitations: [...prevData, invitation] }
            }
            return {
                selectedInvitations: prevData.filter(
                    (item) => item.id !== invitation.id,
                ),
            }
        }),
    setSelectAllInvitations: (invitations) =>
        set(() => ({ selectedInvitations: invitations })),
    setInitialLoading: (payload) => set(() => ({ initialLoading: payload })),
}))

