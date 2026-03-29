import { ActionIcon, Badge, Card, Center, Group, RingProgress, SimpleGrid, Table, Text, Title } from '@mantine/core';
import { IconAlertTriangle, IconArrowUpRight, IconCash, IconTicket, IconUser } from '@tabler/icons-react';

const kpis = [
  { title: 'Tickets Sold', value: '45,231', diff: '+32%', icon: IconTicket, color: 'nightfall' },
  { title: 'Platform Revenue', value: '2.4M ETB', diff: '+18%', icon: IconCash, color: 'teal' },
  { title: 'Active Organizers', value: '142', diff: '+6%', icon: IconUser, color: 'violet' },
];

const fraudRows = [
  { ticket: 'TX-991A', event: 'Gize Concert', reason: 'Duplicate scan attempts', scans: 12 },
  { ticket: 'TX-1B90', event: 'Tech Innovate ETH', reason: 'Abnormal resale activity', scans: 0 },
];

export default function Dashboard() {
  return (
    <Group align="flex-start" gap="xl">
      <div style={{ flex: 1 }}>
        <Title order={2} mb="lg">
          Platform Overview
        </Title>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl" mb="xl">
          {kpis.map((kpi) => (
            <Card key={kpi.title} padding="xl" className="glass-panel">
              <Group justify="space-between" align="flex-start">
                <div>
                  <Text size="sm" c="dimmed" fw={600} tt="uppercase">
                    {kpi.title}
                  </Text>
                  <Text fw={700} fz="xl" mt="xs">
                    {kpi.value}
                  </Text>
                </div>
                <ActionIcon variant="light" radius="xl" color={kpi.color} size="lg">
                  <kpi.icon size={20} stroke={1.8} />
                </ActionIcon>
              </Group>
              <Group gap={6} mt="lg">
                <Badge color="teal" variant="light">
                  <IconArrowUpRight size={14} /> {kpi.diff}
                </Badge>
                <Text size="sm" c="dimmed">
                  vs last month
                </Text>
              </Group>
            </Card>
          ))}
        </SimpleGrid>

        <Card padding="xl" className="glass-panel" mb="xl">
          <Group justify="space-between" mb="lg">
            <div>
              <Title order={3}>Fraud & Trust Feed</Title>
              <Text size="sm" c="dimmed">
                Monitor duplicate scans and abnormal resale behaviors
              </Text>
            </div>
            <Badge color="red">2 Critical</Badge>
          </Group>

          <Table striped highlightOnHover verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>#</Table.Th>
                <Table.Th>Ticket</Table.Th>
                <Table.Th>Event</Table.Th>
                <Table.Th>Reason</Table.Th>
                <Table.Th>Scans</Table.Th>
                <Table.Th>Action</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {fraudRows.map((row, index) => (
                <Table.Tr key={row.ticket}>
                  <Table.Td>{index + 1}</Table.Td>
                  <Table.Td>
                    <Text ff="monospace">{row.ticket}</Text>
                  </Table.Td>
                  <Table.Td>{row.event}</Table.Td>
                  <Table.Td>
                    <Group gap={6}>
                      <IconAlertTriangle size={14} color="#ff8787" />
                      <Text size="sm">{row.reason}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>{row.scans || '—'}</Table.Td>
                  <Table.Td>
                    <Badge variant="light" color="orange" style={{ cursor: 'pointer' }}>
                      Review
                    </Badge>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      </div>

      <Card padding="xl" className="glass-panel" style={{ width: 360 }}>
        <Title order={4} mb="lg">
          Platform Health
        </Title>
        <Center>
          <RingProgress
            size={220}
            thickness={18}
            roundCaps
            sections={[
              { value: 88, color: 'teal' },
              { value: 8, color: 'yellow' },
              { value: 4, color: 'red' },
            ]}
            label={
              <div>
                <Text ta="center" fw={700} fz="xl">
                  88%
                </Text>
                <Text ta="center" size="sm" c="dimmed">
                  Valid scans
                </Text>
              </div>
            }
          />
        </Center>
        <Table mt="lg" verticalSpacing="sm">
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>Valid entries</Table.Td>
              <Table.Td align="right">
                <Badge color="teal" radius="sm">
                  18,420
                </Badge>
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>Offline sync</Table.Td>
              <Table.Td align="right">
                <Badge color="yellow" radius="sm">
                  1,024
                </Badge>
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>Flagged scans</Table.Td>
              <Table.Td align="right">
                <Badge color="red" radius="sm">
                  210
                </Badge>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Card>
    </Group>
  );
}
