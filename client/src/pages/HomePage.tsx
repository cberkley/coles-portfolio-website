import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { userIsAdmin } from '../app/userIsAdmin.ts'
import { ExperienceList } from '../features/workExpierience/components/ExperienceList.tsx'
import { WorkExperienceForm } from '../features/workExpierience/components/WorkExperienceForm.tsx'
import { Reveal } from '../components/Reveal.tsx'
import { ACCENT } from '../theme.ts'

const TECH = [
  'C#',
  'ASP.NET Core',
  'Azure',
  'React',
  'TypeScript',
  'SQL Server',
  'Aurelia',
  'Lit',
]

export function HomePage() {
  const { isAdmin } = userIsAdmin()
  const [isAdding, setIsAdding] = useState(false)

  return (
    <Box>
      {/* Hero */}
      <Reveal component="section" sx={{ mb: 6 }}>
        <Typography
          variant="overline"
          sx={{ color: 'secondary.main', display: 'block', mb: 1.5 }}
        >
          Senior Software Engineer · Indianapolis, IN
        </Typography>

        <Typography
          component="h1"
          sx={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            fontSize: 'clamp(2.75rem, 8vw, 4.75rem)',
            mb: 2,
          }}
        >
          Cole{' '}
          <Box
            component="span"
            sx={{
              backgroundImage: `linear-gradient(120deg, ${ACCENT.from}, ${ACCENT.to})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Berkley
          </Box>
        </Typography>

        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 400, maxWidth: 620, lineHeight: 1.6 }}
        >
          I build web applications end to end — from clean, responsive UIs to the
          APIs and cloud infrastructure behind them. 15+ years across a wide range
          of industries.
        </Typography>

        <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1, mt: 3 }}>
          {TECH.map((tech) => (
            <Chip
              key={tech}
              label={tech}
              size="small"
              variant="outlined"
              sx={{
                borderColor: 'divider',
                fontWeight: 500,
                '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
              }}
            />
          ))}
        </Stack>

        <Typography variant="body2" color="text.disabled" sx={{ mt: 3, lineHeight: 1.7 }}>
          This site runs on <strong>React</strong>, <strong>TypeScript</strong>, and{' '}
          <strong>Vite</strong>, backed by <strong>Azure Functions (.NET)</strong>,{' '}
          <strong>Cosmos DB</strong>, and <strong>Azure Static Web Apps</strong>.
        </Typography>
      </Reveal>

      {/* Experience */}
      <Reveal component="section" delay={120}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography variant="overline" sx={{ color: 'secondary.main' }}>
              Career
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Experience
            </Typography>
          </Box>
          {isAdmin && !isAdding && (
            <Button size="small" onClick={() => setIsAdding(true)}>
              + Add experience
            </Button>
          )}
        </Box>

        {isAdding && <WorkExperienceForm onDone={() => setIsAdding(false)} />}

        <ExperienceList isAdmin={isAdmin} />
      </Reveal>
    </Box>
  )
}