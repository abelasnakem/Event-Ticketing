import { ActionIcon, Badge, Button, Card, Group, Image, Menu, Progress, Stack, Table, Text, TextInput, Title } from '@mantine/core';
import { IconDotsVertical, IconEye, IconFilter, IconSearch, IconShield, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';

const events = [
  {
    id: 'EVT-1021',
    name: 'Gize Concert',
    organizer: 'Gize Entertainment',
    sold: 12450,
    total: 15000,
    revenue: '6.2M',
    status: 'Published',
    bannerUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=300&q=60',
  },
  {
    id: 'EVT-1452',
    name: 'Tech Innovate ETH',
    organizer: 'Startup Grind Addis',
    sold: 400,
    total: 500,
    revenue: '1.2M',
    status: 'Published',
    bannerUrl: 'https://images.unsplash.com/photo-1515165562835-c4c1bfa5c0b0?auto=format&fit=crop&w=300&q=60',
  },
  {
    id: 'EVT-1670',
    name: 'Zoma Art Gala',
    organizer: 'Zoma Museum',
    sold: 120,
    total: 200,
    revenue: '240K',
    status: 'Draft',
    bannerUrl: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?auto=format&fit=crop&w=300&q=60',
  },
  {
    id: 'EVT-1540',
    name: 'Underground DJ Night',
    organizer: 'Addis Beats',
    sold: 450,
    total: 500,
    revenue: '450K',
    status: 'Suspended',
    bannerUrl: 'https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=300&q=60',
  },
];

const statusColor = (status: string) => {
  switch (status) {
    case 'Published':
      return 'teal';
    case 'Draft':
      return 'gray';
    case 'Suspended':
      return 'red';
    default:
      return 'blue';
  }
};

export default function EventsManagement() {
  const [query, setQuery] = useState('');
  const formatNumber = new Intl.NumberFormat('en-US');

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = events.filter((event) =>
    `${event.id} ${event.name} ${event.organizer}`.toLowerCase().includes(normalizedQuery),
  );

  return (
    <div>
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2}>Events</Title>
          <Text size="sm" c="dimmed">
            Global view of all organizer events across the platform
          </Text>
        </div>
        <Group>
          <Button variant="light" leftSection={<IconFilter size={16} />} color="gray">
            Filters
          </Button>
          <Button color="nightfall">Export CSV</Button>
        </Group>
      </Group>

      <Card padding="xl" className="glass-panel">
        <Group mb="lg">
          <TextInput
            placeholder="Search events or organizers"
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
              <Table.Th>Banner</Table.Th>
              <Table.Th>Event</Table.Th>
              <Table.Th>Organizer</Table.Th>
              <Table.Th>Tickets</Table.Th>
              <Table.Th>Revenue</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th ta="right">Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filtered.map((event, index) => (
              <Table.Tr key={event.id}>
                <Table.Td>{index + 1}</Table.Td>
                <Table.Td>
                  <Image src={event.bannerUrl} alt={event.name} radius="md" w={64} h={44} fit="cover" />
                </Table.Td>
                <Table.Td>
                  <Text fw={600}>{event.name}</Text>
                  <Text size="xs" ff="monospace" c="dimmed">
                    {event.id}
                  </Text>
                </Table.Td>
                <Table.Td>{event.organizer}</Table.Td>
                <Table.Td>
                  <Stack gap={6}>
                    <Progress
                      value={Math.round((event.sold / event.total) * 100)}
                      color={event.sold / event.total > 0.8 ? 'teal' : 'yellow'}
                      radius="xl"
                      size="md"
                      styles={{ root: { backgroundColor: 'rgba(255, 255, 255, 0.12)' } }}
                    />
                    <Group justify="space-between" gap="xs">
                      <Text size="xs" c="dimmed">
                        {formatNumber.format(event.sold)}/{formatNumber.format(event.total)}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {Math.round((event.sold / event.total) * 100)}%
                      </Text>
                    </Group>
                  </Stack>
                </Table.Td>
                <Table.Td>{event.revenue} ETB</Table.Td>
                <Table.Td>
                  <Badge color={statusColor(event.status)} radius="sm">
                    {event.status}
                  </Badge>
                </Table.Td>
                <Table.Td ta="right">
                  <Menu withinPortal position="bottom-end" shadow="md">
                    <Menu.Target>
                      <ActionIcon variant="subtle" color="gray">
                        <IconDotsVertical size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item leftSection={<IconEye size={14} />}>
                        View Details
                      </Menu.Item>
                      <Menu.Item leftSection={<IconShield size={14} />} color="yellow">
                        Flag for Review
                      </Menu.Item>
                      <Menu.Item leftSection={<IconTrash size={14} />} color="red">
                        Remove Event
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>
    </div>
  );
}
