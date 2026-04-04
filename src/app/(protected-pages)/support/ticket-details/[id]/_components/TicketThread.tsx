import Avatar from '@/components/ui/Avatar'
import Card from '@/components/ui/Card'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Thread, Attachment } from './types'
import {
    HiUser,
    HiChatBubbleLeftEllipsis,
    HiDocumentText,
    HiPhoto,
    HiDocumentArrowDown,
} from 'react-icons/hi2'
import classNames from 'classnames'

dayjs.extend(relativeTime)

interface TicketThreadProps {
    threads: Thread[]
}

const isImage = (filename: string) => {
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(filename)
}

const isPdf = (filename: string) => {
    return /\.pdf$/i.test(filename)
}

const AttachmentItem = ({ attachment }: { attachment: Attachment }) => {
    const fileName = attachment.name
    const isImg = isImage(fileName)
    const isPDF = isPdf(fileName)

    if (isImg) {
        return (
            <a
                href={attachment.path || attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 transition-all hover:ring-2 hover:ring-primary/20"
            >
                <div className="h-32 w-48 overflow-hidden">
                    <img
                        src={attachment.path || attachment.url}
                        alt={fileName}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                    />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-black/40 backdrop-blur-sm p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                    <p className="text-[10px] text-white truncate text-center font-medium">
                        {fileName}
                    </p>
                </div>
            </a>
        )
    }

    return (
        <a
            href={attachment.path || attachment.downloadURL || attachment.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all border border-gray-200 dark:border-gray-600 group h-full"
        >
            <div
                className={classNames(
                    'p-2 rounded-lg shrink-0',
                    isPDF
                        ? 'bg-red-50 text-red-500 dark:bg-red-500/10'
                        : 'bg-blue-50 text-blue-500 dark:bg-blue-500/10',
                )}
            >
                {isPDF ? (
                    <HiDocumentArrowDown className="text-xl" />
                ) : (
                    <HiDocumentText className="text-xl" />
                )}
            </div>
            <div className="flex flex-col overflow-hidden">
                <span className="truncate max-w-[150px] text-xs font-semibold">
                    {fileName}
                </span>
                <span className="text-[10px] text-gray-400 font-normal uppercase">
                    {isPDF ? 'PDF Document' : 'File'}
                </span>
            </div>
        </a>
    )
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
                                    {thread.time_ago}
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
                                    <div className="mt-4 flex flex-wrap gap-3">
                                        {thread.attachments.map((attachment) => (
                                            <AttachmentItem
                                                key={attachment.id}
                                                attachment={attachment}
                                            />
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
