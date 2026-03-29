import { ActionIcon, Badge, Button, Card, Divider, Group, Progress, SimpleGrid, Stack, Table, Text, ThemeIcon, Timeline, Title } from '@mantine/core';
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

const payoutHistory = [
  { id: 'PAYOUT-2043', amount: '420,000 ETB', status: 'Processing', date: 'Mar 26, 2026' },
  { id: 'PAYOUT-2038', amount: '1,200,000 ETB', status: 'Completed', date: 'Mar 18, 2026' },
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
                <Table.Th>#</Table.Th>
                <Table.Th>Event</Table.Th>
                <Table.Th>Date</Table.Th>
                <Table.Th>Fill rate</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {organizerEvents.map((event, index) => {
                const total = event.tickets.reduce((sum, tier) => sum + tier.total, 0);
                const sold = event.tickets.reduce((sum, tier) => sum + tier.sold, 0);
                const progress = Math.round((sold / total) * 100);

                return (
                  <Table.Tr key={event.id}>
                    <Table.Td>{index + 1}</Table.Td>
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

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="xl" mt="xl">
        <Card className="glass-panel" padding="xl">
          <Group justify="space-between" align="center" mb="lg">
            <div>
              <Title order={3}>Easy onboarding</Title>
              <Text size="sm" c="dimmed">
                Three quick steps to go live on Digis.
              </Text>
            </div>
            <Button variant="light" radius="lg">
              Talk to concierge
            </Button>
          </Group>
          <Timeline active={1} bulletSize={28} lineWidth={2} color="nightfall">
            <Timeline.Item title="Verify organization">
              <Text size="sm" c="dimmed">
                Upload license + primary contact within 5 minutes.
              </Text>
            </Timeline.Item>
            <Timeline.Item title="Connect payout rails">
              <Text size="sm" c="dimmed">
                Add Telebirr, bank, or Chapa settlement accounts.
              </Text>
            </Timeline.Item>
            <Timeline.Item title="Publish first experience">
              <Text size="sm" c="dimmed">
                Duplicate a past show or build a new template.
              </Text>
            </Timeline.Item>
          </Timeline>
        </Card>

        <Card className="glass-panel" padding="xl">
          <Title order={3} mb="sm">
            Wallet & withdrawals
          </Title>
          <Text size="sm" c="dimmed" mb="lg">
            Track available balance, settlement status, and initiate payouts.
          </Text>
          <Stack gap="md">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">
                  Available balance
                </Text>
                <Text fw={700} fz="xl">
                  2,540,000 ETB
                </Text>
              </div>
              <Group gap="sm">
                <Button variant="light" color="gray">
                  Connect bank
                </Button>
                <Button color="nightfall">Request payout</Button>
              </Group>
            </Group>
            <Divider label="Recent payouts" labelPosition="center" variant="dashed" color="rgba(255,255,255,0.2)" />
            <Table verticalSpacing="sm" highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>#</Table.Th>
                  <Table.Th>Reference</Table.Th>
                  <Table.Th>Amount</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Date</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {payoutHistory.map((payout, index) => (
                  <Table.Tr key={payout.id}>
                    <Table.Td>{index + 1}</Table.Td>
                    <Table.Td>
                      <Text fw={600}>{payout.id}</Text>
                    </Table.Td>
                    <Table.Td>{payout.amount}</Table.Td>
                    <Table.Td>
                      <Badge color={payout.status === 'Completed' ? 'teal' : 'yellow'}>{payout.status}</Badge>
                    </Table.Td>
                    <Table.Td>{payout.date}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Stack>
        </Card>
      </SimpleGrid>
    </div>
  );
}
