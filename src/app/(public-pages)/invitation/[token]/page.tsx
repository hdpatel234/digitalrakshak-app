import SpaceSignBoard from '@/assets/svg/SpaceSignBoard'

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

    return (
        <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-8">
            <h3 className="mb-1">Invitation Form</h3>
            <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
                Dummy form for invitation token:
                <span className="ml-1 break-all font-medium text-gray-800 dark:text-gray-100">
                    {token}
                </span>
            </p>

            <form className="space-y-5">
                <div>
                    <label
                        htmlFor="candidateName"
                        className="mb-2 block text-sm font-medium"
                    >
                        Candidate Name
                    </label>
                    <input
                        id="candidateName"
                        name="candidateName"
                        type="text"
                        placeholder="Enter candidate name"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-primary dark:border-gray-600 dark:bg-gray-800"
                    />
                </div>

                <div>
                    <label
                        htmlFor="candidateEmail"
                        className="mb-2 block text-sm font-medium"
                    >
                        Email
                    </label>
                    <input
                        id="candidateEmail"
                        name="candidateEmail"
                        type="email"
                        placeholder="Enter email address"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-primary dark:border-gray-600 dark:bg-gray-800"
                    />
                </div>

                <div>
                    <label
                        htmlFor="profileUpload"
                        className="mb-2 block text-sm font-medium"
                    >
                        Upload Profile
                    </label>
                    <input
                        id="profileUpload"
                        name="profileUpload"
                        type="file"
                        accept="image/*,.pdf"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-white hover:file:opacity-90 dark:border-gray-600 dark:bg-gray-800"
                    />
                </div>

                <button
                    type="button"
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                >
                    Submit
                </button>
            </form>
        </div>
    )
}

export default Page
