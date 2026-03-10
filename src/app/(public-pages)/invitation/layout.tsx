import type { ReactNode } from 'react'

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="min-h-screen w-full bg-gray-50 px-4 py-10 dark:bg-gray-950">
            <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-4xl items-center justify-center">
                {children}
            </div>
        </div>
    )
}

export default Layout
