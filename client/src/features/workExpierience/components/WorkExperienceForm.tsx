import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import {
  useAddWorkExperienceMutation,
  useUpdateWorkExperienceMutation,
  type WorkExperience,
} from '../workExperienceApi.ts'

type Role = NonNullable<WorkExperience['roles']>[number]

type WorkExperienceFormProps = {
  /** When provided, the form edits this entry; otherwise it creates a new one. */
  initial?: WorkExperience;
  onDone: () => void;
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
  const isEditing = initial !== undefined;
  const [form, setForm] = useState<WorkExperience>(initial ?? EMPTY_EXPERIENCE);

  const [addExperience, { isLoading: isAdding }] = useAddWorkExperienceMutation();
  const [updateExperience, { isLoading: isUpdating }] = useUpdateWorkExperienceMutation();
  const isSaving = isAdding || isUpdating;

  function handleFieldChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function updateRole(index: number, changes: Partial<Role>) {
    setForm((prev) => {
      const roles = [...(prev.roles ?? [])]
      roles[index] = { ...roles[index], ...changes }
      return { ...prev, roles }
    });
  }

  function addRole() {
    setForm((prev) => ({
      ...prev,
      roles: [...(prev.roles ?? []), { ...EMPTY_ROLE }],
    }));
  }

  function removeRole(index: number) {
    setForm((prev) => ({
      ...prev,
      roles: (prev.roles ?? []).filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (isEditing && form.id) {
      await updateExperience({ id: form.id, entry: form }).unwrap();
    } else {
      await addExperience(form).unwrap();
    }
    onDone();
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
        name="company"
        value={form.company ?? ''}
        onChange={handleFieldChange}
        label="Company"
        required
      />
      <TextField
        name="companyWebsite"
        type="url"
        value={form.companyWebsite ?? ''}
        onChange={handleFieldChange}
        label="Company website"
      />
      <TextField
        name="totalDuration"
        value={form.totalDuration ?? ''}
        onChange={handleFieldChange}
        label="Total duration (e.g. 3 yrs 6 mos)"
      />

      <Typography variant="subtitle2" sx={{ mt: 1 }}>Roles</Typography>

      {(form.roles ?? []).map((role, index) => (
        <Paper key={index} sx={{ p: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }} color="text.secondary">
              Role {index + 1}
            </Typography>
            <Button
              size="small"
              color="error"
              onClick={() => removeRole(index)}
              disabled={(form.roles ?? []).length === 1}
            >
              Remove
            </Button>
          </Box>
          <Stack spacing={1}>
            <TextField
              value={role.title ?? ''}
              onChange={(e) => updateRole(index, { title: e.target.value })}
              label="Title"
              required
            />
            <TextField
              value={role.period ?? ''}
              onChange={(e) => updateRole(index, { period: e.target.value })}
              label="Period (e.g. Jan 2019 – Mar 2020)"
            />
            <TextField
              value={role.location ?? ''}
              onChange={(e) => updateRole(index, { location: e.target.value })}
              label="Location"
            />
            <TextField
              value={(role.bullets ?? []).join('\n')}
              onChange={(e) =>
                updateRole(index, {
                  bullets: e.target.value.split('\n').filter(Boolean),
                })
              }
              label="Bullet points (one per line)"
              multiline
              rows={3}
            />
          </Stack>
        </Paper>
      ))}

      <Button size="small" onClick={addRole} sx={{ alignSelf: 'flex-start' }}>
        + Add role
      </Button>

      <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
        <Button type="submit" variant="contained" disabled={isSaving}>
          {isSaving ? 'Saving…' : isEditing ? 'Save' : 'Add experience'}
        </Button>
        <Button onClick={onDone} disabled={isSaving}>
          Cancel
        </Button>
      </Stack>
    </Box>
  )
}
