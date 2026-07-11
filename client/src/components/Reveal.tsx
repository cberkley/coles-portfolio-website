import Box from '@mui/material/Box'
import type { BoxProps } from '@mui/material/Box'
import type { ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  /** Delay in ms before the reveal animation starts. */
  delay?: number
} & BoxProps

/**
 * Fades and rises its children into view on mount.
 * Respects the user's `prefers-reduced-motion` setting.
 */
export function Reveal({ children, delay = 0, sx, ...boxProps }: RevealProps) {
  return (
    <Box
      {...boxProps}
      sx={{
        '@keyframes reveal-rise': {
          from: { opacity: 0, transform: 'translateY(16px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        opacity: 0,
        animation: 'reveal-rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        animationDelay: `${delay}ms`,
        '@media (prefers-reduced-motion: reduce)': {
          animation: 'none',
          opacity: 1,
          transform: 'none',
        },
        ...sx,
      }}
    >
      {children}
    </Box>
  )
}
