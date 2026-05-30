import Link from 'next/link'
import Button from '@/components/ui/Button'
import NotFound from '@/components/shared/NotFound'
import getOrderDetails from '@/server/actions/getOrderDetails'
import OrderDetailHeader from './_components/OrderDetailHeader'
import OrderDetailProducts from './_components/OrderDetailProducts'
import OrderDetailPayment from './_components/OrderDetailPayment'
import OrderDetailCustomer from './_components/OrderDetailCustomer'
import OrderDetailsActivities from './_components/OrderDetailsActivities'
import OrderDetailNote from './_components/OrderDetailNote'
import { TbArrowLeft } from 'react-icons/tb'
import type { ClientOrderDetailResponse } from './types'

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params

    const data = (await getOrderDetails(params)) as ClientOrderDetailResponse | null

    if (!data || !data.order) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center">
                <NotFound message="Order details could not be found or retrieved!" />
                <div className="mt-4">
                    <Link href="/orders/list">
                        <Button variant="solid" className="flex items-center gap-2">
                            <TbArrowLeft className="text-lg" /> Back to Orders List
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    const { order, candidates, payment_method, payment_gateway, transactions } = data

    return (
        <div className="flex flex-col gap-6">
            {/* Interactive client header */}
            <OrderDetailHeader
                orderNumber={order.order_number}
                clientOrderNumber={order.client_order_number}
                orderDate={order.order_date}
            />

            {/* Core Layout Grid */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Main Content Area */}
                <div className="gap-6 flex flex-col flex-auto lg:max-w-[calc(100%-344px)] xl:max-w-[calc(100%-444px)]">
                    {/* Candidates Details */}
                    <OrderDetailProducts candidates={candidates || []} />
                    
                    {/* Payment breakdown, Gateways & Transactions Ledgers */}
                    <OrderDetailPayment
                        order={order}
                        paymentMethod={payment_method}
                        paymentGateway={payment_gateway}
                        transactions={transactions || []}
                    />
                    
                    {/* Workflow status tracking timeline */}
                    <OrderDetailsActivities order={order} />
                </div>
                
                {/* Sidebar Details Area */}
                <div className="lg:w-[320px] xl:w-[420px] gap-6 flex flex-col shrink-0">
                    {/* Billing sync & invoicing metadata */}
                    <OrderDetailCustomer order={order} />
                    
                    {/* Customer instructions & Private internal notes */}
                    <OrderDetailNote
                        notes={order.notes}
                        internalNotes={order.internal_notes}
                    />
                </div>
            </div>
        </div>
    )
}
