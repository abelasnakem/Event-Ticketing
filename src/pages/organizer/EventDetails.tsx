import { ActionIcon, Badge, Button, Card, Group, Modal, Progress, Select, SimpleGrid, Stack, Table, Text, TextInput, Textarea, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconDeviceMobile, IconGift, IconLink, IconPlus, IconQrcode, IconShare3, IconUserPlus } from '@tabler/icons-react';
import copy from 'copy-to-clipboard';
import { QRCodeCanvas } from 'qrcode.react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import dayjs from 'dayjs';
import { getOrganizerEvent } from '../../data/organizerEvents';
import type { ScannerDevice } from '../../data/organizerEvents';

export default function EventDetails() {
  const { eventId = '' } = useParams();
  const event = getOrganizerEvent(eventId);
  const [scannerForm, setScannerForm] = useState({ label: '', phone: '' });
  const [scanners, setScanners] = useState<ScannerDevice[]>(event?.scanners ?? []);
  const [inviteOpened, inviteHandlers] = useDisclosure(false);
  const [giftRecipient, setGiftRecipient] = useState({ phone: '', message: 'Enjoy the show!' });
  const [giftTier, setGiftTier] = useState(event?.tickets[0]?.label ?? 'Regular');

  if (!event) {
    return (
      <Card padding="xl" className="glass-panel">
        <Title order={3}>Event not found</Title>
        <Text c="dimmed">The requested event could not be located.</Text>
      </Card>
    );
  }

  const totalSeats = event.tickets.reduce((sum, tier) => sum + tier.total, 0);
  const soldSeats = event.tickets.reduce((sum, tier) => sum + tier.sold, 0);
  const eventLink = event.link;

  const handleCopyLink = () => {
    copy(eventLink);
    notifications.show({ title: 'Link copied', message: 'Share it with fans or partners.', color: 'teal' });
  };

  const handleScannerAdd = () => {
    if (!scannerForm.label || !scannerForm.phone) {
      notifications.show({ title: 'Missing info', message: 'Provide device label and phone.', color: 'orange' });
      return;
    }
    const invitationCode = `${event.id.split('-').pop()?.slice(0, 3).toUpperCase()}${Math.random().toString(36).slice(-3).toUpperCase()}`;
    setScanners((current) => [
      ...current,
      {
        id: `scanner-${Date.now()}`,
        label: scannerForm.label,
        phone: scannerForm.phone,
        invitationCode,
        status: 'invited',
      },
    ]);
    setScannerForm({ label: '', phone: '' });
    notifications.show({
      title: 'Scanner invited',
      message: 'Send the invitation code to your staff member.',
      color: 'teal',
    });
  };

  const handleGiftSend = () => {
    if (!giftRecipient.phone) {
      notifications.show({ title: 'Phone required', message: 'Add the recipient phone number.', color: 'orange' });
      return;
    }
    notifications.show({
      title: 'Invitation sent',
      message: `Gifted ${giftTier} access to ${giftRecipient.phone}.`,
      color: 'teal',
      icon: <IconGift size={18} />,
    });
    inviteHandlers.close();
    setGiftRecipient({ phone: '', message: 'Enjoy the show!' });
  };

  return (
    <Stack gap="xl">
      <Group justify="space-between" align="flex-start">
        <div>
          <Title order={2}>{event.name}</Title>
          <Text c="dimmed">
            {dayjs(event.datetime).format('dddd, MMM D · h:mm A')} · {event.venue}, {event.city}
          </Text>
          <Group gap="sm" mt="sm">
            <Badge color={event.status === 'Published' ? 'teal' : event.status === 'Live' ? 'blue' : 'gray'} radius="sm">
              {event.status}
            </Badge>
            <Badge color="indigo" variant="light">
              {soldSeats.toLocaleString()} / {totalSeats.toLocaleString()} seats
            </Badge>
          </Group>
        </div>
        <Group gap="md">
          <Button variant="light" leftSection={<IconShare3 size={18} />} onClick={handleCopyLink}>
            Share link
          </Button>
          <Button color="nightfall" leftSection={<IconQrcode size={18} />} onClick={handleCopyLink}>
            Share QR
          </Button>
        </Group>
      </Group>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
        <Card padding="xl" className="glass-panel">
          <Group justify="space-between" mb="lg">
            <div>
              <Title order={4}>Smart link</Title>
              <Text size="sm" c="dimmed">
                Drop the link anywhere — resale, discovery, gifting.
              </Text>
            </div>
            <Group gap="xs">
              <ActionIcon variant="light" color="nightfall" onClick={handleCopyLink}>
                <IconLink size={18} />
              </ActionIcon>
              <ActionIcon
                variant="light"
                color="teal"
                onClick={() => {
                  if (typeof navigator !== 'undefined' && navigator.share) {
                    navigator.share({ title: event.name, url: eventLink }).catch(() => handleCopyLink());
                  } else {
                    handleCopyLink();
                  }
                }}
              >
                <IconShare3 size={18} />
              </ActionIcon>
            </Group>
          </Group>
          <TextInput value={eventLink} readOnly label="Public link" radius="md" />
        </Card>

        <Card padding="xl" className="glass-panel" style={{ textAlign: 'center' }}>
          <Title order={4} mb="md">
            Printable QR
          </Title>
          <QRCodeCanvas value={eventLink} size={180} bgColor="transparent" fgColor="#f5f6fa" />
          <Text size="sm" c="dimmed" mt="md">
            Gate staff can scan offline and sync later.
          </Text>
        </Card>
      </SimpleGrid>

      <Card padding="xl" className="glass-panel">
        <Group justify="space-between" mb="lg">
          <Title order={4}>Ticket tiers</Title>
          <Button variant="light" radius="lg" leftSection={<IconPlus size={16} />}>
            Add tier
          </Button>
        </Group>
        <Table verticalSpacing="md" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Tier</Table.Th>
              <Table.Th>Price</Table.Th>
              <Table.Th>Inventory</Table.Th>
              <Table.Th>Fill</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {event.tickets.map((tier) => {
              const progress = Math.round((tier.sold / tier.total) * 100);
              return (
                <Table.Tr key={tier.id}>
                  <Table.Td>
                    <Text fw={600}>{tier.label}</Text>
                  </Table.Td>
                  <Table.Td>{tier.price.toLocaleString()} ETB</Table.Td>
                  <Table.Td>
                    {tier.sold.toLocaleString()} / {tier.total.toLocaleString()}
                  </Table.Td>
                  <Table.Td>
                    <Progress value={progress} color={progress > 80 ? 'teal' : 'yellow'} radius="xl" />
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Card>

      <Card padding="xl" className="glass-panel" id="scanners-section">
        <Group justify="space-between" mb="lg">
          <div>
            <Title order={4}>Scanner devices</Title>
            <Text size="sm" c="dimmed">
              Add phone numbers — they receive a one-time invitation code.
            </Text>
          </div>
          <Badge color="nightfall" variant="light">
            {scanners.length} devices linked
          </Badge>
        </Group>

        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg" mb="lg">
          <TextInput
            label="Device label"
            placeholder="VIP Gate"
            value={scannerForm.label}
            onChange={(event) => setScannerForm((curr) => ({ ...curr, label: event.currentTarget.value }))}
          />
          <TextInput
            label="Phone number"
            placeholder="+2519..."
            value={scannerForm.phone}
            onChange={(event) => setScannerForm((curr) => ({ ...curr, phone: event.currentTarget.value }))}
          />
          <Button mt={{ base: 'xl', md: 24 }} leftSection={<IconDeviceMobile size={18} />} onClick={handleScannerAdd}>
            Invite device
          </Button>
        </SimpleGrid>

        <Table verticalSpacing="md" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Label</Table.Th>
              <Table.Th>Phone</Table.Th>
              <Table.Th>Invitation code</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {scanners.map((device) => (
              <Table.Tr key={device.id}>
                <Table.Td>{device.label}</Table.Td>
                <Table.Td>{device.phone}</Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <Text fw={600}>{device.invitationCode}</Text>
                    <ActionIcon variant="subtle" onClick={() => copy(device.invitationCode)}>
                      <IconLink size={16} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Badge color={device.status === 'active' ? 'teal' : 'yellow'}>{device.status}</Badge>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>

      <Card padding="xl" className="glass-panel">
        <Group justify="space-between" mb="lg">
          <div>
            <Title order={4}>Send invitation / gift</Title>
            <Text size="sm" c="dimmed">
              Surprise partners or VIPs with instant tickets via SMS link.
            </Text>
          </div>
          <Button radius="lg" leftSection={<IconUserPlus size={18} />} onClick={inviteHandlers.open}>
            Gift ticket
          </Button>
        </Group>
      </Card>

      <Modal opened={inviteOpened} onClose={inviteHandlers.close} title="Gift a ticket" centered>
        <Stack>
          <TextInput
            label="Recipient phone"
            placeholder="+251..."
            value={giftRecipient.phone}
            onChange={(event) => setGiftRecipient((curr) => ({ ...curr, phone: event.currentTarget.value }))}
          />
          <Select
            label="Ticket tier"
            data={event.tickets.map((tier) => tier.label)}
            value={giftTier}
            onChange={(value) => value && setGiftTier(value)}
          />
          <Textarea
            label="Message"
            value={giftRecipient.message}
            onChange={(event) => setGiftRecipient((curr) => ({ ...curr, message: event.currentTarget.value }))}
          />
          <Button leftSection={<IconGift size={18} />} onClick={handleGiftSend}>
            Send invitation
          </Button>
        </Stack>
      </Modal>
    </Stack>
  );
}
