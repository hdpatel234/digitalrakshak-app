export type StatusOption = {
    key: string
    name: string
}

export type DepartmentOption = {
    id: number | string
    name: string
}

export type PriorityOption = {
    id: number | string
    name: string
}

export type Ticket = {
    id: string
    ticketNumber: string
    subject: string
    departmentId: string
    departmentName: string
    priorityId: string
    priorityName: string
    status: string
    createdAt: number
}

export type Tickets = Ticket[]

export type Filter = {
    status: string
    department: string
    priority: string
}
