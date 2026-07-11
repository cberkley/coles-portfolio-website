import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import {
  useGetWorkExperiencesQuery,
  useDeleteWorkExperienceMutation,
  type WorkExperience,
} from '../workExperienceApi.ts'
import { ExperienceEntryItem } from './ExperienceEntryItem.tsx'
import { WorkExperienceForm } from './WorkExperienceForm.tsx'

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
    return <Typography color="text.secondary">Loading experience…</Typography>
  }

  if (isError) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography color="error" role="alert">
          Failed to load experience: {String(error)}
        </Typography>
        <Button size="small" onClick={() => refetch()}>Retry</Button>
      </Box>
    )
  }

  if (!experiences || experiences.length === 0) {
    return <Typography color="text.secondary">No work experience yet.</Typography>
  }

  return (
    <Box
      component="ul"
      sx={{
        listStyle: 'none',
        m: 0,
        p: 0,
        mt: 1,
        pl: 0,
      }}
    >
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
    </Box>
  )
}
