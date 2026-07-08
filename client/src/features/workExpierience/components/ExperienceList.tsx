import { useState } from 'react'
import {
  useGetWorkExperiencesQuery,
  useDeleteWorkExperienceMutation,
  type WorkExperience,
} from '../workExperienceApi.ts'
import { ExperienceEntryItem } from './ExperienceEntryItem.tsx'
import { WorkExperienceForm } from './WorkExperienceForm.tsx'
import styles from './workExperience.module.css'

type ExperienceListProps = {
  isAdmin: boolean
}

export function ExperienceList({ isAdmin }: ExperienceListProps) {
  const { data: experiences, isLoading, isError, error, refetch } =
    useGetWorkExperiencesQuery()
  const [deleteExperience] = useDeleteWorkExperienceMutation()
  const [editingId, setEditingId] = useState<string | null>(null)

  async function handleDelete(entry: WorkExperience) {
    const label = entry.company ?? 'this experience'
    if (entry.id && window.confirm(`Delete "${label}"? This cannot be undone.`)) {
      await deleteExperience(entry.id)
    }
  }

  if (isLoading) {
    return <p className={styles.status}>Loading experience…</p>
  }

  if (isError) {
    return (
      <p className={styles.error} role="alert">
        Failed to load experience: {String(error)}{' '}
        <button type="button" onClick={() => refetch()}>
          Retry
        </button>
      </p>
    )
  }

  if (!experiences || experiences.length === 0) {
    return <p className={styles.status}>No work experience yet.</p>
  }

  return (
    <ul className={styles.timeline}>
      {experiences.map((entry, index) =>
        editingId === entry.id ? (
          <li key={entry.id ?? index}>
            <WorkExperienceForm
              initial={entry}
              onDone={() => setEditingId(null)}
            />
          </li>
        ) : (
          <ExperienceEntryItem
            key={entry.id ?? index}
            entry={entry}
            isAdmin={isAdmin}
            onEdit={(e) => setEditingId(e.id ?? null)}
            onDelete={handleDelete}
          />
        ),
      )}
    </ul>
  )
}
