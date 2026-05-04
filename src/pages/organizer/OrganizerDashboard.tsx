import { ActionIcon, Badge, Button, Card, Divider, Group, Image, Progress, SimpleGrid, Stack, Table, Text, ThemeIcon, Title } from '@mantine/core';
import { IconArrowRight, IconCalendarEvent, IconTicket, IconUsers } from '@tabler/icons-react';
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
    label: 'Active Events',
    value: '8',
    change: '2 launching soon',
    icon: IconCalendarEvent,
    color: 'violet',
  },
];

const payoutHistory = [
  { id: 'PAYOUT-2043', amount: '420,000 ETB', status: 'Processing', date: 'Mar 26, 2026' },
  { id: 'PAYOUT-2038', amount: '1,200,000 ETB', status: 'Completed', date: 'Mar 18, 2026' },
];

export default function OrganizerDashboard() {
  const navigate = useNavigate();
  const formatNumber = new Intl.NumberFormat('en-US');

  return (
    <div>
      <Group justify="space-between" align="flex-start" mb="xl">
        <div>
          <Title order={2}>Organizer Command Center</Title>
          <Text c="dimmed">Quick view of sales, events, and payouts.</Text>
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

      <SimpleGrid cols={{ base: 1, lg: 1 }} spacing="xl">
        <Card className="glass-panel" padding="xl">
          <Group justify="space-between" align="center" mb="lg">
            <div>
              <Title order={3}>Upcoming events</Title>
              <Text size="sm" c="dimmed">
                Track sales progress and event readiness.
              </Text>
            </div>
            <Button variant="light" radius="lg" onClick={() => navigate('/organizer/events/new')}>
              New event
            </Button>
          </Group>

          <Table verticalSpacing="md" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>#</Table.Th>
                <Table.Th>Banner</Table.Th>
                <Table.Th>Event</Table.Th>
                <Table.Th>Date</Table.Th>
                <Table.Th>Tickets</Table.Th>
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
                      <Image
                        src={event.bannerUrl ?? 'https://images.unsplash.com/photo-1515165562835-c4c1bfa5c0b0?auto=format&fit=crop&w=200&q=60'}
                        alt={event.name}
                        radius="md"
                        w={64}
                        h={44}
                        fit="cover"
                      />
                    </Table.Td>
                    <Table.Td>
                      <Text fw={600}>{event.name}</Text>
                      <Text size="xs" c="dimmed">
                        {event.venue} · {event.city}
                      </Text>
                    </Table.Td>
                    <Table.Td>{dayjs(event.datetime).format('MMM D, h:mm A')}</Table.Td>
                    <Table.Td>
                      <Stack gap={6}>
                        <Progress
                          value={progress}
                          color={progress > 80 ? 'teal' : 'yellow'}
                          radius="xl"
                          size="md"
                          styles={{
                            root: { backgroundColor: 'rgba(255, 255, 255, 0.12)' },
                          }}
                        />
                        <Group justify="space-between" gap="xs">
                          <Text size="xs" c="dimmed">
                            {formatNumber.format(sold)}/{formatNumber.format(total)}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {progress}%
                          </Text>
                        </Group>
                      </Stack>
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
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="xl" mt="xl">
        <Card className="glass-panel" padding="xl" style={{ gridColumn: '1 / -1' }}>
          <Title order={3} mb="sm">
            Wallet & withdrawals
          </Title>
          <Text size="sm" c="dimmed" mb="lg">
            Track your available balance and recent payout activity.
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
                <Button color="nightfall">Withdraw funds</Button>
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
