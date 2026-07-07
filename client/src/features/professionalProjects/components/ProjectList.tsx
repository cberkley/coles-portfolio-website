import { useState } from 'react'
import {
  useGetProfessionalProjectsQuery,
  useDeleteProfessionalProjectMutation,
  type ProfessionalProject,
} from '../professionalProjectsApi.ts'
import { ProjectForm } from './ProjectForm.tsx'
import { ProjectListItem } from './ProjectListItem.tsx'
import styles from './professionalProjects.module.css'

type ProjectListProps = {
  isAdmin: boolean
}

export function ProjectList({ isAdmin }: ProjectListProps) {
  const { data: projects, isLoading, isError, error, refetch } =
    useGetProfessionalProjectsQuery()
  const [deleteProject] = useDeleteProfessionalProjectMutation()
  const [editingId, setEditingId] = useState<string | null>(null)

  async function handleDelete(project: ProfessionalProject) {
    const label = project.name ?? 'this project'
    if (project.id && window.confirm(`Delete "${label}"? This cannot be undone.`)) {
      await deleteProject(project.id)
    }
  }

  if (isLoading) {
    return <p className={styles.status}>Loading projects…</p>
  }

  if (isError) {
    return (
      <p className={styles.error} role="alert">
        Failed to load projects: {String(error)}{' '}
        <button type="button" onClick={() => refetch()}>
          Retry
        </button>
      </p>
    )
  }

  if (!projects || projects.length === 0) {
    return <p className={styles.status}>No professional projects yet.</p>
  }

  return (
    <ul className={styles.list}>
      {projects.map((project, index) =>
        editingId === project.id ? (
          <li key={project.id ?? index} className={styles.item}>
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
    </ul>
  )
}
