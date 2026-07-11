import { NavLink, Route, Routes } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { AboutPage } from './pages/AboutPage.tsx'
import { HomePage } from './pages/HomePage.tsx'
import { ProfessionalProjectsPage } from './pages/ProfessionalProjects.tsx'
import { useColorMode } from './contexts/ColorModeContext.tsx'
import { ACCENT } from './theme.ts'

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/professional-projects', label: 'Work' },
  { to: '/about', label: 'About' },
]

function App() {
  const { mode, toggleColorMode } = useColorMode()

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="sticky" color="transparent" elevation={0}>
        <Container maxWidth="md" disableGutters>
          <Toolbar sx={{ gap: 2, px: { xs: 2, sm: 0 } }}>
            <Box
              component={NavLink}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                textDecoration: 'none',
                color: 'text.primary',
                flexGrow: 1,
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1.5,
                  display: 'grid',
                  placeItems: 'center',
                  color: '#fff',
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  backgroundImage: `linear-gradient(135deg, ${ACCENT.from}, ${ACCENT.to})`,
                  boxShadow: `0 4px 14px -4px ${ACCENT.from}`,
                }}
              >
                CB
              </Box>
              <Typography
                variant="subtitle1"
                sx={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700 }}
              >
                Cole Berkley
              </Typography>
            </Box>

            <Box component="nav" sx={{ display: 'flex', gap: { xs: 1.5, sm: 3 } }}>
              {NAV_LINKS.map(({ to, label, end }) => (
                <Box
                  key={to}
                  component={NavLink}
                  to={to}
                  end={end}
                  sx={{
                    position: 'relative',
                    textDecoration: 'none',
                    color: 'text.secondary',
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    py: 0.5,
                    transition: 'color 0.2s ease',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      bottom: 0,
                      height: '2px',
                      width: '100%',
                      borderRadius: '2px',
                      backgroundImage: `linear-gradient(90deg, ${ACCENT.from}, ${ACCENT.to})`,
                      transform: 'scaleX(0)',
                      transformOrigin: 'left',
                      transition: 'transform 0.25s ease',
                    },
                    '&:hover': { color: 'text.primary' },
                    '&:hover::after': { transform: 'scaleX(1)' },
                    '&.active': { color: 'text.primary' },
                    '&.active::after': { transform: 'scaleX(1)' },
                  }}
                >
                  {label}
                </Box>
              ))}
            </Box>

            <IconButton onClick={toggleColorMode} color="inherit" aria-label="toggle color mode">
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Container component="main" maxWidth="md" sx={{ py: 5, flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/professional-projects" element={<ProfessionalProjectsPage />} />
        </Routes>
      </Container>
    </Box>
  )
}

export default App
