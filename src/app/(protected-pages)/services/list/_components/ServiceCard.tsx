import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { Product } from '../types'
import * as TbIcons from 'react-icons/tb'

type ServiceCardProps = {
    service: Product
}

const DynamicIcon = ({ iconName, className }: { iconName: string, className?: string }) => {
    const capitalizedName = iconName
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('')

    // @ts-ignore
    const IconComponent = TbIcons[`${capitalizedName}`] || TbIcons[iconName] || TbIcons.TbBox

    return <IconComponent className={className} size={24} />
}

const ServiceCard = ({ service }: ServiceCardProps) => {
    return (
        <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200 border border-gray-200 rounded-xl" bodyClass="p-0">
            <div className="p-5 flex flex-col h-full gap-4">
                <div className="flex justify-between items-start">
                    <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <DynamicIcon iconName={service.icon || 'box'} />
                    </div>
                    {/* <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-1 rounded-full font-medium text-xs flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block"></span>
                        Active
                    </Badge> */}
                </div>

                <div className="flex-grow flex flex-col gap-2">
                    <h4 className="text-lg font-bold text-gray-900 leading-tight">
                        {service.name}
                    </h4>
                    <p className="text-sm text-gray-500 line-clamp-3">
                        {service.description || 'No description provided.'}
                    </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-end justify-between mt-auto">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Amount:
                    </span>
                    <span className="text-lg font-bold text-indigo-600">
                        Rs. {service.price.toFixed(2)}
                    </span>
                </div>
            </div>
        </Card>
    )
}

export default ServiceCard
