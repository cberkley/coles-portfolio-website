import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  ProfessionalProjectApi,
  type ProfessionalProject,
} from '../../api/profiessionalProjects'

const api = new ProfessionalProjectApi()

const LIST_ID = 'LIST' as const

/**
 * RTK Query service for professional projects.
 *
 * Uses `queryFn` to delegate to the existing typed `ProfessionalProjectApi`
 * (openapi-fetch) client so authentication, the function key, and base URL
 * handling stay in one place. RTK Query layers caching, auto-generated hooks,
 * and tag-based invalidation on top.
 */
export const professionalProjectsApi = createApi({
  reducerPath: 'professionalProjectsApi',
  baseQuery: fakeBaseQuery<string>(),
  tagTypes: ['ProfessionalProject'],
  endpoints: (builder) => ({
    getProfessionalProjects: builder.query<ProfessionalProject[], void>({
      queryFn: async () => {
        try {
          return { data: await api.getProfessionalProjects() }
        } catch (error) {
          return { error: (error as Error).message }
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((p) => ({
                type: 'ProfessionalProject' as const,
                id: p.id ?? 'UNKNOWN',
              })),
              { type: 'ProfessionalProject' as const, id: LIST_ID },
            ]
          : [{ type: 'ProfessionalProject' as const, id: LIST_ID }],
    }),

    getProfessionalProjectById: builder.query<ProfessionalProject, string>({
      queryFn: async (id) => {
        try {
          return { data: await api.getProfessionalProjectById(id) }
        } catch (error) {
          return { error: (error as Error).message }
        }
      },
      providesTags: (_result, _error, id) => [
        { type: 'ProfessionalProject', id },
      ],
    }),

    addProfessionalProject: builder.mutation<
      ProfessionalProject,
      ProfessionalProject
    >({
      queryFn: async (project) => {
        try {
          return { data: await api.addProfessionalProject(project) }
        } catch (error) {
          return { error: (error as Error).message }
        }
      },
      invalidatesTags: [{ type: 'ProfessionalProject', id: LIST_ID }],
    }),

    updateProfessionalProject: builder.mutation<
      ProfessionalProject,
      { id: string; project: ProfessionalProject }
    >({
      queryFn: async ({ id, project }) => {
        try {
          return { data: await api.updateProfessionalProject(id, project) }
        } catch (error) {
          return { error: (error as Error).message }
        }
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'ProfessionalProject', id },
        { type: 'ProfessionalProject', id: LIST_ID },
      ],
    }),

    deleteProfessionalProject: builder.mutation<void, string>({
      queryFn: async (id) => {
        try {
          await api.deleteProfessionalProject(id)
          return { data: undefined }
        } catch (error) {
          return { error: (error as Error).message }
        }
      },
      invalidatesTags: (_result, _error, id) => [
        { type: 'ProfessionalProject', id },
        { type: 'ProfessionalProject', id: LIST_ID },
      ],
    }),
  }),
})

export const {
  useGetProfessionalProjectsQuery,
  useGetProfessionalProjectByIdQuery,
  useAddProfessionalProjectMutation,
  useUpdateProfessionalProjectMutation,
  useDeleteProfessionalProjectMutation,
} = professionalProjectsApi
