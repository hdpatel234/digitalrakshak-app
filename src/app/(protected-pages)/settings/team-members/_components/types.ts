export type TeamMember = {
    id: string | number
    client_id: number
    user_type: string
    first_name: string
    last_name: string
    email: string
    email_verified_at: string | null
    phone_code: string | null
    phone: string | number | null
    avatar: string | null
    last_login_at: string | null
    last_login_ip: string | null
    last_login_browser: string | null
    last_login_device: string | null
    last_login_os: string | null
    last_login_provider: string | null
    last_login_provider_id: string | null
    is_active: number
    is_admin: number
    created_at: string | null
    updated_at: string | null
}

export type FilterData = {
    search: string
    status: string
}

export type TeamListData = {
    list: TeamMember[]
    total: number
}
