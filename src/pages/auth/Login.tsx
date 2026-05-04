import { Button, Group, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { AuthCard, AuthShell } from '../../components/common/AuthShell';
import { AUTH_COLORS, buttonStyles, inputStyles } from '../../components/common/authStyles';

const linkButtonStyles = {
  root: {
    padding: 0,
    height: 'auto',
    color: AUTH_COLORS.textPrimary,
  },
  label: {
    fontWeight: 600,
  },
};

export default function Login() {
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      contact: '',
      password: '',
    },
  });

  const canSubmit = form.values.contact.trim().length > 0 && form.values.password.length > 0;
  const handleSubmit = form.onSubmit(() => {
    navigate('/organizer', { replace: true });
  });

  return (
    <AuthShell>
      <AuthCard>
        <Stack gap="md">
          <Stack gap={4}>
            <Title order={3} c={AUTH_COLORS.textPrimary}>
              Welcome back
            </Title>
            <Text size="sm" c={AUTH_COLORS.textMuted}>
              Sign in to continue to your organizer space.
            </Text>
          </Stack>

          <form onSubmit={handleSubmit}>
            <Stack>
              <TextInput
                label="Phone/Email"
                placeholder="+251 912 000 000 or you@example.com"
                styles={inputStyles}
                value={form.values.contact}
                onChange={(event) => form.setFieldValue('contact', event.currentTarget.value)}
              />
              <PasswordInput
                label="Password"
                placeholder="Your password"
                styles={inputStyles}
                visibilityToggleIcon={(reveal) =>
                  reveal ? <IconEyeOff size={16} color="#6f665d" /> : <IconEye size={16} color="#6f665d" />
                }
                value={form.values.password}
                onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
              />
              <Group justify="space-between">
                <Text size="sm" c={AUTH_COLORS.textMuted}>
                  New here?
                </Text>
                <Button
                  variant="subtle"
                  size="xs"
                  styles={linkButtonStyles}
                  onClick={() => navigate('/organizer/onboarding')}
                >
                  Create account
                </Button>
              </Group>
              <Button type="submit" radius="lg" styles={buttonStyles} fullWidth disabled={!canSubmit}>
                Sign in
              </Button>
            </Stack>
          </form>
        </Stack>
      </AuthCard>
    </AuthShell>
  );
}
