type PersonalInfo = {
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

export type GetInvitationsListResponse = {
    list: Customer[]
    total: number
}

export type Filter = {
    invitationStatus: Array<string>
    country: string
    state: string
    city: string
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

