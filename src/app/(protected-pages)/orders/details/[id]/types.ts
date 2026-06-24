export type Order = {
    id: number
    order_number: string
    client_order_number: string | null
    client_id: number
    billing_config_id: number
    invoice_id: number | null
    billing_sync_status: string
    billing_sync_message: string | null
    package_id: number
    order_type: string
    subtotal: string
    discount_amount: string
    tax_amount: string
    tax_percentage: string
    total_amount: string
    payment_status: string
    payment_method: string
    payment_reference: string | null
    payment_due_date: string | null
    invoice_number: string | null
    invoice_generated_at: string | null
    notes: string | null
    internal_notes: string | null
    order_date: string
    processed_at: string | null
    completed_at: string | null
    cancelled_at: string | null
    cancellation_reason: string | null
    status: string
    created_by: number
    updated_by: number
    deleted_by: number | null
    created_at: string
    updated_at: string
    deleted_at: string | null
    total_amount_in_paise: number
}

export type CandidateDetail = {
    id: number
    first_name?: string
    last_name?: string
    email?: string
    phone?: string
    [key: string]: any
}

export type Candidate = {
    id: number
    order_id: number
    candidate_id: number
    subtotal: string
    discount_amount: string
    tax_amount: string
    total_amount: string
    status: string
    candidate: CandidateDetail | null
    candidate_data: any
    candaite_details?: CandidateDetail | null
    candidate_details?: CandidateDetail | null
}

export type PaymentMethod = {
    id: number
    method_name: string
    method_code: string
    category: string
    icon: string
    description: string | null
    display_order: number
}

export type PaymentGateway = {
    gateway_config_id: number
    gateway_id: number
    config_name: string
    environment: string
    base_url: string | null
    enabled_methods: string
    currencies: string
    min_amount: string | null
    max_amount: string | null
    transaction_fee_type: string
    transaction_fee_fixed: string
    transaction_fee_percentage: string
    is_active: number
    is_default: number
    is_sandbox: number
    gateway: {
        id: number
        gateway_name: string
        gateway_code: string
        provider_company: string
        logo: string
        website: string
        supported_methods: string
        is_active: number
        display_order: number
    }
}

export type Transaction = {
    id: number
    transaction_uuid: string
    client_id: number
    order_id: number
    invoice_id: number | null
    gateway_config_id: number
    client_gateway_id: number | null
    method_type_id: number
    amount: string
    currency: string
    tax_amount: string
    fee_amount: string
    net_amount: string
    gateway_transaction_id: string | null
    gateway_order_id: string | null
    gateway_payment_id: string | null
    bank_reference: string | null
    payment_method: string | null
    payment_details: string | null
    status: string
    payment_status: string
    initiated_at: string
    authorized_at: string | null
    captured_at: string | null
    success_at: string | null
    failed_at: string | null
    refunded_at: string | null
    gateway_request: string | null
    gateway_response: string | null
    gateway_webhook: string | null
    error_code: string | null
    error_message: string | null
    refund_amount: string
    refund_reason: string | null
    refund_transaction_id: string | null
    ip_address: string
    user_agent: string
    customer_name: string | null
    customer_email: string | null
    customer_phone: string | null
    created_by: number
    updated_by: number
    created_at: string
    updated_at: string
    deleted_at: string | null
}

export type ClientOrderDetailResponse = {
    order: Order
    candidates: Candidate[]
    payment_method: PaymentMethod | null
    payment_gateway: PaymentGateway | null
    transactions: Transaction[]
}
