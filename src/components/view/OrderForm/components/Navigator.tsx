'use client'

import Steps from '@/components/ui/Steps'
import { TbPackage, TbUserSquare, TbCreditCard } from 'react-icons/tb'

const navigationList = [
    {
        label: 'Select package',
        description: 'Add package to your order.',
        icon: <TbPackage strokeWidth={1.5} />,
    },
    {
        label: 'Candidate details',
        description:
            'Select the candidate that you are ordering for.',
        icon: <TbUserSquare strokeWidth={1.5} />,
    },
    {
        label: 'Payment',
        description:
            'Enter payment method and details to complete the order.',
        icon: <TbCreditCard strokeWidth={1.5} />,
    },
]

const Navigator = () => {
    return (
        <div className="p-4">
            <Steps>
                {navigationList.map((nav) => (
                    <Steps.Item
                        key={nav.label}
                        customIcon={nav.icon}
                        title={
                            <div className="flex flex-col ml-2">
                                <span className="heading-text font-semibold text-sm">
                                    {nav.label}
                                </span>
                                <span className="text-xs text-gray-500 font-normal mt-1 hidden sm:block">
                                    {nav.description}
                                </span>
                            </div>
                        }
                    />
                ))}
            </Steps>
        </div>
    )
}

export default Navigator
