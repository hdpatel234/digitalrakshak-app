import SpaceSignBoard from '@/assets/svg/SpaceSignBoard'
import InvitationForm from './InvitationForm'

type InvitationPageProps = {
    params: Promise<{
        token: string
    }>
}

const Page = async ({ params }: InvitationPageProps) => {
    const { token } = await params
    const hasToken = Boolean(token?.trim())

    if (!hasToken) {
        return (
            <div className="w-full rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center">
                    <SpaceSignBoard height={280} width={280} />
                    <h3 className="mb-2 mt-6">Access Denied!</h3>
                    <p className="text-base">
                        Invitation token is required to open this page.
                    </p>
                </div>
            </div>
        )
    }

    return <InvitationForm token={token} />
}

export default Page
