export interface Attachment {
    id: number
    name: string
    url: string
    path: string
    relativePath: string
    iconURL: string
    downloadURL: string
}

export interface Thread {
    id: number
    message: string
    sender_type: 'customer' | 'agent'
    sender_name: string
    sender_email: string
    created_at: string
    time_ago: string
    attachments: Attachment[]
}

export interface Ticket {
    id: number
    ticket_number: string
    subject: string
    description: string
    status: string
    priority_name: string
    department_name: string
    order_number?: string | null
    created_at: string
    updated_at: string
}

export interface TicketResponse {
    status: boolean
    message: string
    data: Ticket
}

export interface ConversationsResponse {
    status: boolean
    message: string
    data: Thread[]
}
