import SpaceSignBoard from '@/assets/svg/SpaceSignBoard'

const Page = () => {
    return (
        <div className="w-full rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center">
                <SpaceSignBoard height={240} width={240} />
                <h3 className="mb-2 mt-6">Access Denied!</h3>
                <p className="text-base">
                    Invitation token is required to open this page.
                </p>
            </div>
        </div>
    )
}

export default Page
