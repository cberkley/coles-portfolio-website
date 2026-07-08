import createClient, { type Middleware } from 'openapi-fetch'
import type { components, paths } from './schema'
import { ApiClient } from './apiClient';

export type WorkExperience = components['schemas']['workExperience'];

export class WorkExperienceApi {
  private readonly client: ReturnType<typeof ApiClient>

  constructor() {
    this.client = ApiClient()
  }

  async getWorkExperiences(): Promise<WorkExperience[]> {
    const { data, error } = await this.client.GET('/work-experiences')
    if (error) throw new Error(`GetWorkExperiences failed: ${JSON.stringify(error)}`)
    return data ?? []
  }

  async getWorkExperienceById(id: string): Promise<WorkExperience> {
    const { data, error } = await this.client.GET('/work-experiences/{id}', {
      params: { path: { id } },
    })
    if (error) throw new Error(`GetWorkExperienceById failed: ${JSON.stringify(error)}`)
    return data!
  }

  async addWorkExperience(entry: WorkExperience): Promise<WorkExperience> {
    const { data, error } = await this.client.POST('/work-experiences', { body: entry })
    if (error) throw new Error(`AddWorkExperience failed: ${JSON.stringify(error)}`)
    return data!
  }

  async updateWorkExperience(id: string, entry: WorkExperience): Promise<WorkExperience> {
    const { data, error } = await this.client.PUT('/work-experiences/{id}', {
      params: { path: { id } },
      body: entry,
    })
    if (error) throw new Error(`UpdateWorkExperience failed: ${JSON.stringify(error)}`)
    return data!
  }

  async deleteWorkExperience(id: string): Promise<void> {
    const { error } = await this.client.DELETE('/work-experiences/{id}', {
      params: { path: { id } },
    })
    if (error) throw new Error(`DeleteWorkExperience failed: ${JSON.stringify(error)}`)
  }
}
