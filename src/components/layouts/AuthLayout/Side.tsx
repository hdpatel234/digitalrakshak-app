import { cloneElement } from 'react'
import type { CommonProps } from '@/@types/common'
import SideDesign from './SideDesign'

type SideProps = CommonProps

const Side = ({ children, ...rest }: SideProps) => {
    return (
        <div className="grid lg:grid-cols-[1fr_1fr] h-full bg-white dark:bg-gray-800 lg:p-4">
            {/* Left side - Hero image panel */}
            <SideDesign />

            {/* Right side - Sign in form */}
            <div className="flex flex-col justify-center items-center flex-1 p-6">
                <div className="w-full xl:max-w-[450px] px-8 max-w-[380px]">
                    {children
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        ? cloneElement(children as React.ReactElement<any>, {
                              ...rest,
                          })
                        : null}
                </div>
            </div>
        </div>
    )
}

export default Side
