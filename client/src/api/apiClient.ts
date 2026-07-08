import createClient, { type Middleware } from 'openapi-fetch'
import type { paths } from './schema'

   
export function ApiClient() {
    const baseUrl = `${import.meta.env.VITE_FUNCTIONS_BASE_URL ?? ''}/api`
    const functionKey = import.meta.env.VITE_FUNCTIONS_KEY as string | undefined
    const clientPrincipalId = import.meta.env.VITE_CLIENT_PRINCIPAL_ID as string | undefined

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
        if (clientPrincipalId) {
            request.headers.set('X-MS-CLIENT-PRINCIPAL-ID', clientPrincipalId)
        }
        return request
        },
    }

    client.use(authMiddleware, principalMiddleware)
    return client;
}
