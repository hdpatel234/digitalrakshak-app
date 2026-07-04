import { headers } from 'next/headers'

/**
 * A global utility for Server Components to fetch from internal Next.js API routes.
 * It automatically uses 127.0.0.1 to bypass Cloudflare protection while preserving
 * original host and cookie headers.
 */
export async function internalServerFetch(
    endpoint: string,
    params?: Record<string, string | string[] | undefined>,
    options: RequestInit = {}
): Promise<Response> {
    const headerStore = await headers()
    const host = headerStore.get('x-forwarded-host') || headerStore.get('host') || ''
    
    if (!host) {
        throw new Error('Host header is missing in internalServerFetch')
    }

    // Use localhost to bypass Cloudflare for internal server-to-server requests
    const internalPort = process.env.PORT || 3030
    const url = new URL(endpoint, `http://127.0.0.1:${internalPort}`)

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (typeof value === 'string' && value.trim()) {
                url.searchParams.set(key, value)
            }
        })
    }

    const cookie = headerStore.get('cookie') || ''
    
    const response = await fetch(url.toString(), {
        ...options,
        headers: {
            ...(cookie ? { cookie } : {}),
            host: host, // Pass original host for internal routing
            ...options.headers,
        },
    })
    
    return response
}
