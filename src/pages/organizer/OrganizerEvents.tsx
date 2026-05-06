import { ActionIcon, Badge, Button, Card, Group, Image, Progress, Stack, Table, Text, Title } from '@mantine/core';
import { IconArrowRight, IconCalendarEvent, IconPlus } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { organizerEvents } from '../../data/organizerEvents';

export default function OrganizerEvents() {
  const navigate = useNavigate();
  const formatNumber = new Intl.NumberFormat('en-US');

  return (
    <div>
      <Group justify="space-between" align="flex-start" mb="xl">
        <div>
          <Title order={2}>Events</Title>
          <Text c="dimmed">All created events and ticket performance.</Text>
        </div>
        <Button size="md" radius="lg" leftSection={<IconPlus size={18} />} onClick={() => navigate('/organizer/events/new')}>
          New event
        </Button>
      </Group>

      <Card className="glass-panel" padding="xl">
        <Group justify="space-between" align="center" mb="lg">
          <div>
            <Title order={3}>Created events</Title>
            <Text size="sm" c="dimmed">
              Review drafts, published events, and live sales.
            </Text>
          </div>
        </Group>

        {organizerEvents.length === 0 ? (
          <Text size="sm" c="dimmed">
            You have not created any events yet.
          </Text>
        ) : (
          <Table verticalSpacing="md" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>#</Table.Th>
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
                const progress = total ? Math.round((sold / total) * 100) : 0;

                return (
                  <Table.Tr key={event.id}>
                    <Table.Td>{index + 1}</Table.Td>
                    <Table.Td>
                      <Group gap="md" wrap="nowrap">
                        <Image
                          src={event.bannerUrl ?? 'https://images.unsplash.com/photo-1515165562835-c4c1bfa5c0b0?auto=format&fit=crop&w=200&q=60'}
                          alt={event.name}
                          radius="md"
                          w={64}
                          h={44}
                          fit="cover"
                        />
                        <Stack gap={4}>
                          <Text fw={600}>{event.name}</Text>
                          <Text size="xs" c="dimmed">
                            {event.venue} · {event.city}
                          </Text>
                        </Stack>
                      </Group>
                    </Table.Td>
                    <Table.Td>{dayjs(event.datetime).format('MMM D, h:mm A')}</Table.Td>
                    <Table.Td>
                      <Stack gap={6}>
                        <Progress
                          value={progress}
                          color={progress > 80 ? 'nightfall' : 'yellow'}
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
                        <Badge color={event.status === 'Published' ? 'nightfall' : event.status === 'Live' ? 'blue' : 'gray'} radius="sm">
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
        )}
      </Card>

      <Card className="glass-panel" padding="xl" mt="xl">
        <Group justify="space-between" align="center">
          <div>
            <Text fw={700}>Need a quick overview?</Text>
            <Text size="sm" c="dimmed">
              Head back to the organizer command center for sales insights.
            </Text>
          </div>
          <Button variant="light" leftSection={<IconCalendarEvent size={16} />} onClick={() => navigate('/organizer')}>
            View dashboard
          </Button>
        </Group>
      </Card>
    </div>
  );
}
