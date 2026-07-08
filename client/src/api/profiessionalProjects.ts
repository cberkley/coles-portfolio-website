import type { components } from './schema'
import { ApiClient } from './apiClient';

export type ProfessionalProject = components['schemas']['professionalProject']

export class ProfessionalProjectApi {
  private readonly client: ReturnType<typeof ApiClient>

  constructor() {
    this.client = ApiClient()
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
