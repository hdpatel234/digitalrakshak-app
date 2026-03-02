import NoUserFound from '@/assets/svg/NoUserFound'
import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import Timeline from '@/components/ui/Timeline'
import { getInvitationById } from '../../_data/invitationsData'
import { getTranslations } from 'next-intl/server'

const statusColor: Record<string, string> = {
    sent: 'bg-blue-200 dark:bg-blue-200 text-gray-900 dark:text-gray-900',
    viewed: 'bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900',
    expired: 'bg-amber-200 dark:bg-amber-200 text-gray-900 dark:text-gray-900',
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const t = await getTranslations('invitations')
    const params = await props.params
    const invitation = getInvitationById(params.id)

    if (!invitation) {
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <NoUserFound height={280} width={280} />
                <h2 className="mt-4">{t('details.noInvitationFound')}</h2>
            </div>
        )
    }

    return (
        <Container>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <Card className="xl:col-span-1">
                    <h4 className="mb-4">{t('details.title')}</h4>
                    <div className="space-y-2 text-sm">
                        <p>
                            <span className="font-semibold">{t('details.fields.invitationId')}</span>{' '}
                            {invitation.id}
                        </p>
                        <p>
                            <span className="font-semibold">{t('details.fields.candidate')}</span>{' '}
                            {invitation.name}
                        </p>
                        <p>
                            <span className="font-semibold">{t('details.fields.email')}</span>{' '}
                            {invitation.email}
                        </p>
                        <p>
                            <span className="font-semibold">{t('details.fields.address')}</span>{' '}
                            {invitation.personalInfo.address}
                        </p>
                        <p>
                            <span className="font-semibold">{t('details.fields.country')}</span>{' '}
                            {invitation.personalInfo.country}
                        </p>
                        <p>
                            <span className="font-semibold">{t('details.fields.state')}</span>{' '}
                            {invitation.personalInfo.state}
                        </p>
                        <p>
                            <span className="font-semibold">{t('details.fields.city')}</span>{' '}
                            {invitation.personalInfo.city}
                        </p>
                        <p>
                            <span className="font-semibold">{t('details.fields.pinCode')}</span>{' '}
                            {invitation.personalInfo.pinCode}
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">{t('details.fields.status')}</span>
                            <Tag
                                className={
                                    statusColor[invitation.status] ??
                                    'bg-gray-200 text-gray-900'
                                }
                            >
                                <span className="capitalize">
                                    {t(`status.${invitation.status}`)}
                                </span>
                            </Tag>
                        </div>
                        <p>
                            <span className="font-semibold">{t('details.fields.managerEmails')}</span>{' '}
                            {invitation.managerEmails?.length
                                ? invitation.managerEmails.join(', ')
                                : t('common.notAvailable')}
                        </p>
                    </div>
                </Card>

                <Card className="xl:col-span-2">
                    <h4 className="mb-4">{t('details.logs.title')}</h4>
                    <Timeline>
                        {(invitation.logs || []).length === 0 ? (
                            <Timeline.Item>{t('details.logs.noLogs')}</Timeline.Item>
                        ) : (
                            invitation.logs?.map((log) => (
                                <Timeline.Item key={log.id}>
                                    <div className="space-y-1">
                                        <p className="font-semibold">
                                            {log.event}
                                        </p>
                                        <p className="text-sm">
                                            {log.description}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(
                                                log.timestamp,
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                </Timeline.Item>
                            ))
                        )}
                    </Timeline>
                </Card>
            </div>
        </Container>
    )
}
