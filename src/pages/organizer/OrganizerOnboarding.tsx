import { Anchor, Button, Card, Checkbox, Group, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { getOrganizerAccount, saveOrganizerAccount } from '../../data/organizerAccount';

export default function OrganizerOnboarding() {
  const navigate = useNavigate();
  const existingAccount = getOrganizerAccount();

  const form = useForm({
    initialValues: {
      fullName: '',
      businessName: '',
      email: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
    },
    validate: {
      fullName: (value) => (value.trim().length < 2 ? 'Please enter your full name' : null),
      businessName: (value) => (value.trim().length < 2 ? 'Please enter your business name' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Please enter a valid email'),
      password: (value) => (value.length < 8 ? 'Password must be at least 8 characters' : null),
      confirmPassword: (value, values) => (value !== values.password ? 'Passwords do not match' : null),
      termsAccepted: (value) => (value ? null : 'You must accept the terms to continue'),
    },
  });

  if (existingAccount) {
    return <Navigate to="/organizer" replace />;
  }

  const handleSubmit = form.onSubmit((values) => {
    saveOrganizerAccount({
      fullName: values.fullName.trim(),
      businessName: values.businessName.trim(),
      email: values.email.trim().toLowerCase(),
      createdAt: new Date().toISOString(),
    });

    notifications.show({
      title: 'Account created',
      message: 'Welcome! Your organizer workspace is ready.',
      color: 'teal',
      icon: <IconCheck size={18} />,
    });

    navigate('/organizer', { replace: true });
  });

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 20 }}>
      <Card className="glass-panel" radius="xl" p="xl" maw={520} w="100%">
        <Stack gap="lg">
          <div>
            <Title order={2}>Create your organizer account</Title>
            <Text c="dimmed" mt={6}>
              One quick step to access event creation, scanner tools, and sales insights.
            </Text>
          </div>

          <form onSubmit={handleSubmit}>
            <Stack>
              <TextInput label="Full name" placeholder="Abel Mekonnen" required {...form.getInputProps('fullName')} />
              <TextInput label="Business name" placeholder="Digis Studio" required {...form.getInputProps('businessName')} />
              <TextInput label="Email" type="email" placeholder="you@company.com" required {...form.getInputProps('email')} />
              <PasswordInput label="Password" placeholder="At least 8 characters" required {...form.getInputProps('password')} />
              <PasswordInput label="Confirm password" placeholder="Re-enter password" required {...form.getInputProps('confirmPassword')} />
              <Checkbox
                label="I agree to the organizer terms and privacy policy"
                {...form.getInputProps('termsAccepted', { type: 'checkbox' })}
              />
              <Group justify="space-between" mt="xs">
                <Text size="sm" c="dimmed">
                  Already onboarded?
                </Text>
                <Anchor component="button" type="button" onClick={() => navigate('/organizer')}>
                  Go to dashboard
                </Anchor>
              </Group>
              <Button type="submit" radius="lg" fullWidth>
                Create account
              </Button>
            </Stack>
          </form>
        </Stack>
      </Card>
    </div>
  );
}
