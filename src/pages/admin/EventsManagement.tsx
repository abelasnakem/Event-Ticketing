import { ActionIcon, Badge, Button, Card, Group, Menu, Table, Text, TextInput, Title } from '@mantine/core';
import { IconDotsVertical, IconEye, IconFilter, IconSearch, IconShield, IconTrash } from '@tabler/icons-react';
import { useMemo, useState } from 'react';

const events = [
  { id: 'EVT-1021', name: 'Gize Concert', organizer: 'Gize Entertainment', sold: 12450, total: 15000, revenue: '6.2M', status: 'Published' },
  { id: 'EVT-1452', name: 'Tech Innovate ETH', organizer: 'Startup Grind Addis', sold: 400, total: 500, revenue: '1.2M', status: 'Published' },
  { id: 'EVT-1670', name: 'Zoma Art Gala', organizer: 'Zoma Museum', sold: 120, total: 200, revenue: '240K', status: 'Draft' },
  { id: 'EVT-1540', name: 'Underground DJ Night', organizer: 'Addis Beats', sold: 450, total: 500, revenue: '450K', status: 'Suspended' },
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

  const filtered = useMemo(
    () =>
      events.filter((event) =>
        `${event.id} ${event.name} ${event.organizer}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
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
                  <Text fw={600}>{event.name}</Text>
                  <Text size="xs" ff="monospace" c="dimmed">
                    {event.id}
                  </Text>
                </Table.Td>
                <Table.Td>{event.organizer}</Table.Td>
                <Table.Td>
                  {event.sold.toLocaleString()} / {event.total.toLocaleString()}
                  <Text size="xs" c="dimmed">
                    {Math.round((event.sold / event.total) * 100)}% capacity
                  </Text>
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
