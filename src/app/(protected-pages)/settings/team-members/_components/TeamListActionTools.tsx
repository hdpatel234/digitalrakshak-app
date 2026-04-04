'use client'

import Button from '@/components/ui/Button'
import { TbPlus } from 'react-icons/tb'
import { useRouter } from 'next/navigation'

const TeamListActionTools = () => {
    const router = useRouter()

    const onAddMember = () => {
        router.push('/settings/team-members/add')
    }

    return (
        <div className="flex flex-col md:flex-row gap-3">
            <Button
                variant="solid"
                size="sm"
                icon={<TbPlus className="text-xl" />}
                onClick={onAddMember}
            >
                Add new
            </Button>
        </div>
    )
}

export default TeamListActionTools
