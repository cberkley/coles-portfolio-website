import type { WorkExperience } from '../workExperienceApi.ts'
import styles from './ExperienceEntryItem.module.css'

type ExperienceEntryItemProps = {
  entry: WorkExperience
  isAdmin: boolean
  onEdit: (entry: WorkExperience) => void
  onDelete: (entry: WorkExperience) => void
}

export function ExperienceEntryItem({
  entry,
  isAdmin,
  onEdit,
  onDelete,
}: ExperienceEntryItemProps) {
  return (
    <li className={styles.entry}>
      <p className={styles.companyName}>
        {entry.company}
        {entry.totalDuration && (
          <span className={styles.companyDuration}>· {entry.totalDuration}</span>
        )}
      </p>

      <div className={styles.roles}>
        {entry.roles?.map((role) => (
          <div key={`${role.title}-${role.period}`} className={styles.role}>
            <p className={styles.roleTitle}>{role.title}</p>
            <p className={styles.roleMeta}>
              {role.period}
              {role.location && ` · ${role.location}`}
            </p>
            {role.bullets && (
              <ul className={styles.bullets}>
                {role.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {isAdmin && (
        <div className={styles.actions}>
          <button type="button" onClick={() => onEdit(entry)}>
            Edit
          </button>
          <button type="button" onClick={() => onDelete(entry)}>
            Delete
          </button>
        </div>
      )}
    </li>
  )
}
