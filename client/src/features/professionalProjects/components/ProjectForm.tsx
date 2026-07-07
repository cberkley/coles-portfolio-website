import { useState } from 'react'
import {
  useAddProfessionalProjectMutation,
  useUpdateProfessionalProjectMutation,
  type ProfessionalProject,
} from '../professionalProjectsApi.ts'
import styles from './professionalProjects.module.css'

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
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        name="name"
        value={form.name ?? ''}
        onChange={handleChange}
        placeholder="Project name *"
        required
      />
      <textarea
        name="description"
        value={form.description ?? ''}
        onChange={handleChange}
        placeholder="Description"
        rows={3}
      />
      <textarea
        name="developerCommentary"
        value={form.developerCommentary ?? ''}
        onChange={handleChange}
        placeholder="Developer commentary"
        rows={3}
      />
      <input
        name="marketingSiteUrl"
        type="url"
        value={form.marketingSiteUrl ?? ''}
        onChange={handleChange}
        placeholder="Marketing site URL"
      />
      <input
        name="demoUrl"
        type="url"
        value={form.demoUrl ?? ''}
        onChange={handleChange}
        placeholder="Demo URL"
      />
      <textarea
        name="screenshots"
        value={(form.screenshots ?? []).join('\n')}
        onChange={handleChange}
        placeholder="Screenshot URLs (one per line)"
        rows={3}
      />
      <div className={styles.formActions}>
        <button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving…' : isEditing ? 'Save' : 'Add project'}
        </button>
        <button type="button" onClick={onDone} disabled={isSaving}>
          Cancel
        </button>
      </div>
    </form>
  )
}
