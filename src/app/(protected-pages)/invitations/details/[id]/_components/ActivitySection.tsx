'use client'
import Card from '@/components/ui/Card'
import dayjs from 'dayjs'
import isEmpty from 'lodash/isEmpty'
import {
    PiEnvelopeSimpleDuotone,
    PiEyeDuotone,
    PiCursorClickDuotone,
    PiNotePencilDuotone,
    PiClockCountdownDuotone,
    PiCheckCircleDuotone,
} from 'react-icons/pi'
import type { InvitationActivityLog } from '../types'

const TimeLineMedia = (props: { type: string }) => {
    const { type } = props

    switch (type) {
        case 'Invitation Created':
            return <PiEnvelopeSimpleDuotone />
        case 'Email Sent':
            return <PiEnvelopeSimpleDuotone />
        case 'Candidate Opened Email':
            return <PiEyeDuotone />
        case 'Candidate Clicked Form Link':
            return <PiCursorClickDuotone />
        case 'Candidate Started Form':
            return <PiNotePencilDuotone />
        case 'Invitation Expired':
            return <PiClockCountdownDuotone />
        case 'Invitation Completed':
            return <PiCheckCircleDuotone />
        default:
            return <PiEnvelopeSimpleDuotone />
    }
}

const TimeLineContent = (props: {
    type: string
    description: string
    name: string
}) => {
    const { type, description, name } = props

    return (
        <div>
            <h6 className="font-bold">{type}</h6>
            <p className="font-semibold">
                {name} {description}
            </p>
        </div>
    )
}

const ActivitySection = ({
    customerName,
    logs = [],
}: {
    customerName: string
    logs?: InvitationActivityLog[]
}) => {
    const groupedLogs = logs.reduce(
        (acc, current) => {
            const groupKey = dayjs(current.timestamp).format('DD MMMM')
            if (!acc[groupKey]) {
                acc[groupKey] = []
            }
            acc[groupKey].push(current)
            return acc
        },
        {} as Record<string, InvitationActivityLog[]>,
    )

    return (
        <>
            {Object.entries(groupedLogs).map(([dayLabel, dayLogs]) => (
                <div key={dayLabel} className="mb-4">
                    <div className="mb-4 font-bold uppercase flex items-center gap-4">
                        <span className="w-[120px] heading-text">{dayLabel}</span>
                        <div className="border-b border-2 border-gray-200 dark:border-gray-600 border-dashed w-full"></div>
                    </div>
                    <div className="flex flex-col gap-4">
                        {isEmpty(dayLogs) ? (
                            <div>No Activities</div>
                        ) : (
                            dayLogs.map((log) => (
                                <div key={log.id} className="flex items-center">
                                    <span className="font-semibold w-[100px]">
                                        {dayjs(log.timestamp).format('h:mm A')}
                                    </span>
                                    <Card
                                        className="max-w-[600px] w-full"
                                        bodyClass="py-3"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="text-primary text-3xl">
                                                <TimeLineMedia type={log.event} />
                                            </div>
                                            <TimeLineContent
                                                name={customerName}
                                                type={log.event}
                                                description={log.description}
                                            />
                                        </div>
                                    </Card>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            ))}
            {isEmpty(logs) && <div>No Activities</div>}
        </>
    )
}

export default ActivitySection
