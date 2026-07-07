import type { ProfessionalProject } from '../professionalProjectsApi.ts'
import styles from './professionalProjects.module.css'

type ProjectListItemProps = {
  project: ProfessionalProject
  isAdmin: boolean
  onEdit: (project: ProfessionalProject) => void
  onDelete: (project: ProfessionalProject) => void
}

export function ProjectListItem({
  project,
  isAdmin,
  onEdit,
  onDelete,
}: ProjectListItemProps) {
  return (
    <li className={styles.item}>
      <h3>{project.name}</h3>
      {project.description && <p>{project.description}</p>}
      {project.marketingSiteUrl && (
        <a href={project.marketingSiteUrl} target="_blank" rel="noreferrer">
          View marketing site
        </a>
      )}

      {isAdmin && (
        <div className={styles.actions}>
          <button type="button" onClick={() => onEdit(project)}>
            Edit
          </button>
          <button type="button" onClick={() => onDelete(project)}>
            Delete
          </button>
        </div>
      )}
    </li>
  )
}
