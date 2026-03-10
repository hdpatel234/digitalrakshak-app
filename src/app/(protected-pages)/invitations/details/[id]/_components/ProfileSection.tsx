'use client'

import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar/Avatar'
import dayjs from 'dayjs'

type CustomerInfoFieldProps = {
    title?: string
    value?: string
}

type ProfileSectionProps = {
    data: Partial<{
        id: string
        img: string
        name: string
        email: string
        lastOnline: number
        personalInfo: {
            location: string
            title: string
            birthday: string
            phoneNumber: string
            facebook: string
            twitter: string
            pinterest: string
            linkedIn: string
        }
    }>
}

const CustomerInfoField = ({ title, value }: CustomerInfoFieldProps) => {
    return (
        <div>
            <span className="font-semibold">{title}</span>
            <p className="heading-text font-bold">{value}</p>
        </div>
    )
}

const ProfileSection = ({ data = {} }: ProfileSectionProps) => {
    return (
        <Card className="w-full">
            <div className="flex flex-col xl:justify-between h-full 2xl:min-w-[360px] mx-auto">
                <div className="flex xl:flex-col items-center gap-4 mt-6">
                    <Avatar size={90} shape="circle" src={data.img} />
                    <h4 className="font-bold">{data.name}</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-y-7 gap-x-4 mt-10">
                    <CustomerInfoField title="Name" value={data.name} />
                    <CustomerInfoField title="Email" value={data.email} />
                    <CustomerInfoField
                        title="Phone"
                        value={data.personalInfo?.phoneNumber}
                    />
                    <CustomerInfoField
                        title="Date of birth"
                        value={data.personalInfo?.birthday}
                    />
                    <CustomerInfoField
                        title="Last Online"
                        value={dayjs
                            .unix(data.lastOnline as number)
                            .format('DD MMM YYYY hh:mm A')}
                    />
                </div>
            </div>
        </Card>
    )
}

export default ProfileSection
