import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { ProfessionalProject } from '../professionalProjectsApi.ts'
import { MultilineText } from '../../../components/MultilineText.tsx'
import { ACCENT } from '../../../theme.ts'

type ProjectListItemProps = {
  project: ProfessionalProject;
  isAdmin: boolean;
  onEdit: (project: ProfessionalProject) => void;
  onDelete: (project: ProfessionalProject) => void;
}

export function ProjectListItem({
  project,
  isAdmin,
  onEdit,
  onDelete,
}: ProjectListItemProps) {
  return (
    <Paper
      component="li"
      sx={{
        p: 2.5,
        listStyle: 'none',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '3px',
          backgroundImage: `linear-gradient(to bottom, ${ACCENT.from}, ${ACCENT.to})`,
          transform: 'scaleY(0)',
          transformOrigin: 'top',
          transition: 'transform 0.25s ease',
        },
        '&:hover': {
          transform: 'translateY(-3px)',
          borderColor: 'primary.main',
          boxShadow: (theme) =>
            `0 12px 32px -12px ${theme.palette.mode === 'light' ? 'rgba(15,23,42,0.25)' : 'rgba(0,0,0,0.6)'}`,
        },
        '&:hover::before': { transform: 'scaleY(1)' },
      }}
    >
      <Typography variant="h6" gutterBottom>
        {project.name}
      </Typography>
      {project.description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          <MultilineText text={project.description} />
        </Typography>
      )}
      {project.developerCommentary && (
        <>
          <Typography variant="subtitle2" sx={{ color: 'secondary.main' }} gutterBottom>
            Developer Commentary
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            <MultilineText text={project.developerCommentary} />
          </Typography>
        </>
      )}
      {project.marketingSiteUrl && (
        <Link
          href={project.marketingSiteUrl}
          target="_blank"
          rel="noreferrer"
          variant="body2"
          sx={{ fontWeight: 600 }}
        >
          View marketing site →
        </Link>
      )}
      {isAdmin && (
        <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
          <Button size="small" onClick={() => onEdit(project)}>Edit</Button>
          <Button size="small" color="error" onClick={() => onDelete(project)}>Delete</Button>
        </Stack>
      )}
    </Paper>
  )
}
