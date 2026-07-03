import { NextResponse } from 'next/server'

export async function GET() {
    return NextResponse.json({
        status: true,
        data: {
            turnaroundSla: [
                {
                    title: 'Aadhaar OTP',
                    time: '1.2 Seconds',
                    description: 'Instantly Resolved'
                },
                {
                    title: 'PAN NSDL Validate',
                    time: '1.5 Seconds',
                    description: 'Instantly Resolved'
                },
                {
                    title: 'Academic Verification',
                    time: '2.5 Hours',
                    description: 'Manual Registrar check'
                },
                {
                    title: 'Criminal Records Court',
                    time: '3.1 Hours',
                    description: 'Judicial DB lookup'
                }
            ]
        }
    })
}
