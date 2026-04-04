import Avatar from '@/components/ui/Avatar'
import Card from '@/components/ui/Card'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Thread } from './types'
import { HiUser, HiChatBubbleLeftEllipsis } from 'react-icons/hi2'
import classNames from 'classnames'

dayjs.extend(relativeTime)

interface TicketThreadProps {
    threads: Thread[]
}

const TicketThread = ({ threads }: TicketThreadProps) => {
    return (
        <div className="flex flex-col gap-6 ">
            {threads.map((thread) => {
                const isCustomer = thread.sender_type === 'customer'

                return (
                    <div
                        key={thread.id}
                        className={classNames(
                            'flex gap-4 w-full',
                            isCustomer ? 'flex-row-reverse' : 'flex-row',
                        )}
                    >
                        <div className="flex-shrink-0">
                            <Avatar
                                src={undefined}
                                shape="circle"
                                size={40}
                                className={classNames(
                                    'text-xl',
                                    isCustomer
                                        ? 'bg-blue-100 text-blue-600'
                                        : 'bg-emerald-100 text-emerald-600',
                                )}
                                icon={isCustomer ? <HiUser /> : <HiChatBubbleLeftEllipsis />}
                            />
                        </div>
                        <div
                            className={classNames(
                                'flex flex-col max-w-[85%] sm:max-w-[75%]',
                                isCustomer ? 'items-end' : 'items-start',
                            )}
                        >
                            <div
                                className={classNames(
                                    'flex items-center gap-2 mb-1',
                                    isCustomer ? 'flex-row-reverse' : 'flex-row',
                                )}
                            >
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    {thread.sender_name}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {dayjs(thread.created_at).fromNow()}
                                </span>
                            </div>
                            <Card
                                className={classNames(
                                    'border-none shadow-sm',
                                    isCustomer
                                        ? 'bg-blue-50 dark:bg-blue-950/20 rounded-tr-none border border-blue-100 dark:border-blue-900'
                                        : 'bg-white dark:bg-gray-800 rounded-tl-none',
                                )}
                            >
                                <div
                                    className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap break-words leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: thread.message }}
                                />

                                {thread.attachments && thread.attachments.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {thread.attachments.map((attachment) => (
                                            <a
                                                key={attachment.id}
                                                href={attachment.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600"
                                            >
                                                <span>{attachment.name}</span>
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </Card>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default TicketThread
