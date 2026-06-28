import { ReactNode } from 'react'

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="flex flex-auto flex-col h-[100vh]">
            {children}
        </div>
    )
}

export default Layout
