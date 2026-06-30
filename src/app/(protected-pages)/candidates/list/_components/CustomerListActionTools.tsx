'use client'

import Button from '@/components/ui/Button'
import { TbCloudDownload, TbCloudUpload, TbUserPlus } from 'react-icons/tb'
import { useRouter } from 'next/navigation'
import { useCustomerListStore } from '../_store/customerListStore'
import dynamic from 'next/dynamic'

const CSVLink = dynamic(() =>
    import('react-csv').then((mod) => mod.CSVLink), {
        ssr: false,
    }
)

const CustomerListActionTools = () => {
    const router = useRouter()

    const customerList = useCustomerListStore((state) => state.customerList)

    return (
        <div className="flex flex-col md:flex-row gap-3">
            <Button
                icon={<TbCloudDownload className="text-xl" />}
                className="w-full md:w-auto"
            >
                Export
            </Button>
            <Button
                icon={<TbCloudUpload className="text-xl" />}
                className="w-full md:w-auto"
            >
                Bulk import
            </Button>
            <Button
                variant="solid"
                icon={<TbUserPlus className="text-xl" />}
                onClick={() =>
                    router.push('/candidates/create')
                }
            >
                Add candidate
            </Button>
        </div>
    )
}

export default CustomerListActionTools
