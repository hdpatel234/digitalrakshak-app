export type InvitationType = 'email' | 'whatsapp' | 'sms' | string

export type PersonalInfo = {
    address: string
    country: string
    state: string
    city: string
    pinCode: string
}

export type InvitationLog = {
    id: string
    event: string
    description: string
    timestamp: string
}

export type Customer = {
    id: string
    name: string
    email: string
    img?: string
    status: string
    personalInfo: PersonalInfo
    managerEmails?: string[]
    logs?: InvitationLog[]
}

export type InvitationPackage = {
    id: number
    name: string
    code?: string | null
}

export type InvitationCandidate = {
    id: number
    name: string
    first_name?: string | null
    last_name?: string | null
    email?: string | null
    phone?: string | null
}

export type Invitation = {
    id: number
    invitation_type: InvitationType
    status: string
    invited_at?: string | null
    expires_at?: string | null
    viewed_at?: string | null
    completed_at?: string | null
    reminder_count?: number | null
    candidate_id?: number | null
    candidate?: InvitationCandidate | null
    package_id?: number | null
    package?: InvitationPackage | null
    packages?: InvitationPackage[] | null
    form_data?: {
        package_ids?: number[]
        candidate_id?: number
    } | null
    form_link?: string | null
}

export type InvitationsPagination = {
    current_page: number
    per_page: number
    total: number
    last_page: number
    from?: number | null
    to?: number | null
}

export type InvitationsFilter = {
    search: string
    status: string
    date_from: string
    date_to: string
    candidate_id: string
    package_id: string
    invitation_type: string
    invited_by: string
}

export type InvitationsSorting = {
    sort_by: string
    sort_direction: 'asc' | 'desc'
}

export type InvitationsListData = {
    list: Invitation[]
    pagination: InvitationsPagination
    filters: InvitationsFilter
    sorting: InvitationsSorting
}

