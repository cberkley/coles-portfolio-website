import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import counterReducer from '../features/counter/counterSlice.ts'
import { professionalProjectsApi } from '../features/professionalProjects/professionalProjectsApi.ts'
import { workExperienceApi } from '../features/workExpierience/workExperienceApi.ts'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    [professionalProjectsApi.reducerPath]: professionalProjectsApi.reducer,
    [workExperienceApi.reducerPath]: workExperienceApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(professionalProjectsApi.middleware)
      .concat(workExperienceApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch