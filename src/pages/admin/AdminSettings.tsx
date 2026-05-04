import { Card, Stack, Text, Title } from '@mantine/core';

export default function AdminSettings() {
  return (
    <Card className="glass-panel" padding="xl">
      <Stack gap="sm">
        <Title order={2}>Platform Settings</Title>
        <Text c="dimmed">
          Placeholder settings page for the admin sidebar navigation.
        </Text>
      </Stack>
    </Card>
  );
}
