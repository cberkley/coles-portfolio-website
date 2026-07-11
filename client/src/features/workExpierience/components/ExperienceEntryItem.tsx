import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { WorkExperience } from '../workExperienceApi.ts'
import { ACCENT } from '../../../theme.ts'

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
    <Box
      component="li"
      sx={{
        position: 'relative',
        pl: 3.5,
        pb: 4,
        listStyle: 'none',
        '&:last-child': { pb: 0 },
        '&::before': {
          content: '""',
          position: 'absolute',
          left: '1px',
          top: '0.3rem',
          width: 12,
          height: 12,
          borderRadius: '50%',
          backgroundImage: `linear-gradient(135deg, ${ACCENT.from}, ${ACCENT.to})`,
          zIndex: 1,
          border: '3px solid',
          borderColor: 'background.default',
          boxShadow: `0 0 0 3px ${ACCENT.from}22`,
        },
        // Connector segment from this dot down to the next item's dot.
        // Omitted on the last item so the line stops at the final dot.
        '&:not(:last-child)::after': {
          content: '""',
          position: 'absolute',
          left: '6px',
          top: 'calc(0.3rem + 6px)',
          height: '100%',
          width: '2px',
          borderRadius: '2px',
          backgroundImage: `linear-gradient(to bottom, ${ACCENT.from}, ${ACCENT.to})`,
          opacity: 0.5,
        },
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif' }}
        color="text.primary"
        gutterBottom
      >
        {entry.company}
        {entry.totalDuration && (
          <Typography
            component="span"
            variant="body2"
            color="text.secondary"
            sx={{ ml: 1, fontFamily: '"Inter", sans-serif', fontWeight: 400 }}
          >
            · {entry.totalDuration}
          </Typography>
        )}
      </Typography>

      <Stack spacing={1.5}>
        {entry.roles?.map((role) => (
          <Box key={`${role.title}-${role.period}`}>
            <Typography variant="body2" sx={{ fontWeight: 600 }} color="text.primary">
              {role.title}
            </Typography>
            <Typography variant="caption" sx={{ color: 'secondary.main', fontWeight: 600, display: 'block', mb: 0.5 }}>
              {role.period}
              {role.location && ` · ${role.location}`}
            </Typography>
            {role.bullets && (
              <Box
                component="ul"
                sx={{ m: 0, pl: 2.5, '& li': { mb: 0.25 } }}
              >
                {role.bullets.map((bullet) => (
                  <Box component="li" key={bullet}>
                    <Typography variant="body2" color="text.secondary">{bullet}</Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        ))}
      </Stack>

      {isAdmin && (
        <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
          <Button size="small" onClick={() => onEdit(entry)}>Edit</Button>
          <Button size="small" color="error" onClick={() => onDelete(entry)}>Delete</Button>
        </Stack>
      )}
    </Box>
  )
}
