import { ActionIcon, Badge, Button, Card, Group, Progress, SimpleGrid, Table, Text, ThemeIcon, Title } from '@mantine/core';
import { IconArrowRight, IconCalendarEvent, IconDeviceMobile, IconTicket, IconUsers } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { organizerEvents } from '../../data/organizerEvents';

const statsConfig = [
  {
    label: 'Tickets Sold (30d)',
    value: '32,400',
    change: '+18%',
    icon: IconTicket,
    color: 'nightfall',
  },
  {
    label: 'Revenue (ETB)',
    value: '18.7M',
    change: '+11%',
    icon: IconUsers,
    color: 'teal',
  },
  {
    label: 'Scanner Devices',
    value: '12',
    change: '3 pending',
    icon: IconDeviceMobile,
    color: 'violet',
  },
];

export default function OrganizerDashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <Group justify="space-between" align="flex-start" mb="xl">
        <div>
          <Title order={2}>Organizer Command Center</Title>
          <Text c="dimmed">Create, monitor, and operate every event from one glass board.</Text>
        </div>
        <Button size="md" radius="lg" leftSection={<IconCalendarEvent size={18} />} onClick={() => navigate('/organizer/events/new')}>
          Create event
        </Button>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl" mb="xl">
        {statsConfig.map((stat) => (
          <Card key={stat.label} padding="xl" className="glass-panel">
            <Group justify="space-between" align="flex-start">
              <div>
                <Text size="sm" c="dimmed" fw={600} tt="uppercase">
                  {stat.label}
                </Text>
                <Text fw={700} fz="xl" mt="xs">
                  {stat.value}
                </Text>
                <Text size="sm" c="teal" fw={600}>
                  {stat.change}
                </Text>
              </div>
              <ThemeIcon size={48} variant="light" radius="xl" color={stat.color}>
                <stat.icon size={22} />
              </ThemeIcon>
            </Group>
          </Card>
        ))}
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="xl">
        <Card className="glass-panel" padding="xl">
          <Group justify="space-between" align="center" mb="lg">
            <div>
              <Title order={3}>Upcoming events</Title>
              <Text size="sm" c="dimmed">
                Track fulfillment, ticket mixes, and operational readiness
              </Text>
            </div>
            <Button variant="light" radius="lg" onClick={() => navigate('/organizer/events/new')}>
              Duplicate a past event
            </Button>
          </Group>

          <Table verticalSpacing="md" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Event</Table.Th>
                <Table.Th>Date</Table.Th>
                <Table.Th>Fill rate</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {organizerEvents.map((event) => {
                const total = event.tickets.reduce((sum, tier) => sum + tier.total, 0);
                const sold = event.tickets.reduce((sum, tier) => sum + tier.sold, 0);
                const progress = Math.round((sold / total) * 100);

                return (
                  <Table.Tr key={event.id}>
                    <Table.Td>
                      <Text fw={600}>{event.name}</Text>
                      <Text size="xs" c="dimmed">
                        {event.venue} · {event.city}
                      </Text>
                    </Table.Td>
                    <Table.Td>{dayjs(event.datetime).format('MMM D, h:mm A')}</Table.Td>
                    <Table.Td>
                      <Progress value={progress} color={progress > 80 ? 'teal' : 'yellow'} radius="xl" size="lg" />
                      <Text size="xs" c="dimmed">
                        {sold.toLocaleString()} / {total.toLocaleString()} seats
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Badge color={event.status === 'Published' ? 'teal' : event.status === 'Live' ? 'blue' : 'gray'} radius="sm">
                          {event.status}
                        </Badge>
                        <ActionIcon variant="subtle" color="nightfall" onClick={() => navigate(`/organizer/events/${event.id}`)}>
                          <IconArrowRight size={18} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </Card>

        <Card className="glass-panel" padding="xl">
          <Title order={3} mb="sm">
            Scanner coverage
          </Title>
          <Text size="sm" c="dimmed" mb="lg">
            Invite gate staff with a one-time code that syncs with the scanner app.
          </Text>
          <SimpleGrid cols={2} spacing="lg">
            {organizerEvents.slice(0, 2).map((event) => (
              <Card key={event.id} padding="lg" radius="lg" className="glass-panel" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <Text fw={600}>{event.name}</Text>
                <Text size="xs" c="dimmed">
                  {event.scanners.length} devices
                </Text>
                <Button
                  mt="md"
                  variant="light"
                  radius="lg"
                  onClick={() => navigate(`/organizer/events/${event.id}`)}
                >
                  Manage scanners
                </Button>
              </Card>
            ))}
          </SimpleGrid>
        </Card>
      </SimpleGrid>
    </div>
  );
}
