'use client'

import Card from '@/components/ui/Card'
import Tabs from '@/components/ui/Tabs'
import ProfileSection from './ProfileSection'
import BillingSection from './BillingSection'
import ActivitySection from './ActivitySection'
import type { Customer } from '../types'

type CustomerDetailsProps = {
    data: Customer
}

const { TabNav, TabList, TabContent } = Tabs

const CustomerDetails = ({ data }: CustomerDetailsProps) => {
    return (
        <div className="flex flex-col xl:flex-row gap-4">
            <div className="min-w-[330px] 2xl:min-w-[400px]">
                <ProfileSection data={data} />
            </div>
            <Card className="w-full">
                <Tabs defaultValue="invitations">
                    <TabList>
                        <TabNav value="invitations">Invitations</TabNav>
                        <TabNav value="services">Services</TabNav>
                    </TabList>
                    <div className="p-4">
                        <TabContent value="invitations">
                            <div>
                                <h4 className="mb-4">Candidate Invitations</h4>
                                {/* Show invitations data here based on backend payload */}
                                {(data as any).invitations?.length ? (
                                    <ul>
                                        {(data as any).invitations.map((inv: any) => (
                                            <li key={inv.id} className="mb-2 p-3 border rounded">
                                                <p><strong>Status:</strong> {inv.status}</p>
                                                <p><strong>Token:</strong> {inv.token}</p>
                                                <p><strong>Created At:</strong> {inv.created_at}</p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No invitations found.</p>
                                )}
                            </div>
                        </TabContent>
                        <TabContent value="services">
                            <div>
                                <h4 className="mb-4">Candidate Services</h4>
                                {(data as any).candidateServices?.length || (data as any).candidate_services?.length ? (
                                    <ul>
                                        {((data as any).candidateServices || (data as any).candidate_services).map((srv: any) => (
                                            <li key={srv.id} className="mb-2 p-3 border rounded">
                                                <p><strong>Service:</strong> {srv.service?.name || srv.name || 'Unknown'}</p>
                                                <p><strong>Status:</strong> {srv.status}</p>
                                                <p><strong>Processing Status:</strong> {srv.processing_status}</p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No services found.</p>
                                )}
                            </div>
                        </TabContent>
                    </div>
                </Tabs>
            </Card>
        </div>
    )
}

export default CustomerDetails
