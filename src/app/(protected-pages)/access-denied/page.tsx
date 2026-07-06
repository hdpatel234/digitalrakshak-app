import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui'
import Container from '@/components/shared/Container'

const Page = () => {
    return (
        <Container className="h-full">
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4">
                <div className="max-w-md w-full text-center space-y-8">
                    {/* <div className="relative w-full aspect-square max-w-[300px] mx-auto">
                        <Image
                            src="/img/others/access_denied.png"
                            alt="Access Denied"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div> */}

                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                            Access Denied
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            You don't have permission to access this page. Please contact your administrator if you believe this is a mistake.
                        </p>
                    </div>

                    <div className="pt-4">
                        <Link href="/dashboard" passHref>
                            <Button variant="solid" className="w-full sm:w-auto">
                                Return to Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default Page
