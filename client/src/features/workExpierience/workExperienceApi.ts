import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { WorkExperienceApi, type WorkExperience } from '../../api/workExperience.ts'

export type { WorkExperience }

const api = new WorkExperienceApi()

const LIST_ID = 'LIST' as const

export const workExperienceApi = createApi({
  reducerPath: 'workExperienceApi',
  baseQuery: fakeBaseQuery<string>(),
  tagTypes: ['WorkExperience'],
  endpoints: (builder) => ({
    getWorkExperiences: builder.query<WorkExperience[], void>({
      queryFn: async () => {
        try {
          return { data: await api.getWorkExperiences() };
        } catch (error) {
          return { error: (error as Error).message };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((e) => ({
                type: 'WorkExperience' as const,
                id: e.id ?? 'UNKNOWN',
              })),
              { type: 'WorkExperience' as const, id: LIST_ID },
            ]
          : [{ type: 'WorkExperience' as const, id: LIST_ID }],
    }),

    getWorkExperienceById: builder.query<WorkExperience, string>({
      queryFn: async (id) => {
        try {
          return { data: await api.getWorkExperienceById(id) };
        } catch (error) {
          return { error: (error as Error).message };
        }
      },
      providesTags: (_result, _error, id) => [{ type: 'WorkExperience', id }],
    }),

    addWorkExperience: builder.mutation<WorkExperience, WorkExperience>({
      queryFn: async (entry) => {
        try {
          return { data: await api.addWorkExperience(entry) };
        } catch (error) {
          return { error: (error as Error).message };
        }
      },
      invalidatesTags: [{ type: 'WorkExperience', id: LIST_ID }],
    }),

    updateWorkExperience: builder.mutation<
      WorkExperience,
      { id: string; entry: WorkExperience }
    >({
      queryFn: async ({ id, entry }) => {
        try {
          return { data: await api.updateWorkExperience(id, entry) };
        } catch (error) {
          return { error: (error as Error).message };
        }
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'WorkExperience', id },
        { type: 'WorkExperience', id: LIST_ID },
      ],
    }),

    deleteWorkExperience: builder.mutation<void, string>({
      queryFn: async (id) => {
        try {
          await api.deleteWorkExperience(id);
          return { data: undefined };
        } catch (error) {
          return { error: (error as Error).message };
        }
      },
      invalidatesTags: (_result, _error, id) => [
        { type: 'WorkExperience', id },
        { type: 'WorkExperience', id: LIST_ID },
      ],
    }),
  }),
})

export const {
  useGetWorkExperiencesQuery,
  useGetWorkExperienceByIdQuery,
  useAddWorkExperienceMutation,
  useUpdateWorkExperienceMutation,
  useDeleteWorkExperienceMutation,
} = workExperienceApi
