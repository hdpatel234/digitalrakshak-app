'use client'

import { useEffect } from 'react'
import { useInvitationListStore } from '../_store/invitationListStore'
import type { InvitationsListData } from '../types'
import type { CommonProps } from '@/@types/common'

interface InvitationListProviderProps extends CommonProps {
    params: Record<string, string | string[] | undefined>
}

const InvitationListProvider = ({
    params,
    children,
}: InvitationListProviderProps) => {
    const setInvitationList = useInvitationListStore(
        (state) => state.setInvitationList,
    )
    const setFilterData = useInvitationListStore((state) => state.setFilterData)
    const setPagination = useInvitationListStore((state) => state.setPagination)
    const setSorting = useInvitationListStore((state) => state.setSorting)
    const setSelectAllInvitations = useInvitationListStore(
        (state) => state.setSelectAllInvitations,
    )

    const setInitialLoading = useInvitationListStore(
        (state) => state.setInitialLoading,
    )

    useEffect(() => {
        let isCancelled = false

        const loadInvitations = async () => {
            setInitialLoading(true)
            try {
                const search = new URLSearchParams()
                Object.entries(params).forEach(([key, value]) => {
                    if (Array.isArray(value)) {
                        if (value[0]) {
                            search.set(key, value[0])
                        }
                        return
                    }

                    if (typeof value === 'string' && value.trim().length > 0) {
                        search.set(key, value)
                    }
                })

                const response = await fetch(
                    `/api/client/invitations?${search.toString()}`,
                    {
                        method: 'GET',
                        cache: 'no-store',
                    },
                )
                const payload = (await response.json()) as {
                    status?: boolean
                    data?: InvitationsListData
                }

                if (isCancelled) {
                    return
                }

                const data = payload?.data
                setInvitationList(Array.isArray(data?.list) ? data.list : [])
                setSelectAllInvitations([])

                if (data?.pagination) {
                    setPagination(data.pagination)
                }

                if (data?.filters) {
                    setFilterData({
                        search: data.filters.search || '',
                        status:
                            data.filters.status === null
                                ? ''
                                : String(data.filters.status || ''),
                        date_from: data.filters.date_from || '',
                        date_to: data.filters.date_to || '',
                        candidate_id:
                            data.filters.candidate_id === null
                                ? ''
                                : String(data.filters.candidate_id || ''),
                        package_id:
                            data.filters.package_id === null
                                ? ''
                                : String(data.filters.package_id || ''),
                        invitation_type: data.filters.invitation_type || '',
                        invited_by:
                            data.filters.invited_by === null
                                ? ''
                                : String(data.filters.invited_by || ''),
                    })
                }

                if (data?.sorting) {
                    setSorting({
                        sort_by: data.sorting.sort_by || 'candidate_invitations.created_at',
                        sort_direction:
                            data.sorting.sort_direction === 'asc' ? 'asc' : 'desc',
                    })
                }
            } catch {
                if (!isCancelled) {
                    setInvitationList([])
                }
            } finally {
                if (!isCancelled) {
                    setInitialLoading(false)
                }
            }
        }

        loadInvitations()

        return () => {
            isCancelled = true
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params])

    return <>{children}</>
}

export default InvitationListProvider

