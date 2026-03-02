'use client'

import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import CustomerListTable from './CustomerListTable'
import CustomerListActionTools from './CustomerListActionTools'
import CustomersListTableTools from './CustomersListTableTools'
import CustomerListSelected from './CustomerListSelected'
import useTranslation from '@/utils/hooks/useTranslation'

function ClientContent({ data, params }: any) {
    const t = useTranslation('candidates')

    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>{t('list.pageTitle')}</h3>
                            <CustomerListActionTools />
                        </div>

                        <CustomersListTableTools />

                        <CustomerListTable
                            customerListTotal={data.total}
                            pageIndex={parseInt(params.pageIndex as string) || 1}
                            pageSize={parseInt(params.pageSize as string) || 10}
                        />
                    </div>
                </AdaptiveCard>
            </Container>

            <CustomerListSelected />
        </>
    )
}

export default ClientContent
