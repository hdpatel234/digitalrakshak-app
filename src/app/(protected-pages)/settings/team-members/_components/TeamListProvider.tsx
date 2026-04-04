'use client'

import { useRef, useEffect } from 'react'
import { useTeamListStore, initialFilterData } from '../_store/teamListStore'
import type { ReactNode } from 'react'
import type { TeamMember, FilterData } from './types'

type TeamListProviderProps = {
    children: ReactNode
    teamList: TeamMember[]
    filterData?: Partial<FilterData>
}

const TeamListProvider = ({
    children,
    teamList,
    filterData,
}: TeamListProviderProps) => {
    const initialized = useRef(false)

    useEffect(() => {
        if (!initialized.current) {
            useTeamListStore.setState({
                teamList,
                filterData: {
                    ...initialFilterData,
                    ...filterData,
                },
                initialLoading: false,
            })
            initialized.current = true
        }
    }, [teamList, filterData])

    useEffect(() => {
        useTeamListStore.setState({ teamList })
    }, [teamList])

    return <>{children}</>
}

export default TeamListProvider
