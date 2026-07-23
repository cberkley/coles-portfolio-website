import createClient, { type Middleware } from 'openapi-fetch'
import type { paths } from './schema'

type AuthPrincipal = {
    clientPrincipal?: {
        userId?: string
        claims?: Array<{ typ?: string; val?: string }>
    } | null
}

type AuthMe = AuthPrincipal | AuthPrincipal[]

function extractClientPrincipalId(body: AuthMe | undefined): string | undefined {
    if (!body) {
        return undefined
    }

    const principal = Array.isArray(body)
        ? body.find((entry) => !!entry?.clientPrincipal?.userId || !!entry?.clientPrincipal?.claims?.length)?.clientPrincipal
        : body.clientPrincipal

    if (!principal) {
        return undefined
    }

    if (principal.userId) {
        return principal.userId
    }

    const nameIdentifierClaim = principal.claims?.find((claim) => {
        const type = claim.typ?.toLowerCase()
        return type === 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier' || type === 'sub'
    })

    return nameIdentifierClaim?.val
}

let cachedPrincipalId: string | undefined
let principalIdPromise: Promise<string | undefined> | undefined

async function getClientPrincipalId(): Promise<string | undefined> {
    if (cachedPrincipalId) {
        return cachedPrincipalId
    }

    if (import.meta.env.DEV) {
        const localId = import.meta.env.VITE_CLIENT_PRINCIPAL_ID as string | undefined
        cachedPrincipalId = localId
        return cachedPrincipalId
    }

    if (!principalIdPromise) {
        principalIdPromise = fetch('/.auth/me')
            .then((res) => (res.ok ? res.json() as Promise<AuthMe> : undefined))
            .then((body) => extractClientPrincipalId(body))
            .catch(() => undefined)
            .finally(() => {
                principalIdPromise = undefined
            })
    }

    cachedPrincipalId = await principalIdPromise
    return cachedPrincipalId
}

   
export function ApiClient() {
    const configuredBaseUrl = import.meta.env.VITE_FUNCTIONS_BASE_URL as string | undefined
    let baseUrlPrefix = configuredBaseUrl ?? ''

    // In production, prefer same-origin `/api` so SWA auth headers are reliably present.
    if (!import.meta.env.DEV && configuredBaseUrl) {
        try {
            const targetOrigin = new URL(configuredBaseUrl, window.location.origin).origin
            if (targetOrigin !== window.location.origin) {
                baseUrlPrefix = ''
            }
        } catch {
            baseUrlPrefix = ''
        }
    }

    const baseUrl = `${baseUrlPrefix}/api`
    const functionKey = import.meta.env.VITE_FUNCTIONS_KEY as string | undefined

    const client = createClient<paths>({ baseUrl })

    const authMiddleware: Middleware = {
        async onRequest({ request }) {
        let nextRequest = request

        if (functionKey) {
            const url = new URL(nextRequest.url)
            url.searchParams.set('code', functionKey)
            nextRequest = new Request(url.toString(), nextRequest)
        }

        const clientPrincipalId = await getClientPrincipalId()
        if (clientPrincipalId) {
            nextRequest.headers.set('X-MS-CLIENT-PRINCIPAL-ID', clientPrincipalId)
        }

        return nextRequest
        },
    }

    client.use(authMiddleware)
    return client;
}
