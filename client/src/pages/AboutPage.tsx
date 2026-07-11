import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Reveal } from '../components/Reveal.tsx'

export function AboutPage() {
  return (
    <Reveal component="section">
      <Box sx={{ mb: 3 }}>
        <Typography variant="overline" sx={{ color: 'secondary.main' }}>
          Would you Like to Know More?
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          About
        </Typography>
      </Box>
      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, maxWidth: 620 }}>
        This project is built with React, TypeScript, and Vite, using Redux Toolkit
        for state management and React Router for client-side navigation. The
        interface is composed with Material UI and a custom theme.
      </Typography>
    </Reveal>
  )
}