import { createSlice } from '@reduxjs/toolkit'

//temporary type for professional project
type ProfesionalProject = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  projectUrl: string;
  technologies: string[];
}

type ProfesionalProjectState = {
  value: ProfesionalProject[];
}

const initialState: ProfesionalProjectState = {
  value: [] as ProfesionalProject[],
}

const professionalProjectsSlice = createSlice({
  name: 'professionalProjects',
  initialState,
  reducers: {
    getProfessionalProjects: (state) => {
      console.log("state: ", state)
      
      // get professional projects from azure functions

    },
  },
})

export const { getProfessionalProjects } = professionalProjectsSlice.actions
export default professionalProjectsSlice.reducer