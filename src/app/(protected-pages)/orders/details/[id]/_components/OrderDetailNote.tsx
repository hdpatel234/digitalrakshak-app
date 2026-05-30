'use client'

import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import { TbNote, TbLock } from 'react-icons/tb'

type OrderDetailNoteProps = {
    notes: string | null
    internalNotes: string | null
}

const OrderDetailNote = ({ notes, internalNotes }: OrderDetailNoteProps) => {
    const hasNotes = !!notes || !!internalNotes

    return (
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
            <h5 className="font-bold mb-4">Order Notes</h5>
            
            {!hasNotes && (
                <div className="text-center py-6 text-gray-400 dark:text-gray-500 text-xs italic flex flex-col items-center justify-center gap-1.5">
                    <TbNote className="text-xl opacity-40" />
                    No custom notes or special instructions provided.
                </div>
            )}

            <div className="flex flex-col gap-4">
                {notes && (
                    <div className="rounded-xl p-4 bg-slate-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800/80">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                            <TbNote className="text-sm" /> Customer Instructions
                        </div>
                        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                            "{notes}"
                        </p>
                    </div>
                )}

                {internalNotes && (
                    <div className="rounded-xl p-4 bg-amber-50/40 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/10">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider">
                                <TbLock className="text-sm" /> Internal Support Notes
                            </div>
                            <Tag className="bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border-none font-bold text-[9px] px-1.5 py-0.5 rounded-md">
                                Staff Only
                            </Tag>
                        </div>
                        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed italic">
                            {internalNotes}
                        </p>
                    </div>
                )}
            </div>
        </Card>
    )
}

export default OrderDetailNote
