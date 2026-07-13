export const USER_PERMISSIONS = {
    // Dashboard
    DASHBOARD_STATS: 'client.dashboard.stats',
    DASHBOARD_VERIFICATION_TREND: 'client.dashboard.verification_trend',
    DASHBOARD_RECENT_ACTIVITY: 'client.dashboard.recent_activity',
    DASHBOARD_SERVICE_USAGE: 'client.dashboard.service_usage',
    DASHBOARD_ACTIVE_PACKAGES: 'client.dashboard.active_packages',
    DASHBOARD_LATEST_CANDIDATES: 'client.dashboard.latest_candidates',

    // Candidates
    CANDIDATES_LIST: 'client.candidates.list',
    CANDIDATES_CREATE: 'client.candidates.create',
    CANDIDATES_IMPORT: 'client.candidates.import',
    CANDIDATES_VIEW: 'client.candidates.view',
    CANDIDATES_DELETE: 'client.candidates.delete',

    // Invitations
    INVITATIONS_LIST: 'client.invitations.list',
    INVITATIONS_COMPLETED: 'client.invitations.completed',
    INVITATIONS_EXPIRED: 'client.invitations.expired',

    // Orders
    ORDERS_LIST: 'client.orders.list',
    ORDERS_CREATE: 'client.orders.create',

    // Packages
    PACKAGES_LIST: 'client.packages.list',
    PACKAGES_CREATE: 'client.packages.create',

    // Verification
    VERIFICATION_IN_PROGRESS: 'client.verification.in_progress',
    VERIFICATION_COMPLETED: 'client.verification.completed',
    VERIFICATION_INSUFFICIENCY: 'client.verification.insufficiency',

    // Services
    SERVICES_LIST: 'client.services.list',

    // Billing
    BILLING_INVOICES: 'client.billing.invoices',
    BILLING_PAYMENT_HISTORY: 'client.billing.payment_history',

    // Support
    SUPPORT_MY_TICKETS: 'client.support.my_tickets',
    SUPPORT_OPEN_TICKET: 'client.support.open_ticket',

    // Reports
    REPORT_SPENDING_REPORT: 'client.report.spending_report',
    REPORT_ORDER_REPORT: 'client.report.order_report',
    REPORT_VERIFICATION_REPORT: 'client.report.verification_report',
    REPORT_EXPORT_DATA: 'client.report.export_data',

    // Settings
    SETTINGS_TEAM_MEMBERS_LIST: 'client.settings.team_members_list',
    SETTINGS_TEAM_MEMBERS_ADD: 'client.settings.team_members_add',
    SETTINGS_COMPANY_PROFILE: 'client.settings.company_profile',
    SETTINGS_API_KEYS: 'client.settings.api_keys',
    SETTINGS_WEBHOOKS: 'client.settings.webhooks',
} as const

export type UserPermission = typeof USER_PERMISSIONS[keyof typeof USER_PERMISSIONS]

export const PERMISSION_GROUPS = {
    'Dashboard': [
        { label: 'Stats', value: USER_PERMISSIONS.DASHBOARD_STATS },
        { label: 'Verification Trend', value: USER_PERMISSIONS.DASHBOARD_VERIFICATION_TREND },
        { label: 'Recent Activity', value: USER_PERMISSIONS.DASHBOARD_RECENT_ACTIVITY },
        { label: 'Service Usage', value: USER_PERMISSIONS.DASHBOARD_SERVICE_USAGE },
        { label: 'Active Packages', value: USER_PERMISSIONS.DASHBOARD_ACTIVE_PACKAGES },
        { label: 'Latest Candidates', value: USER_PERMISSIONS.DASHBOARD_LATEST_CANDIDATES },
    ],
    'Candidates': [
        { label: 'List', value: USER_PERMISSIONS.CANDIDATES_LIST },
        { label: 'Create', value: USER_PERMISSIONS.CANDIDATES_CREATE },
        { label: 'Import', value: USER_PERMISSIONS.CANDIDATES_IMPORT },
        { label: 'View', value: USER_PERMISSIONS.CANDIDATES_VIEW },
        { label: 'Delete', value: USER_PERMISSIONS.CANDIDATES_DELETE },
    ],
    'Invitations': [
        { label: 'List', value: USER_PERMISSIONS.INVITATIONS_LIST },
        { label: 'Completed', value: USER_PERMISSIONS.INVITATIONS_COMPLETED },
        { label: 'Expired', value: USER_PERMISSIONS.INVITATIONS_EXPIRED },
    ],
    'Orders': [
        { label: 'List', value: USER_PERMISSIONS.ORDERS_LIST },
        { label: 'Create', value: USER_PERMISSIONS.ORDERS_CREATE },
    ],
    'Packages': [
        { label: 'List', value: USER_PERMISSIONS.PACKAGES_LIST },
        { label: 'Create', value: USER_PERMISSIONS.PACKAGES_CREATE },
    ],
    'Verification': [
        { label: 'In Progress', value: USER_PERMISSIONS.VERIFICATION_IN_PROGRESS },
        { label: 'Completed', value: USER_PERMISSIONS.VERIFICATION_COMPLETED },
        { label: 'Insufficiency', value: USER_PERMISSIONS.VERIFICATION_INSUFFICIENCY },
    ],
    'Services': [
        { label: 'List', value: USER_PERMISSIONS.SERVICES_LIST },
    ],
    'Billing': [
        { label: 'Invoices', value: USER_PERMISSIONS.BILLING_INVOICES },
        { label: 'Payment History', value: USER_PERMISSIONS.BILLING_PAYMENT_HISTORY },
    ],
    'Support': [
        { label: 'My Tickets', value: USER_PERMISSIONS.SUPPORT_MY_TICKETS },
        { label: 'Open Ticket', value: USER_PERMISSIONS.SUPPORT_OPEN_TICKET },
    ],
    'Reports': [
        { label: 'Spending Report', value: USER_PERMISSIONS.REPORT_SPENDING_REPORT },
        { label: 'Order Report', value: USER_PERMISSIONS.REPORT_ORDER_REPORT },
        { label: 'Verification Report', value: USER_PERMISSIONS.REPORT_VERIFICATION_REPORT },
        { label: 'Export Data', value: USER_PERMISSIONS.REPORT_EXPORT_DATA },
    ],
    'Settings': [
        { label: 'Team Members List', value: USER_PERMISSIONS.SETTINGS_TEAM_MEMBERS_LIST },
        { label: 'Add Team Member', value: USER_PERMISSIONS.SETTINGS_TEAM_MEMBERS_ADD },
        { label: 'Company Profile', value: USER_PERMISSIONS.SETTINGS_COMPANY_PROFILE },
        { label: 'API Keys', value: USER_PERMISSIONS.SETTINGS_API_KEYS },
        { label: 'Webhooks', value: USER_PERMISSIONS.SETTINGS_WEBHOOKS },
    ],
}
