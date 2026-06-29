import React, { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import Upload from '@/components/ui/Upload'
import { TbPlus, TbTrash } from 'react-icons/tb'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import Checkbox from '@/components/ui/Checkbox'

type EmploymentVerificationSectionProps = {
    isPrefilling: boolean
    fields: any[]
    formValues: Record<string, any>
    fieldErrors: Record<string, string>
    handleValueChange: (key: string, value: any) => void
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = (error) => reject(error)
    })
}

const EmploymentVerificationSection = ({
    isPrefilling,
    fields,
    formValues,
    fieldErrors,
    handleValueChange,
}: EmploymentVerificationSectionProps) => {
    // We maintain a local list of employers. 
    // The backend stores them natively if we pass an array of strings per field.
    const [employers, setEmployers] = useState<any[]>([{}])
    
    // We use a local state for consent because it's a single checkbox
    const [consent, setConsent] = useState(false)

    // Separate fields based on what they are
    const documentFields = fields.filter(f => f.field_type === 'file')
    const generalFields = fields.filter(f => f.field_type !== 'file' && f.field_name !== 'consent')
    const consentField = fields.find(f => f.field_name === 'consent')

    // On mount or when employers change, sync with formValues
    useEffect(() => {
        generalFields.forEach(field => {
            const values = employers.map(emp => emp[field.field_name] || '')
            handleValueChange(field.field_name, values)
        })
        
        documentFields.forEach(field => {
            const values = employers.map(emp => emp[field.field_name] || '')
            handleValueChange(field.field_name, values)
        })

        if (consentField) {
            handleValueChange(consentField.field_name, consent ? 'Yes' : '')
        }
    }, [employers, consent])

    const handleFieldChange = (index: number, key: string, value: string) => {
        const newEmployers = [...employers]
        newEmployers[index] = { ...newEmployers[index], [key]: value }
        setEmployers(newEmployers)
    }

    const handleUploadChange = async (index: number, key: string, files: File[]) => {
        if (files.length === 0) {
            handleFieldChange(index, key, '')
            return
        }

        try {
            const base64 = await fileToBase64(files[0])
            handleFieldChange(index, key, base64)
        } catch (e) {
            toast.push(<Notification type="danger">Failed to process file</Notification>, { placement: 'top-center' })
        }
    }

    const addEmployer = () => {
        setEmployers([...employers, {}])
    }

    const removeEmployer = (index: number) => {
        const newEmployers = employers.filter((_, i) => i !== index)
        setEmployers(newEmployers)
    }

    return (
        <Card>
            <h4>Employment Verification Details</h4>
            <p className="mt-1 mb-6 text-sm text-gray-500">
                Please provide your employment history starting from the most recent.
            </p>

            <div className="space-y-8">
                {employers.map((employer, index) => (
                    <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg relative">
                        {employers.length > 1 && (
                            <Button
                                size="sm"
                                variant="plain"
                                type="button"
                                className="absolute top-2 right-2 text-rose-500 hover:text-rose-600"
                                icon={<TbTrash />}
                                onClick={() => removeEmployer(index)}
                            >
                                Remove
                            </Button>
                        )}
                        <h5 className="mb-4">Employer #{index + 1}</h5>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {generalFields.map(field => (
                                <FormItem
                                    key={field.id}
                                    label={field.field_label}
                                    htmlFor={`${field.field_name}_${index}`}
                                    asterisk={field.is_required === 1}
                                    invalid={Boolean(fieldErrors[field.field_name]) && !employer[field.field_name] && field.is_required === 1}
                                    errorMessage="Required"
                                >
                                    <Input
                                        id={`${field.field_name}_${index}`}
                                        type={field.field_type === 'date' ? 'date' : 'text'}
                                        value={employer[field.field_name] || ''}
                                        onChange={e => handleFieldChange(index, field.field_name, e.target.value)}
                                        placeholder={field.field_label}
                                        disabled={isPrefilling}
                                    />
                                </FormItem>
                            ))}
                        </div>

                        {documentFields.length > 0 && (
                            <div className="mt-6">
                                <h6 className="mb-3">Documents for Employer #{index + 1}</h6>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {documentFields.map(field => (
                                        <FormItem
                                            key={field.id}
                                            label={field.field_label}
                                            asterisk={field.is_required === 1}
                                        >
                                            <Upload
                                                accept=".pdf,.png,.jpg,.jpeg"
                                                uploadLimit={1}
                                                onChange={(f, files) => handleUploadChange(index, field.field_name, files)}
                                                onFileRemove={() => handleFieldChange(index, field.field_name, '')}
                                            >
                                            </Upload>
                                        </FormItem>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-4 flex justify-center">
                <Button type="button" variant="solid" size="sm" icon={<TbPlus />} onClick={addEmployer}>
                    Add Previous Employer
                </Button>
            </div>

            {consentField && (
                <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <FormItem 
                        invalid={Boolean(fieldErrors[consentField.field_name]) && !consent}
                        errorMessage="Consent is required"
                    >
                        <Checkbox checked={consent} onChange={val => setConsent(val)} className="items-start">
                            <span className="text-sm">I hereby authorize the verification of my employment history and the documents provided.</span>
                        </Checkbox>
                    </FormItem>
                </div>
            )}
        </Card>
    )
}

export default EmploymentVerificationSection
