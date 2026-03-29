import { ActionIcon, Badge, Button, Card, Group, Modal, Paper, Progress, SegmentedControl, Select, SimpleGrid, Stack, Table, Text, TextInput, Textarea, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconDeviceMobile, IconGift, IconLink, IconPlus, IconQrcode, IconShare3, IconUserPlus } from '@tabler/icons-react';
import copy from 'copy-to-clipboard';
import { QRCodeCanvas } from 'qrcode.react';
import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import dayjs from 'dayjs';
import { getOrganizerEvent } from '../../data/organizerEvents';
import type { ScannerDevice } from '../../data/organizerEvents';
import { toPng } from 'html-to-image';

export default function EventDetails() {
  const { eventId = '' } = useParams();
  const event = getOrganizerEvent(eventId);
  const [scannerForm, setScannerForm] = useState({ label: '', phone: '' });
  const [scanners, setScanners] = useState<ScannerDevice[]>(event?.scanners ?? []);
  const [inviteOpened, inviteHandlers] = useDisclosure(false);
  const [giftRecipient, setGiftRecipient] = useState({ phone: '', message: 'Enjoy the show!' });
  const [giftTier, setGiftTier] = useState(event?.tickets[0]?.label ?? 'Regular');
  const [shareOrientation, setShareOrientation] = useState<'landscape' | 'portrait'>('landscape');
  const shareCardRef = useRef<HTMLDivElement | null>(null);
  const qrCanvasWrapperRef = useRef<HTMLDivElement | null>(null);

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

  const handleDownloadShareCard = async () => {
    if (!shareCardRef.current) return;
    try {
      const dataUrl = await toPng(shareCardRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${event.id}-${shareOrientation}-card.png`;
      link.click();
    } catch (error) {
      notifications.show({ title: 'Unable to export card', message: 'Retry or try another browser.', color: 'red' });
    }
  };

  const handleDownloadQr = () => {
    const canvas = qrCanvasWrapperRef.current?.querySelector('canvas') as HTMLCanvasElement | null;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${event.id}-qr.png`;
    link.click();
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
          <Group justify="space-between" mb="lg" align="flex-start">
            <div>
              <Title order={4}>Social share card</Title>
              <Text size="sm" c="dimmed">
                Download a landscape or portrait PNG with QR + artwork.
              </Text>
            </div>
            <SegmentedControl
              value={shareOrientation}
              onChange={(value) => setShareOrientation(value as 'landscape' | 'portrait')}
              data={[{ label: 'Landscape', value: 'landscape' }, { label: 'Portrait', value: 'portrait' }]}
            />
          </Group>
          <Paper
            ref={shareCardRef}
            shadow="xl"
            radius="lg"
            p={shareOrientation === 'landscape' ? 'lg' : 'md'}
            style={{
              background: '#05060f',
              color: '#fff',
              display: shareOrientation === 'landscape' ? 'flex' : 'block',
              gap: 16,
              maxWidth: shareOrientation === 'landscape' ? 540 : 320,
              marginInline: 'auto',
            }}
          >
            <div
              style={{
                flex: 1,
                borderRadius: 16,
                backgroundImage: `url(${event.bannerUrl ?? 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: shareOrientation === 'landscape' ? 180 : 140,
              }}
            />
            <Stack gap="sm" style={{ flex: shareOrientation === 'landscape' ? 0.8 : undefined }}>
              <Text size="sm" c="dimmed">
                Digis presents
              </Text>
              <Text fw={700} fz="lg" style={{ lineHeight: 1.2 }}>
                {event.name}
              </Text>
              <Text size="sm" c="dimmed">
                {dayjs(event.datetime).format('MMM D, YYYY · h:mm A')}
              </Text>
              <Text size="sm">{event.venue}, {event.city}</Text>
              <div style={{ alignSelf: shareOrientation === 'landscape' ? 'flex-start' : 'center' }}>
                <QRCodeCanvas value={eventLink} size={shareOrientation === 'landscape' ? 120 : 150} bgColor="transparent" fgColor="#fff" />
                <Text size="xs" c="dimmed" ta="center">
                  Scan to claim
                </Text>
              </div>
            </Stack>
          </Paper>
          <Group mt="lg" justify="flex-end">
            <Button variant="light" leftSection={<IconLink size={16} />} onClick={handleCopyLink}>
              Copy link
            </Button>
            <Button color="nightfall" leftSection={<IconQrcode size={16} />} onClick={handleDownloadShareCard}>
              Download PNG
            </Button>
          </Group>
        </Card>

        <Card padding="xl" className="glass-panel">
          <Group justify="space-between" mb="lg" align="flex-start">
            <div>
              <Title order={4}>Smart link & QR</Title>
              <Text size="sm" c="dimmed">
                Send the link or print the QR for venues.
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
          <TextInput value={eventLink} readOnly label="Public link" radius="md" mb="md" />
          <div ref={qrCanvasWrapperRef} style={{ textAlign: 'center' }}>
            <QRCodeCanvas value={eventLink} size={200} bgColor="transparent" fgColor="#f5f6fa" />
            <Text size="sm" c="dimmed" mt="md">
              Gate staff can scan offline and sync later.
            </Text>
          </div>
          <Group mt="lg" justify="center">
            <Button variant="light" onClick={handleDownloadQr} leftSection={<IconQrcode size={16} />}>
              Download QR PNG
            </Button>
          </Group>
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
              <Table.Th>#</Table.Th>
              <Table.Th>Tier</Table.Th>
              <Table.Th>Price</Table.Th>
              <Table.Th>Inventory</Table.Th>
              <Table.Th>Fill</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {event.tickets.map((tier, index) => {
              const progress = Math.round((tier.sold / tier.total) * 100);
              return (
                <Table.Tr key={tier.id}>
                  <Table.Td>{index + 1}</Table.Td>
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
              <Table.Th>#</Table.Th>
              <Table.Th>Label</Table.Th>
              <Table.Th>Phone</Table.Th>
              <Table.Th>Invitation code</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {scanners.map((device, index) => (
              <Table.Tr key={device.id}>
                <Table.Td>{index + 1}</Table.Td>
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
