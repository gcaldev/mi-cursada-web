import { Box, Container, Paper } from '@mui/material';
import { ReactNode } from 'react';

/**
 * Layout principal de la aplicación
 * Proporciona estructura común con padding y contenedor centrado
 */

interface MainLayoutProps {
  children: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export function MainLayout({ children, maxWidth = 'md' }: MainLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        py: 4,
      }}
    >
      <Container maxWidth={maxWidth}>
        <Paper
          elevation={2}
          sx={{
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: 2,
          }}
        >
          {children}
        </Paper>
      </Container>
    </Box>
  );
}
