import type { Customer, InvitationLog } from '../all/types'

const buildLog = (
    id: string,
    event: string,
    description: string,
    timestamp: string,
): InvitationLog => ({
    id,
    event,
    description,
    timestamp,
})

export const invitationsData: Customer[] = [
    {
        id: 'INV-1001',
        name: 'Aarav Sharma',
        email: 'aarav.sharma@example.com',
        status: 'sent',
        managerEmails: ['ops.team@example.com'],
        personalInfo: {
            address: '12 MG Road',
            country: 'India',
            state: 'Maharashtra',
            city: 'Pune',
            pinCode: '411001',
        },
        logs: [
            buildLog(
                'LOG-1001-1',
                'Invitation Created',
                'You created and queued invitation email.',
                '2026-02-28T10:15:00.000Z',
            ),
            buildLog(
                'LOG-1001-2',
                'Email Sent',
                'Invitation mail successfully sent to candidate.',
                '2026-02-28T10:16:00.000Z',
            ),
        ],
    },
    {
        id: 'INV-1002',
        name: 'Priya Verma',
        email: 'priya.verma@example.com',
        status: 'viewed',
        managerEmails: ['hiring.lead@example.com', 'ta.manager@example.com'],
        personalInfo: {
            address: '77 Lake View',
            country: 'India',
            state: 'Karnataka',
            city: 'Bengaluru',
            pinCode: '560001',
        },
        logs: [
            buildLog(
                'LOG-1002-1',
                'Invitation Created',
                'You created and queued invitation email.',
                '2026-02-27T07:20:00.000Z',
            ),
            buildLog(
                'LOG-1002-2',
                'Email Sent',
                'Invitation mail successfully sent to candidate.',
                '2026-02-27T07:21:00.000Z',
            ),
            buildLog(
                'LOG-1002-3',
                'Candidate Opened Email',
                'Candidate opened invitation email.',
                '2026-02-27T08:02:00.000Z',
            ),
            buildLog(
                'LOG-1002-4',
                'Candidate Clicked Form Link',
                'Candidate clicked invitation form URL.',
                '2026-02-27T08:05:00.000Z',
            ),
            buildLog(
                'LOG-1002-5',
                'Candidate Started Form',
                'Candidate started filling invitation form.',
                '2026-02-27T08:08:00.000Z',
            ),
        ],
    },
    {
        id: 'INV-1003',
        name: 'Rohan Mehta',
        email: 'rohan.mehta@example.com',
        status: 'expired',
        managerEmails: ['ta.team@example.com'],
        personalInfo: {
            address: '4 Civil Lines',
            country: 'India',
            state: 'Delhi',
            city: 'New Delhi',
            pinCode: '110054',
        },
        logs: [
            buildLog(
                'LOG-1003-1',
                'Invitation Created',
                'You created and queued invitation email.',
                '2026-02-22T06:00:00.000Z',
            ),
            buildLog(
                'LOG-1003-2',
                'Email Sent',
                'Invitation mail successfully sent to candidate.',
                '2026-02-22T06:01:00.000Z',
            ),
            buildLog(
                'LOG-1003-3',
                'Invitation Expired',
                'Invitation expired before completion.',
                '2026-03-01T00:00:00.000Z',
            ),
        ],
    },
    {
        id: 'INV-1004',
        name: 'Neha Singh',
        email: 'neha.singh@example.com',
        status: 'sent',
        managerEmails: ['eng.manager@example.com'],
        personalInfo: {
            address: '15 Park Street',
            country: 'India',
            state: 'West Bengal',
            city: 'Kolkata',
            pinCode: '700016',
        },
        logs: [
            buildLog(
                'LOG-1004-1',
                'Invitation Created',
                'You created and queued invitation email.',
                '2026-03-01T09:30:00.000Z',
            ),
            buildLog(
                'LOG-1004-2',
                'Email Sent',
                'Invitation mail successfully sent to candidate.',
                '2026-03-01T09:31:00.000Z',
            ),
        ],
    },
    {
        id: 'INV-1005',
        name: 'Karan Patel',
        email: 'karan.patel@example.com',
        status: 'viewed',
        managerEmails: ['hr.ops@example.com'],
        personalInfo: {
            address: '3 Riverfront Ave',
            country: 'India',
            state: 'Gujarat',
            city: 'Ahmedabad',
            pinCode: '380001',
        },
        logs: [
            buildLog(
                'LOG-1005-1',
                'Invitation Created',
                'You created and queued invitation email.',
                '2026-02-26T12:00:00.000Z',
            ),
            buildLog(
                'LOG-1005-2',
                'Email Sent',
                'Invitation mail successfully sent to candidate.',
                '2026-02-26T12:01:00.000Z',
            ),
            buildLog(
                'LOG-1005-3',
                'Candidate Opened Email',
                'Candidate opened invitation email.',
                '2026-02-26T12:40:00.000Z',
            ),
            buildLog(
                'LOG-1005-4',
                'Candidate Clicked Form Link',
                'Candidate clicked invitation form URL.',
                '2026-02-26T12:45:00.000Z',
            ),
        ],
    },
]

export const getInvitationById = (id: string) =>
    invitationsData.find((item) => item.id === id)
