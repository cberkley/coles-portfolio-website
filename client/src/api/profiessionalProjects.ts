import createClient, { type Middleware } from 'openapi-fetch'
import type { components, paths } from './schema'

export type ProfessionalProject = components['schemas']['professionalProject']

function buildClient() {
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
  return client
}

export class ProfessionalProjectApi {
  private readonly client: ReturnType<typeof createClient<paths>>

  constructor() {
    this.client = buildClient()
  }

  async getProfessionalProjects(): Promise<ProfessionalProject[]> {
    const { data, error } = await this.client.GET('/professional-projects')
    if (error) throw new Error(`GetProfessionalProjects failed: ${JSON.stringify(error)}`)
    return data ?? []
  }

  async getProfessionalProjectById(id: string): Promise<ProfessionalProject> {
    const { data, error } = await this.client.GET('/professional-projects/{id}', {
      params: { path: { id } },
    })
    if (error) throw new Error(`GetProfessionalProjectById failed: ${JSON.stringify(error)}`)
    return data!
  }

  async addProfessionalProject(project: ProfessionalProject): Promise<ProfessionalProject> {
    const { data, error } = await this.client.POST('/professional-projects', {
      body: project,
    })
    if (error) throw new Error(`AddProfessionalProject failed: ${JSON.stringify(error)}`)
    return data!
  }

  async updateProfessionalProject(id: string, project: ProfessionalProject): Promise<ProfessionalProject> {
    const { data, error } = await this.client.PUT('/professional-projects/{id}', {
      params: { path: { id } },
      body: project,
    })
    if (error) throw new Error(`UpdateProfessionalProject failed: ${JSON.stringify(error)}`)
    return data!
  }

  async deleteProfessionalProject(id: string): Promise<void> {
    const { error } = await this.client.DELETE('/professional-projects/{id}', {
      params: { path: { id } },
    })
    if (error) throw new Error(`DeleteProfessionalProject failed: ${JSON.stringify(error)}`)
  }
}
