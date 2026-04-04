'use client'

import Button from '@/components/ui/Button'
import { HiPlusCircle } from 'react-icons/hi'
import Link from 'next/link'

const TicketListActionTools = () => {
    return (
        <div className="flex flex-col md:flex-row gap-3">
            <Link href="/support/open-ticket">
                <Button variant="solid" icon={<HiPlusCircle />}>
                    Open Ticket
                </Button>
            </Link>
        </div>
    )
}

export default TicketListActionTools
