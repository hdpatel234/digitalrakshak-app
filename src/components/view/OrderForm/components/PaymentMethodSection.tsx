'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Card from '@/components/ui/Card'
import Select, { Option as DefaultOption } from '@/components/ui/Select'
import { FormItem } from '@/components/ui/Form'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { components } from 'react-select'
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
import type { ControlProps, OptionProps } from 'react-select'

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

const { Control } = components

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

const CustomMethodOption = (props: OptionProps<PaymentMethodOption>) => {
    return (
        <DefaultOption<PaymentMethodOption>
            {...props}
            customLabel={(data, label) => {
                const icon = data.icon ? resolveMethodIcon(data.icon) : null
                return (
                    <span className="flex items-center gap-2">
                        {icon ? (
                            <span className="text-gray-700 dark:text-gray-200">
                                {icon}
                            </span>
                        ) : (
                            <span className="h-5 w-5 rounded bg-gray-200 dark:bg-gray-700" />
                        )}
                        <span>{label}</span>
                    </span>
                )
            }}
        />
    )
}

const CustomMethodControl = ({
    children,
    ...props
}: ControlProps<PaymentMethodOption>) => {
    const selected = props.getValue()[0]
    const icon = selected?.icon ? resolveMethodIcon(selected.icon) : null

    return (
        <Control {...props}>
            {icon ? (
                <span className="text-gray-700 dark:text-gray-200 ltr:ml-4 rtl:mr-4">
                    {icon}
                </span>
            ) : (
                <span className="h-5 w-5 rounded bg-gray-200 dark:bg-gray-700 ltr:ml-4 rtl:mr-4" />
            )}
            {children}
        </Control>
    )
}

const CustomGatewayOption = (props: OptionProps<PaymentGatewayOption>) => {
    return (
        <DefaultOption<PaymentGatewayOption>
            {...props}
            customLabel={(data, label) => (
                <span className="flex items-center gap-2">
                    {data.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={data.logo}
                            alt={label}
                            className="h-5 w-5 rounded object-contain"
                        />
                    ) : (
                        <span className="h-5 w-5 rounded bg-gray-200 dark:bg-gray-700" />
                    )}
                    <span>{label}</span>
                </span>
            )}
        />
    )
}

const CustomGatewayControl = ({
    children,
    ...props
}: ControlProps<PaymentGatewayOption>) => {
    const selected = props.getValue()[0]
    return (
        <Control {...props}>
            {selected?.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={selected.logo}
                    alt={selected.label}
                    className="h-5 w-5 rounded object-contain ltr:ml-4 rtl:mr-4"
                />
            ) : (
                <span className="h-5 w-5 rounded bg-gray-200 dark:bg-gray-700 ltr:ml-4 rtl:mr-4" />
            )}
            {children}
        </Control>
    )
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
            const hasExistingSelection = mapped.some(
                (item) => item.value === paymentMethodId,
            )
            setMethodOptions(
                mapped.map((item) => ({
                    label: item.label,
                    value: item.value,
                    icon: item.icon,
                })),
            )
            if (!hasExistingSelection && defaultOption) {
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
    }, [paymentMethodId, setPaymentMethodId])

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
                <Select<PaymentMethodOption>
                    instanceId="payment-method"
                    options={methodOptions}
                    isLoading={methodsLoading}
                    value={selectedMethod}
                    components={{
                        Option: CustomMethodOption,
                        Control: CustomMethodControl,
                    }}
                    placeholder="Select payment method"
                    onChange={(option) => {
                        const nextMethodId = option?.value || ''
                        setPaymentMethodId(nextMethodId)
                        setPaymentProviderId('')
                        setGatewayOptions([])
                    }}
                />
            </FormItem>
            <FormItem
                label="Payment provider"
                invalid={Boolean(validationErrors.paymentProvider)}
                errorMessage={validationErrors.paymentProvider}
            >
                <Select<PaymentGatewayOption>
                    instanceId="payment-provider"
                    options={gatewayOptions}
                    isLoading={gatewaysLoading}
                    isDisabled={!paymentMethodId || methodsLoading}
                    value={selectedGateway}
                    components={{
                        Option: CustomGatewayOption,
                        Control: CustomGatewayControl,
                    }}
                    placeholder={
                        paymentMethodId
                            ? 'Select payment provider'
                            : 'Select payment method first'
                    }
                    onChange={(option) =>
                        setPaymentProviderId(option?.value || '')
                    }
                />
            </FormItem>
        </Card>
    )
}

export default PaymentMethodSection
