'use client'

import React, { useEffect, useState, useCallback, useRef } from 'react'
import TicketSidebar from './TicketSidebar'
import TicketThread from './TicketThread'
import TicketReplyForm from './TicketReplyForm'
import TicketThreadSkeleton from './TicketThreadSkeleton'
import Spinner from '@/components/ui/Spinner'
import { Ticket, Thread, TicketResponse, ConversationsResponse } from './types'
import { HiArrowLeft } from 'react-icons/hi2'
import Link from 'next/link'
import Button from '@/components/ui/Button'

interface TicketDetailsMainProps {
    id: string
}

const TicketDetailsMain = ({ id }: TicketDetailsMainProps) => {
    const [ticket, setTicket] = useState<Ticket | null>(null)
    const [threads, setThreads] = useState<Thread[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isThreadsLoading, setIsThreadsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const scrollRef = useRef<HTMLDivElement>(null)
    const hasFetchedThreads = useRef(false)
    const threadsCountRef = useRef(0)

    const scrollToBottom = useCallback(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [])

    const fetchThreads = useCallback(
        async (silent = false) => {
            if (!silent) {
                setIsThreadsLoading(true)
            }
            try {
                const response = await fetch(
                    `/api/client/tickets/${id}/conversations`,
                    { cache: 'no-store' }
                )
                const result: ConversationsResponse = await response.json()

                if (result.status) {
                    setThreads(result.data)

                    // Scroll to bottom only if this is initial load or if we have new messages
                    if (!silent || result.data.length > threadsCountRef.current) {
                        setTimeout(scrollToBottom, 100)
                    }
                    threadsCountRef.current = result.data.length
                }
            } catch (err) {
                console.error('Failed to fetch threads:', err)
            } finally {
                if (!silent) {
                    setIsThreadsLoading(false)
                }
            }
        },
        [id, scrollToBottom],
    )

    const fetchTicket = useCallback(async () => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await fetch(`/api/client/tickets/${id}`, {
                cache: 'no-store',
            })
            const result: TicketResponse = await response.json()

            if (result.status) {
                setTicket(result.data)
            } else {
                setError(result.message || 'Failed to fetch ticket')
            }
        } catch (err) {
            setError('An error occurred while fetching the ticket.')
        } finally {
            setIsLoading(false)
        }
    }, [id])

    useEffect(() => {
        fetchTicket()
    }, [fetchTicket])

    useEffect(() => {
        if (!ticket) return

        if (!hasFetchedThreads.current) {
            hasFetchedThreads.current = true
            fetchThreads()
        }

        // Setup polling every 5 seconds
        const intervalId = setInterval(() => {
            fetchThreads(true)
        }, 5000)

        return () => {
            if (intervalId) {
                clearInterval(intervalId)
            }
        }
    }, [ticket, fetchThreads])

    const handleReplySuccess = () => {
        fetchThreads()
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <Spinner size={40} className="text-primary" />
            </div>
        )
    }

    if (error || !ticket) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center">
                <span className="text-red-500 font-medium">
                    {error || 'Ticket not found.'}
                </span>
                <Link href="/support/my-tickets">
                    <Button variant="solid" icon={<HiArrowLeft />}>
                        Back to My Tickets
                    </Button>
                </Link>
            </div>
        )
    }

    const isClosed = ticket.status.toLowerCase() === 'closed'

    return (
        <div className="flex flex-col gap-6 py-4 lg:h-[calc(100vh-80px)] lg:overflow-hidden">
            {/* Ticket Header Section - Fixed at Top */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm shrink-0">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
                        <span className="font-mono text-primary bg-primary/10 px-3 py-1 rounded-lg text-lg">
                            {ticket.ticket_number}
                        </span>
                        <span>{ticket.subject}</span>
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/support/my-tickets">
                        <Button
                            variant="plain"
                            size="sm"
                            icon={<HiArrowLeft />}
                            className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            Back
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Main Content Area - Scrollable thread and sticky sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:flex-1 lg:overflow-hidden pb-4">
                <div className="lg:col-span-9 flex flex-col lg:h-full lg:overflow-hidden gap-6">
                    {/* The main conversation thread - Internally Scrollable */}
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto pr-2 custom-scrollbar"
                    >
                        <div className="py-4">
                            {isThreadsLoading ? (
                                <TicketThreadSkeleton />
                            ) : (
                                <TicketThread threads={threads} />
                            )}
                        </div>
                    </div>

                    <div className="shrink-0 bg-white dark:bg-gray-900 rounded-t-2xl border-t border-gray-100 dark:border-gray-800 sticky bottom-0 z-10">
                        <TicketReplyForm
                            ticketId={id}
                            onSuccess={handleReplySuccess}
                            isClosed={isClosed}
                        />
                    </div>
                </div>

                <div className="lg:col-span-3 h-auto lg:h-full lg:overflow-y-auto pr-1 custom-scrollbar shrink-0">
                    <div className="lg:sticky lg:top-0 flex flex-col gap-6">
                        <TicketSidebar ticket={ticket} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TicketDetailsMain
