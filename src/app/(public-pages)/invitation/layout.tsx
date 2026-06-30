import type { ReactNode } from 'react'

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-950">
            {children}
        </div>
    )
}

export default Layout
