'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { TbCloudDownload, TbPlus } from 'react-icons/tb'
import { FaFileCsv, FaFileExcel } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

const exportOptions = [
    { 
        value: 'csv', 
        label: 'CSV',
        icon: <FaFileCsv className="text-4xl text-green-600 mb-2" /> 
    },
    { 
        value: 'xlsx', 
        label: 'Excel',
        icon: <FaFileExcel className="text-4xl text-emerald-700 mb-2" /> 
    },
]

const OrderListActionTools = () => {
    const router = useRouter()
    
    const [exportDialogOpen, setExportDialogOpen] = useState(false)
    const [exportFormat, setExportFormat] = useState<any>(null)
    const [isExporting, setIsExporting] = useState(false)

    const handleExport = async () => {
        if (!exportFormat) return
        setIsExporting(true)
        const format = exportFormat.value
        
        try {
            const response = await fetch(`/api/client/orders/export?format=${format}`, {
                method: 'GET'
            })
            
            if (!response.ok) {
                throw new Error('Export failed')
            }
            
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            
            const contentDisposition = response.headers.get('Content-Disposition')
            let filename = `orders-export-${new Date().toISOString().split('T')[0]}.${format}`
            if (contentDisposition && contentDisposition.includes('filename=')) {
                const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/)
                if (filenameMatch && filenameMatch.length === 2) {
                    filename = filenameMatch[1]
                }
            }
            
            a.download = filename
            document.body.appendChild(a)
            a.click()
            a.remove()
            window.URL.revokeObjectURL(url)
            
            toast.push(
                <Notification title="Success" type="success">
                    Export downloaded successfully.
                </Notification>,
                { placement: 'top-center' }
            )
            setExportDialogOpen(false)
            setExportFormat(null)
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger">
                    Failed to export orders. Please try again.
                </Notification>,
                { placement: 'top-center' }
            )
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <div className="flex flex-col md:flex-row gap-3">
            <Button
                icon={<TbCloudDownload className="text-xl" />}
                className="w-full md:w-auto"
                onClick={() => setExportDialogOpen(true)}
            >
                Export
            </Button>
            <Button
                variant="solid"
                icon={<TbPlus className="text-xl" />}
                onClick={() => router.push('/orders/create')}
            >
                Place Order
            </Button>

            <Dialog
                isOpen={exportDialogOpen}
                onClose={() => setExportDialogOpen(false)}
                onRequestClose={() => setExportDialogOpen(false)}
            >
                <div className="flex flex-col h-full justify-between">
                    <h5 className="mb-4">Export Orders</h5>
                    <div className="max-h-96 overflow-y-auto pb-4">
                        <label className="block mb-4 font-semibold text-gray-700">Select Format</label>
                        <div className="flex gap-4">
                            {exportOptions.map((opt) => (
                                <div
                                    key={opt.value}
                                    onClick={() => setExportFormat(opt)}
                                    className={`cursor-pointer flex-1 border-2 rounded-xl p-6 flex flex-col items-center justify-center transition-all ${
                                        exportFormat?.value === opt.value
                                            ? 'border-indigo-600 bg-indigo-50 shadow-md ring-2 ring-indigo-600 ring-opacity-50'
                                            : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 bg-white shadow-sm'
                                    }`}
                                >
                                    {opt.icon}
                                    <span className={`font-semibold ${exportFormat?.value === opt.value ? 'text-indigo-700' : 'text-gray-700'}`}>
                                        {opt.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="text-right mt-6">
                        <Button
                            className="ltr:mr-2 rtl:ml-2"
                            variant="plain"
                            onClick={() => setExportDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="solid" 
                            disabled={!exportFormat || isExporting}
                            loading={isExporting}
                            onClick={handleExport}
                        >
                            {isExporting ? 'Exporting...' : 'Export'}
                        </Button>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

export default OrderListActionTools
