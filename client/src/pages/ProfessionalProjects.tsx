import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { userIsAdmin } from '../app/userIsAdmin.ts'
import { ProjectForm } from '../features/professionalProjects/components/ProjectForm.tsx'
import { ProjectList } from '../features/professionalProjects/components/ProjectList.tsx'
import { Reveal } from '../components/Reveal.tsx'

export function ProfessionalProjectsPage() {
  const { isAdmin } = userIsAdmin();
  const [isAdding, setIsAdding] = useState(false);

  return (
    <Reveal component="section">
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="overline" sx={{ color: 'secondary.main' }}>
            Selected work
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Professional Projects
          </Typography>
        </Box>
        {isAdmin && !isAdding && (
          <Button size="small" onClick={() => setIsAdding(true)}>
            + Add project
          </Button>
        )}
      </Box>

      {isAdding && <ProjectForm onDone={() => setIsAdding(false)} />}

      <ProjectList isAdmin={isAdmin} />
    </Reveal>
  )
}