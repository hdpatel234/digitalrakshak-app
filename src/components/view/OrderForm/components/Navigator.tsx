'use client'

import Avatar from '@/components/ui/Avatar'
// eslint-disable-next-line import/named
import { Link } from 'react-scroll'
import { TbPackage, TbUserSquare, TbMapPin, TbCreditCard } from 'react-icons/tb'

const navigationList = [
    {
        label: 'Select package',
        description: 'Add package to your order.',
        link: 'selectProducts',
        icon: <TbPackage />,
    },
    {
        label: 'Candidate details',
        description:
            'Select the candidate that you are ordering for.',
        link: 'customerDetails',
        icon: <TbUserSquare />,
    },
    {
        label: 'Payment',
        description:
            'Enter payment method and details to complete the order.',
        link: 'payment',
        icon: <TbCreditCard />,
    },
]

const Navigator = () => {
    return (
        <div className="flex flex-col gap-2">
            {navigationList.map((nav) => (
                <Link
                    key={nav.label}
                    activeClass="bg-gray-100 dark:bg-gray-700 active"
                    className="cursor-pointer p-4 rounded-xl group hover:bg-gray-100 dark:hover:bg-gray-700"
                    to={nav.link}
                    spy={true}
                    smooth={true}
                    duration={500}
                    offset={-80}
                >
                    <span className="flex items-center gap-2">
                        <Avatar
                            icon={nav.icon}
                            className="bg-gray-100 dark:bg-gray-700 group-hover:bg-white group-[.active]:bg-white dark:group-hover:bg-gray-800 dark:group-[.active]:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                        <span className="flex flex-col flex-1">
                            <span className="heading-text font-bold">
                                {nav.label}
                            </span>
                            <span>{nav.description}</span>
                        </span>
                    </span>
                </Link>
            ))}
        </div>
    )
}

export default Navigator
