import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import { Ticket } from './types'
import dayjs from 'dayjs'

interface TicketSidebarProps {
    ticket: Ticket
}

const TicketSidebar = ({ ticket }: TicketSidebarProps) => {
    const getStatusClass = (status: string) => {
        switch (status.toLowerCase()) {
            case 'open':
                return 'bg-emerald-100 dark:bg-emerald-900/30'
            case 'closed':
                return 'bg-red-100 dark:bg-red-900/30'
            case 'resolved':
                return 'bg-blue-100 dark:bg-blue-900/30'
            default:
                return 'bg-gray-100 dark:bg-gray-700'
        }
    }

    const getStatusTextClass = (status: string) => {
        switch (status.toLowerCase()) {
            case 'open':
                return 'text-emerald-700 dark:text-emerald-200'
            case 'closed':
                return 'text-red-700 dark:text-red-200'
            case 'resolved':
                return 'text-blue-700 dark:text-blue-200'
            default:
                return 'text-gray-600 dark:text-gray-200'
        }
    }

    const getPriorityClass = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'high':
                return 'bg-red-100 dark:bg-red-900/30'
            case 'medium':
                return 'bg-amber-100 dark:bg-amber-900/30'
            case 'low':
                return 'bg-blue-100 dark:bg-blue-900/30'
            default:
                return 'bg-gray-100 dark:bg-gray-700'
        }
    }

    const getPriorityTextClass = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'high':
                return 'text-red-700 dark:text-red-200'
            case 'medium':
                return 'text-amber-700 dark:text-amber-200'
            case 'low':
                return 'text-blue-700 dark:text-blue-200'
            default:
                return 'text-gray-600 dark:text-gray-200'
        }
    }

    return (
        <Card className="flex flex-col gap-6">
            <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Ticket Details
                </h4>
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Status</span>
                        <Tag className={getStatusClass(ticket.status)}>
                            <span className={getStatusTextClass(ticket.status)}>
                                {ticket.status.toUpperCase()}
                            </span>
                        </Tag>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Priority</span>
                        <Tag className={getPriorityClass(ticket.priority_name)}>
                            <span className={getPriorityTextClass(ticket.priority_name)}>
                                {ticket.priority_name}
                            </span>
                        </Tag>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Department</span>
                        <Tag><span className="text-sm font-medium">{ticket.department_name}</span></Tag>
                    </div>
                    {ticket.order_number && (
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Order</span>
                            <span className="text-sm font-medium text-primary">
                                {ticket.order_number}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <hr className="border-gray-100 dark:border-gray-800" />

            <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 mt-2">
                    Information
                </h4>
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Ticket ID</span>
                        <span className="text-sm font-mono font-medium">{ticket.ticket_number}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Created At</span>
                        <span className="text-sm font-medium">
                            {ticket.created_at}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Last Updated</span>
                        <span className="text-sm font-medium">
                            {ticket.updated_at}
                        </span>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default TicketSidebar
