import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import {
  useGetProfessionalProjectsQuery,
  useDeleteProfessionalProjectMutation,
  type ProfessionalProject,
} from '../professionalProjectsApi.ts'
import { ProjectForm } from './ProjectForm.tsx'
import { ProjectListItem } from './ProjectListItem.tsx'

type ProjectListProps = {
  isAdmin: boolean
}

export function ProjectList({ isAdmin }: ProjectListProps) {
  const { data: projects, isLoading, isError, error, refetch } =
    useGetProfessionalProjectsQuery()
  const [deleteProject] = useDeleteProfessionalProjectMutation();
  const [editingId, setEditingId] = useState<string | null>(null);

  async function handleDelete(project: ProfessionalProject) {
    const label = project.name ?? 'this project';
    if (project.id && window.confirm(`Delete "${label}"? This cannot be undone.`)) {
      await deleteProject(project.id);
    }
  }

  if (isLoading) {
    return <Typography color="text.secondary">Loading projects…</Typography>
  }

  if (isError) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography color="error" role="alert">
          Failed to load projects: {String(error)}
        </Typography>
        <Button size="small" onClick={() => refetch()}>Retry</Button>
      </Box>
    )
  }

  if (!projects || projects.length === 0) {
    return <Typography color="text.secondary">No professional projects yet.</Typography>
  }

  return (
    <Stack component="ul" spacing={2} sx={{ listStyle: 'none', m: 0, p: 0, mt: 1 }}>
      {projects.map((project, index) =>
        editingId === project.id ? (
          <li key={project.id ?? index}>
            <ProjectForm initial={project} onDone={() => setEditingId(null)} />
          </li>
        ) : (
          <ProjectListItem
            key={project.id ?? project.name ?? index}
            project={project}
            isAdmin={isAdmin}
            onEdit={(p) => setEditingId(p.id ?? null)}
            onDelete={handleDelete}
          />
        ),
      )}
    </Stack>
  )
}
