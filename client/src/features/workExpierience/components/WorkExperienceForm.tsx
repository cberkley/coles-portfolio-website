import { useState } from 'react'
import {
  useAddWorkExperienceMutation,
  useUpdateWorkExperienceMutation,
  type WorkExperience,
} from '../workExperienceApi.ts'
import styles from './workExperience.module.css'

type Role = NonNullable<WorkExperience['roles']>[number]

type WorkExperienceFormProps = {
  /** When provided, the form edits this entry; otherwise it creates a new one. */
  initial?: WorkExperience
  onDone: () => void
}

const EMPTY_ROLE: Role = {
  title: '',
  period: '',
  location: '',
  bullets: [],
}

const EMPTY_EXPERIENCE: WorkExperience = {
  company: '',
  companyWebsite: '',
  totalDuration: '',
  roles: [{ ...EMPTY_ROLE }],
}

export function WorkExperienceForm({ initial, onDone }: WorkExperienceFormProps) {
  const isEditing = initial !== undefined
  const [form, setForm] = useState<WorkExperience>(initial ?? EMPTY_EXPERIENCE)

  const [addExperience, { isLoading: isAdding }] = useAddWorkExperienceMutation()
  const [updateExperience, { isLoading: isUpdating }] =
    useUpdateWorkExperienceMutation()
  const isSaving = isAdding || isUpdating

  function handleFieldChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function updateRole(index: number, changes: Partial<Role>) {
    setForm((prev) => {
      const roles = [...(prev.roles ?? [])]
      roles[index] = { ...roles[index], ...changes }
      return { ...prev, roles }
    })
  }

  function addRole() {
    setForm((prev) => ({
      ...prev,
      roles: [...(prev.roles ?? []), { ...EMPTY_ROLE }],
    }))
  }

  function removeRole(index: number) {
    setForm((prev) => ({
      ...prev,
      roles: (prev.roles ?? []).filter((_, i) => i !== index),
    }))
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (isEditing && form.id) {
      await updateExperience({ id: form.id, entry: form }).unwrap()
    } else {
      await addExperience(form).unwrap()
    }
    onDone()
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        name="company"
        value={form.company ?? ''}
        onChange={handleFieldChange}
        placeholder="Company *"
        required
      />
      <input
        name="companyWebsite"
        type="url"
        value={form.companyWebsite ?? ''}
        onChange={handleFieldChange}
        placeholder="Company website"
      />
      <input
        name="totalDuration"
        value={form.totalDuration ?? ''}
        onChange={handleFieldChange}
        placeholder="Total duration (e.g. 3 yrs 6 mos)"
      />

      <p className={styles.rolesLabel}>Roles</p>

      {(form.roles ?? []).map((role, index) => (
        <div key={index} className={styles.roleGroup}>
          <div className={styles.roleGroupHeader}>
            <span>Role {index + 1}</span>
            <button
              type="button"
              onClick={() => removeRole(index)}
              disabled={(form.roles ?? []).length === 1}
            >
              Remove
            </button>
          </div>
          <input
            value={role.title ?? ''}
            onChange={(e) => updateRole(index, { title: e.target.value })}
            placeholder="Title *"
            required
          />
          <input
            value={role.period ?? ''}
            onChange={(e) => updateRole(index, { period: e.target.value })}
            placeholder="Period (e.g. Jan 2019 – Mar 2020)"
          />
          <input
            value={role.location ?? ''}
            onChange={(e) => updateRole(index, { location: e.target.value })}
            placeholder="Location"
          />
          <textarea
            value={(role.bullets ?? []).join('\n')}
            onChange={(e) =>
              updateRole(index, {
                bullets: e.target.value.split('\n').filter(Boolean),
              })
            }
            placeholder="Bullet points (one per line)"
            rows={3}
          />
        </div>
      ))}

      <button type="button" onClick={addRole}>
        + Add role
      </button>

      <div className={styles.formActions}>
        <button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving…' : isEditing ? 'Save' : 'Add experience'}
        </button>
        <button type="button" onClick={onDone} disabled={isSaving}>
          Cancel
        </button>
      </div>
    </form>
  )
}
