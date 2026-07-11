import { createTheme, type PaletteMode } from '@mui/material/styles'

const DISPLAY_FONT = '"Space Grotesk", "Segoe UI", sans-serif'
const BODY_FONT = '"Inter", "Segoe UI", sans-serif'

// Shared accent used for gradients / highlights across both modes.
export const ACCENT = {
  from: '#2f6bff',
  to: '#38bdf8',
}

export function getTheme(mode: PaletteMode) {
  const isLight = mode === 'light'

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isLight ? '#2f6bff' : '#5b8cff',
        contrastText: '#ffffff',
      },
      secondary: {
        main: isLight ? '#0891b2' : '#38bdf8',
      },
      background: {
        default: isLight ? '#f6f8fc' : '#0b1120',
        paper: isLight ? '#ffffff' : '#111a2e',
      },
      text: {
        primary: isLight ? '#0b1220' : '#e8edf7',
        secondary: isLight ? '#4a5871' : '#9fb0cc',
      },
      divider: isLight ? '#e4e9f2' : '#22304d',
      error: {
        main: isLight ? '#dc2626' : '#f87171',
      },
    },
    typography: {
      fontFamily: BODY_FONT,
      h1: { fontFamily: DISPLAY_FONT, fontWeight: 700, letterSpacing: '-0.03em' },
      h2: { fontFamily: DISPLAY_FONT, fontWeight: 700, letterSpacing: '-0.03em' },
      h3: { fontFamily: DISPLAY_FONT, fontWeight: 700, letterSpacing: '-0.02em' },
      h4: { fontFamily: DISPLAY_FONT, fontWeight: 700, letterSpacing: '-0.02em' },
      h5: { fontFamily: DISPLAY_FONT, fontWeight: 600, letterSpacing: '-0.01em' },
      h6: { fontFamily: DISPLAY_FONT, fontWeight: 600, letterSpacing: '-0.01em' },
      button: { fontWeight: 600, textTransform: 'none', letterSpacing: 0 },
      overline: { fontWeight: 700, letterSpacing: '0.18em' },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: isLight ? '#f6f8fc' : '#0b1120',
            backgroundImage: `radial-gradient(${
              isLight ? 'rgba(47,107,255,0.06)' : 'rgba(91,140,255,0.08)'
            } 1px, transparent 1px)`,
            backgroundSize: '22px 22px',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
          },
        },
      },
      MuiPaper: {
        defaultProps: {
          variant: 'outlined',
          elevation: 0,
        },
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isLight
              ? 'rgba(246, 248, 252, 0.72)'
              : 'rgba(11, 17, 32, 0.72)',
            backdropFilter: 'blur(12px)',
            borderBottom: `1px solid ${isLight ? '#e4e9f2' : '#22304d'}`,
          },
        },
      },
      MuiButton: {
        defaultProps: {
          variant: 'outlined',
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: 10,
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          },
          contained: {
            backgroundImage: `linear-gradient(135deg, ${ACCENT.from}, ${ACCENT.to})`,
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: `0 8px 24px -8px ${ACCENT.from}`,
            },
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          size: 'small',
          fullWidth: true,
        },
      },
    },
  })
}
