import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import {
  useAddProfessionalProjectMutation,
  useUpdateProfessionalProjectMutation,
  type ProfessionalProject,
} from '../professionalProjectsApi.ts'

type ProjectFormProps = {
  /** When provided, the form edits this project; otherwise it creates a new one. */
  initial?: ProfessionalProject
  onDone: () => void
}

const EMPTY_PROJECT: ProfessionalProject = {
  name: '',
  description: '',
  developerCommentary: '',
  marketingSiteUrl: '',
  demoUrl: '',
  screenshots: [],
}

export function ProjectForm({ initial, onDone }: ProjectFormProps) {
  const isEditing = initial !== undefined
  const [form, setForm] = useState<ProfessionalProject>(initial ?? EMPTY_PROJECT)

  const [addProject, { isLoading: isAdding }] = useAddProfessionalProjectMutation()
  const [updateProject, { isLoading: isUpdating }] =
    useUpdateProfessionalProjectMutation()
  const isSaving = isAdding || isUpdating

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target
    setForm((prev) =>
      name === 'screenshots'
        ? { ...prev, screenshots: value.split('\n').filter(Boolean) }
        : { ...prev, [name]: value },
    )
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (isEditing && form.id) {
      await updateProject({ id: form.id, project: form }).unwrap()
    } else {
      await addProject(form).unwrap()
    }
    onDone()
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        my: 1.5,
        p: 2,
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: 2,
      }}
    >
      <TextField
        name="name"
        value={form.name ?? ''}
        onChange={handleChange}
        label="Project name"
        required
      />
      <TextField
        name="description"
        value={form.description ?? ''}
        onChange={handleChange}
        label="Description"
        multiline
        rows={3}
      />
      <TextField
        name="developerCommentary"
        value={form.developerCommentary ?? ''}
        onChange={handleChange}
        label="Developer commentary"
        multiline
        rows={3}
      />
      <TextField
        name="marketingSiteUrl"
        type="url"
        value={form.marketingSiteUrl ?? ''}
        onChange={handleChange}
        label="Marketing site URL"
      />
      <TextField
        name="demoUrl"
        type="url"
        value={form.demoUrl ?? ''}
        onChange={handleChange}
        label="Demo URL"
      />
      <TextField
        name="screenshots"
        value={(form.screenshots ?? []).join('\n')}
        onChange={handleChange}
        label="Screenshot URLs (one per line)"
        multiline
        rows={3}
      />
      <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
        <Button type="submit" variant="contained" disabled={isSaving}>
          {isSaving ? 'Saving…' : isEditing ? 'Save' : 'Add project'}
        </Button>
        <Button onClick={onDone} disabled={isSaving}>
          Cancel
        </Button>
      </Stack>
    </Box>
  )
}
