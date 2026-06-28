import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Skeleton from '@/components/ui/Skeleton'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import Button from '@/components/ui/Button'
import { TbTrash, TbPlus, TbSend } from 'react-icons/tb'

export default function Loading() {
    return (
        <div className="flex w-full h-full flex-col justify-between">
            <Container>
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-[240px] hidden lg:block shrink-0">
                        <Card bodyClass="p-3">
                            <div className="flex flex-col gap-1">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <div key={i} className="px-3 py-2.5 rounded-lg flex items-center gap-3">
                                        <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                                        <Skeleton className="h-4 w-3/4" />
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    <div className="gap-4 flex flex-col flex-auto min-w-0">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Card key={i}>
                                <Skeleton className="h-6 w-1/3 mb-6" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-2">
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </Container>

            <BottomStickyBar>
                <Container>
                    <div className="flex flex-col gap-3 px-4 sm:px-8 sm:flex-row sm:items-center sm:justify-between">
                        <span className="hidden sm:block"></span>
                        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                            <Button disabled icon={<TbTrash />} className="w-full sm:w-auto">Discard</Button>
                            <Button disabled variant="solid" icon={<TbPlus />} className="w-full sm:w-auto">Create</Button>
                            <Button disabled variant="solid" icon={<TbSend />} className="w-full sm:w-auto">Create & Send Invite</Button>
                        </div>
                    </div>
                </Container>
            </BottomStickyBar>
        </div>
    )
}
