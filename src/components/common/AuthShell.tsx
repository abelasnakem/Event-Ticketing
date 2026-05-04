import { Box, Card, Stack } from '@mantine/core';
import type { CSSProperties } from 'react';

type AuthShellProps = {
  children: React.ReactNode;
};

type AuthCardProps = {
  children: React.ReactNode;
};

const shellStyles: {
  root: CSSProperties;
  backdrop: CSSProperties;
  glow: CSSProperties;
  content: CSSProperties;
} = {
  root: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 20px',
    backgroundColor: '#0b0c1e',
    backgroundImage: 'var(--bg-gradient)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    position: 'relative',
    overflow: 'hidden',
  },
  backdrop: {
    position: 'absolute',
    inset: 0,
    background:
      'radial-gradient(circle at 20% 20%, rgba(83, 111, 247, 0.22), transparent 55%), radial-gradient(circle at 80% 10%, rgba(11, 12, 30, 0.7), transparent 55%)',
  },
  glow: {
    position: 'absolute',
    inset: '-25%',
    background:
      'radial-gradient(circle at 15% 30%, rgba(83, 111, 247, 0.25), transparent 42%), radial-gradient(circle at 75% 25%, rgba(217, 123, 43, 0.18), transparent 45%)',
    filter: 'blur(120px)',
    opacity: 0.85,
  },
  content: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: 480,
  },
};

export function AuthShell({ children }: AuthShellProps) {
  return (
    <Box style={shellStyles.root}>
      <Box style={shellStyles.backdrop} />
      <Box style={shellStyles.glow} />
      <Box style={shellStyles.content}>{children}</Box>
    </Box>
  );
}

export function AuthCard({ children }: AuthCardProps) {
  return (
    <Card
      radius="xl"
      p="xl"
      w="100%"
      styles={{
        root: {
          backgroundColor: '#1e1e1e',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.55)',
        },
      }}
    >
      <Stack gap="lg">{children}</Stack>
    </Card>
  );
}
