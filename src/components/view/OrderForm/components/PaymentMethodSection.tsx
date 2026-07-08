'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Card from '@/components/ui/Card'
import { FormItem } from '@/components/ui/Form'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import {
    TbBrandPaypal,
    TbBuildingBank,
    TbCash,
    TbCreditCard,
    TbDeviceMobile,
    TbQrcode,
    TbWallet,
} from 'react-icons/tb'
import { useOrderFormStore } from '../store/orderFormStore'
import type { FormSectionBaseProps } from '../types'

type PaymentMethodSectionProps = FormSectionBaseProps

type ApiResponsePayload = {
    status?: boolean
    success?: boolean
    message?: string
    data?: unknown
}

type PaymentMethodOption = {
    label: string
    value: string
    icon: string
}

type PaymentGatewayOption = {
    label: string
    value: string
    logo: string
}

const normalizeIconName = (value: string) =>
    value
        .toLowerCase()
        .replace(/_/g, '-')
        .replace(/\s+/g, '-')
        .trim()

const resolveMethodIcon = (iconName: string) => {
    const normalized = normalizeIconName(iconName)

    switch (normalized) {
        case 'credit-card':
        case 'debit-card':
        case 'card':
            return <TbCreditCard className="text-lg" />
        case 'bank':
        case 'bank-transfer':
        case 'net-banking':
        case 'netbanking':
            return <TbBuildingBank className="text-lg" />
        case 'wallet':
        case 'mobile-wallet':
            return <TbWallet className="text-lg" />
        case 'paypal':
            return <TbBrandPaypal className="text-lg" />
        case 'upi':
        case 'qrcode':
        case 'qr-code':
            return <TbQrcode className="text-lg" />
        case 'mobile':
        case 'mobile-payment':
            return <TbDeviceMobile className="text-lg" />
        case 'cash':
            return <TbCash className="text-lg" />
        default:
            return null
    }
}

const PaymentMethodSection = ({}: PaymentMethodSectionProps) => {
    const [methodOptions, setMethodOptions] = useState<PaymentMethodOption[]>(
        [],
    )
    const [gatewayOptions, setGatewayOptions] = useState<
        PaymentGatewayOption[]
    >([])
    const [methodsLoading, setMethodsLoading] = useState(false)
    const [gatewaysLoading, setGatewaysLoading] = useState(false)
    const {
        paymentMethodId,
        setPaymentMethodId,
        paymentProviderId,
        setPaymentProviderId,
        prefillPaymentProviderId,
        setPrefillPaymentProviderId,
        validationErrors,
    } = useOrderFormStore()

    const mapApiSuccess = (payload: ApiResponsePayload) =>
        payload.status === true || payload.success === true

    const fetchPaymentMethods = useCallback(async () => {
        setMethodsLoading(true)
        try {
            const response = await fetch('/api/client/billing/payment-methods', {
                method: 'GET',
                cache: 'no-store',
            })
            const payload = ((await response.json()) as ApiResponsePayload) || {}

            if (!response.ok || !mapApiSuccess(payload)) {
                toast.push(
                    <Notification type="danger">
                        {payload.message ||
                            'Failed to fetch payment methods.'}
                    </Notification>,
                    { placement: 'top-center' },
                )
                setMethodOptions([])
                return
            }

            const rawList = Array.isArray(payload.data) ? payload.data : []
            const mapped = rawList
                .map((item) => {
                    const record =
                        item && typeof item === 'object'
                            ? (item as Record<string, unknown>)
                            : {}
                    const methodType =
                        record.method_type &&
                        typeof record.method_type === 'object'
                            ? (record.method_type as Record<string, unknown>)
                            : {}
                    const id = String(
                        record.method_type_id ??
                            methodType.id ??
                            record.client_payment_method_id ??
                            '',
                    ).trim()
                    const label = String(
                        record.display_name ??
                            methodType.method_name ??
                            methodType.method_code ??
                            '',
                    ).trim()
                    const icon = String(
                        record.icon ?? methodType.icon ?? '',
                    ).trim()
                    const isDefault = Number(record.is_default ?? 0) === 1

                    if (!id || !label) {
                        return null
                    }

                    return {
                        label,
                        value: id,
                        icon,
                        isDefault,
                    }
                })
                .filter(
                    (
                        item,
                    ): item is PaymentMethodOption & { isDefault: boolean } =>
                        item !== null,
                )

            const defaultOption = mapped.find((item) => item.isDefault)
            setMethodOptions(
                mapped.map((item) => ({
                    label: item.label,
                    value: item.value,
                    icon: item.icon,
                })),
            )
            if (!paymentMethodId && defaultOption) {
                setPaymentMethodId(defaultOption.value)
            }
        } catch {
            toast.push(
                <Notification type="danger">
                    Failed to fetch payment methods.
                </Notification>,
                { placement: 'top-center' },
            )
            setMethodOptions([])
        } finally {
            setMethodsLoading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setPaymentMethodId])

    const fetchGateways = useCallback(
        async (methodId: string) => {
            if (!methodId) {
                return
            }
            setGatewaysLoading(true)
            try {
                const response = await fetch(
                    `/api/client/billing/${methodId}/payment-gateways`,
                    {
                        method: 'GET',
                        cache: 'no-store',
                    },
                )
                const payload =
                    ((await response.json()) as ApiResponsePayload) || {}

                if (!response.ok || !mapApiSuccess(payload)) {
                    toast.push(
                        <Notification type="danger">
                            {payload.message ||
                                'Failed to fetch payment gateways.'}
                        </Notification>,
                        { placement: 'top-center' },
                    )
                    setGatewayOptions([])
                    return
                }

                const rawList = Array.isArray(payload.data) ? payload.data : []
                const mapped = rawList
                    .map((item) => {
                        const record =
                            item && typeof item === 'object'
                                ? (item as Record<string, unknown>)
                                : {}
                        const gateway =
                            record.gateway &&
                            typeof record.gateway === 'object'
                                ? (record.gateway as Record<string, unknown>)
                                : {}
                        const id = String(
                            record.gateway_config_id ??
                                record.gateway_id ??
                                gateway.id ??
                                record.client_gateway_id ??
                                '',
                        ).trim()
                        const label = String(
                            gateway.gateway_name ??
                                record.display_name ??
                                gateway.gateway_code ??
                                '',
                        ).trim()
                        const logo = String(
                            gateway.logo ?? record.logo ?? '',
                        ).trim()
                        const isDefault = Number(record.is_default ?? 0) === 1

                        if (!id || !label) {
                            return null
                        }

                        return {
                            label,
                            value: id,
                            logo,
                            isDefault,
                        }
                    })
                    .filter(
                        (
                            item,
                        ): item is PaymentGatewayOption & { isDefault: boolean } =>
                            item !== null,
                    )

                const defaultOption = mapped.find((item) => item.isDefault)
                const prefillOption = prefillPaymentProviderId
                    ? mapped.find(
                          (item) =>
                              item.value === prefillPaymentProviderId,
                      )
                    : undefined
                setGatewayOptions(
                    mapped.map((item) => ({
                        label: item.label,
                        value: item.value,
                        logo: item.logo,
                    })),
                )
                if (prefillOption) {
                    setPaymentProviderId(prefillOption.value)
                    setPrefillPaymentProviderId('')
                } else if (defaultOption) {
                    setPaymentProviderId(defaultOption.value)
                }
            } catch {
                toast.push(
                    <Notification type="danger">
                        Failed to fetch payment gateways.
                    </Notification>,
                    { placement: 'top-center' },
                )
                setGatewayOptions([])
            } finally {
                setGatewaysLoading(false)
            }
        },
        [setPaymentProviderId],
    )

    useEffect(() => {
        fetchPaymentMethods()
    }, [fetchPaymentMethods])

    useEffect(() => {
        if (!paymentMethodId) {
            setGatewayOptions([])
            setPaymentProviderId('')
            return
        }

        fetchGateways(paymentMethodId)
    }, [fetchGateways, paymentMethodId, setPaymentProviderId])

    const selectedMethod = useMemo(
        () =>
            methodOptions.find((option) => option.value === paymentMethodId) ||
            null,
        [methodOptions, paymentMethodId],
    )

    const selectedGateway = useMemo(
        () =>
            gatewayOptions.find(
                (option) => option.value === paymentProviderId,
            ) || null,
        [gatewayOptions, paymentProviderId],
    )

    return (
        <Card id="payment">
            <h4 className="mb-6">Payment</h4>
            <FormItem label="Payment method">
                {methodsLoading ? (
                    <div className="py-4 text-gray-500">Loading payment methods...</div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        {methodOptions.map((option) => (
                            <div
                                key={option.value}
                                className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                    paymentMethodId === option.value
                                        ? 'border-primary bg-primary-subtle text-primary ring-2 ring-primary'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md'
                                }`}
                                onClick={() => {
                                    setPaymentMethodId(option.value)
                                    setPaymentProviderId('')
                                    setGatewayOptions([])
                                }}
                            >
                                <span className="text-3xl text-gray-700 dark:text-gray-300">
                                    {resolveMethodIcon(option.icon) || <span className="h-8 w-8 rounded bg-gray-200 dark:bg-gray-700" />}
                                </span>
                                <span className="text-sm font-medium text-center">
                                    {option.label}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </FormItem>
            {paymentMethodId && (
                <FormItem
                    label="Payment provider"
                    invalid={Boolean(validationErrors.paymentProvider)}
                    errorMessage={validationErrors.paymentProvider}
                >
                    {gatewaysLoading ? (
                        <div className="py-4 text-gray-500">Loading payment providers...</div>
                    ) : gatewayOptions.length === 0 ? (
                        <div className="py-4 text-gray-500">No payment providers available.</div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                            {gatewayOptions.map((option) => (
                                <div
                                    key={option.value}
                                    className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                        paymentProviderId === option.value
                                            ? 'border-primary bg-primary-subtle text-primary ring-2 ring-primary'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md'
                                    }`}
                                    onClick={() => setPaymentProviderId(option.value)}
                                >
                                    {option.logo ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={option.logo}
                                            alt={option.label}
                                            className="h-8 w-auto object-contain"
                                        />
                                    ) : (
                                        <span className="h-8 w-8 rounded bg-gray-200 dark:bg-gray-700" />
                                    )}
                                    <span className="text-sm font-medium text-center">
                                        {option.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </FormItem>
            )}
        </Card>
    )
}

export default PaymentMethodSection
