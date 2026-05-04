import { Badge, Button, Card, Group, Table, Text, TextInput, Title } from '@mantine/core';
import { IconFilter, IconSearch } from '@tabler/icons-react';
import { useMemo, useState } from 'react';

const organizers = [
  {
    id: 'ORG-1021',
    name: 'Gize Entertainment',
    contact: 'gize@events.com',
    events: 6,
    status: 'Verified',
  },
  {
    id: 'ORG-2044',
    name: 'Startup Grind Addis',
    contact: 'hello@startupgrind.et',
    events: 3,
    status: 'Pending',
  },
  {
    id: 'ORG-3301',
    name: 'Zoma Museum',
    contact: 'programs@zomamuseum.et',
    events: 2,
    status: 'Verified',
  },
  {
    id: 'ORG-4550',
    name: 'Addis Beats',
    contact: 'team@addisbeats.et',
    events: 1,
    status: 'Suspended',
  },
];

const statusColor = (status: string) => {
  switch (status) {
    case 'Verified':
      return 'teal';
    case 'Pending':
      return 'yellow';
    case 'Suspended':
      return 'red';
    default:
      return 'gray';
  }
};

export default function Organizers() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () =>
      organizers.filter((organizer) =>
        `${organizer.id} ${organizer.name} ${organizer.contact}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );

  return (
    <div>
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2}>Organizers</Title>
          <Text size="sm" c="dimmed">
            Review organizer accounts and their status across the platform
          </Text>
        </div>
        <Group>
          <Button variant="light" leftSection={<IconFilter size={16} />} color="gray">
            Filters
          </Button>
          <Button color="nightfall">Invite organizer</Button>
        </Group>
      </Group>

      <Card padding="xl" className="glass-panel">
        <Group mb="lg">
          <TextInput
            placeholder="Search organizers"
            leftSection={<IconSearch size={16} />}
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            radius="md"
            style={{ flex: 1 }}
          />
        </Group>

        <Table verticalSpacing="md" horizontalSpacing="lg" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>#</Table.Th>
              <Table.Th>Organizer</Table.Th>
              <Table.Th>Contact</Table.Th>
              <Table.Th>Events</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filtered.map((organizer, index) => (
              <Table.Tr key={organizer.id}>
                <Table.Td>{index + 1}</Table.Td>
                <Table.Td>
                  <Text fw={600}>{organizer.name}</Text>
                  <Text size="xs" ff="monospace" c="dimmed">
                    {organizer.id}
                  </Text>
                </Table.Td>
                <Table.Td>{organizer.contact}</Table.Td>
                <Table.Td>{organizer.events}</Table.Td>
                <Table.Td>
                  <Badge color={statusColor(organizer.status)} radius="sm">
                    {organizer.status}
                  </Badge>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>
    </div>
  );
}
