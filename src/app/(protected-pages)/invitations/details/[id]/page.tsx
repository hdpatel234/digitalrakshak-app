import CustomerDetails from './_components/CustomerDetails'
import NoUserFound from '@/assets/svg/NoUserFound'
import { getInvitationById } from '../../_data/invitationsData'
import isEmpty from 'lodash/isEmpty'
import type { Customer } from './types'
import type { Customer as InvitationCustomer } from '../../all/types'

const mapInvitationToCustomerDetails = (
    invitation: InvitationCustomer,
): Customer => {
    const [firstName = '', lastName = ''] = invitation.name.split(' ')

    return {
        id: invitation.id,
        name: invitation.name,
        firstName,
        lastName,
        email: invitation.email,
        img: invitation.img || '',
        role: 'Candidate',
        lastOnline: invitation.logs?.length
            ? Math.floor(
                  new Date(
                      invitation.logs[invitation.logs.length - 1].timestamp,
                  ).getTime() / 1000,
              )
            : Math.floor(Date.now() / 1000),
        status: invitation.status,
        personalInfo: {
            location: `${invitation.personalInfo.city}, ${invitation.personalInfo.state}`,
            title: 'Candidate',
            birthday: '-',
            phoneNumber: '-',
            dialCode: '',
            address: invitation.personalInfo.address,
            postcode: invitation.personalInfo.pinCode,
            city: invitation.personalInfo.city,
            country: invitation.personalInfo.country,
            facebook: '',
            twitter: '',
            pinterest: '',
            linkedIn: '',
        },
        orderHistory: [],
        paymentMethod: [],
        subscription: [],
        totalSpending: 0,
        logs: invitation.logs || [],
    }
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params

    const invitation = getInvitationById(params.id)

    if (isEmpty(invitation)) {
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <NoUserFound height={280} width={280} />
                <h2 className="mt-4">No invitation candidate found!</h2>
            </div>
        )
    }

    const data = mapInvitationToCustomerDetails(invitation)

    return <CustomerDetails data={data} />
}
