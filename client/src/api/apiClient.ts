import createClient, { type Middleware } from 'openapi-fetch'
import type { paths } from './schema'

type AuthMe = {
    clientPrincipal?: {
        userId?: string
    } | null
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
            .then((body) => body?.clientPrincipal?.userId)
            .catch(() => undefined)
            .finally(() => {
                principalIdPromise = undefined
            })
    }

    cachedPrincipalId = await principalIdPromise
    return cachedPrincipalId
}

   
export function ApiClient() {
    const baseUrl = `${import.meta.env.VITE_FUNCTIONS_BASE_URL ?? ''}/api`
    const functionKey = import.meta.env.VITE_FUNCTIONS_KEY as string | undefined

    const client = createClient<paths>({ baseUrl })

    const authMiddleware: Middleware = {
        async onRequest({ request }) {
        if (functionKey) {
            const url = new URL(request.url)
            url.searchParams.set('code', functionKey)
            return new Request(url.toString(), request)
        }
        return request
        },
    }

    const principalMiddleware: Middleware = {
        async onRequest({ request }) {
        const clientPrincipalId = await getClientPrincipalId()
        if (clientPrincipalId) {
            request.headers.set('X-MS-CLIENT-PRINCIPAL-ID', clientPrincipalId)
        }
        return request
        },
    }

    client.use(authMiddleware, principalMiddleware)
    return client;
}
