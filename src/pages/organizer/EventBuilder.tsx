import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Group,
  Image,
  NumberInput,
  Paper,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  TextInput,
  Textarea,
  ThemeIcon,
  Title,
  useComputedColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconKey,
  IconLock,
  IconPlus,
  IconTicket,
  IconTrash,
  IconUser,
  IconUsers,
  IconWorld,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type EntryType = 'ticketed' | 'rsvp' | 'free' | 'invite';

type TicketType = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  salesStart: string;
  salesEnd: string;
  maxPerPerson: number | '';
};

type InviteCode = {
  id: string;
  code: string;
  label: string;
  usage: 'unlimited' | 'single' | 'limited';
  limitCount: number | '';
  expires: boolean;
  expiryDate: string;
};

type GuestInvite = {
  id: string;
  name: string;
  contact: string;
  link: string;
  allowedGuests: 'solo' | 'plus1' | 'plus2' | 'plus3' | 'plusN';
  customGuests: number | '';
};

const steps = [
  { title: 'Event Type', description: 'Pick how people enter', nextLabel: 'Next: Event Details' },
  { title: 'Event Details', description: 'Describe the experience', nextLabel: 'Next: Entry Settings' },
  { title: 'Entry Settings', description: 'Configure entry rules', nextLabel: 'Review' },
  { title: 'Review & Publish', description: 'Confirm before launch', nextLabel: '' },
];

const entryOptions = [
  {
    id: 'ticketed',
    title: 'Ticketed',
    description: 'Paid entry - sell General, VIP, VVIP tiers',
    icon: IconTicket,
    active: true,
  },
  {
    id: 'rsvp',
    title: 'RSVP',
    description: 'Free registration, optional approval queue',
    icon: IconUsers,
    active: true,
  },
  {
    id: 'free',
    title: 'Free Entry',
    description: 'No tickets, no registration - just show up',
    icon: IconWorld,
    active: false,
  },
  {
    id: 'invite',
    title: 'Invite Only',
    description: 'Code-gated or curated guest list access',
    icon: IconLock,
    active: true,
  },
];

const visibilityOptions = [
  {
    id: 'public',
    title: 'Public',
    description: 'Listed on the browse page, anyone can find it',
    icon: IconWorld,
  },
  {
    id: 'private',
    title: 'Private',
    description: 'Hidden from browse - share the direct link yourself',
    icon: IconLock,
  },
];

function formatDate(date: string) {
  if (!date) return 'Date TBD';
  try {
    return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(date));
  } catch {
    return date;
  }
}

export default function EventBuilder() {
  const theme = useMantineTheme();
  const scheme = useComputedColorScheme('dark');
  const isDark = scheme === 'dark';
  const surface = isDark ? 'rgba(255, 255, 255, 0.03)' : '#ffffff';
  const muted = isDark ? 'rgba(255, 255, 255, 0.06)' : '#eef2ff';
  const border = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(13, 18, 54, 0.08)';
  const accent = theme.colors.nightfall[4];
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [entryType, setEntryType] = useState<EntryType>('ticketed');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [rsvpCapacity, setRsvpCapacity] = useState<number | ''>('');
  const [rsvpApproval, setRsvpApproval] = useState<'auto' | 'manual'>('auto');
  const [invitePricing, setInvitePricing] = useState<'free' | 'paid'>('free');
  const [inviteCodesEnabled, setInviteCodesEnabled] = useState(false);
  const [guestListEnabled, setGuestListEnabled] = useState(false);
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([
    {
      id: 'code-1',
      code: '',
      label: '',
      usage: 'unlimited',
      limitCount: '',
      expires: false,
      expiryDate: '',
    },
  ]);
  const [guestList, setGuestList] = useState<GuestInvite[]>([
    {
      id: 'guest-1',
      name: '',
      contact: '',
      link: '',
      allowedGuests: 'solo',
      customGuests: '',
    },
  ]);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([
    {
      id: 'ticket-1',
      name: 'General Admission',
      price: 500,
      quantity: 100,
      description: '',
      salesStart: '',
      salesEnd: '',
      maxPerPerson: '',
    },
  ]);

  const form = useForm({
    initialValues: {
      name: 'Addis Jazz Festival 2026',
      description: '',
      date: '',
      startTime: '19:00',
      endDate: '',
      endTime: '',
      venue: 'Millennium Hall, Addis Ababa',
      onlineLink: '',
      bannerUrl: '',
    },
  });

  const totals = useMemo(() => {
    const capacity = ticketTypes.reduce((sum, ticket) => sum + (ticket.quantity || 0), 0);
    const revenue = ticketTypes.reduce((sum, ticket) => sum + (ticket.quantity || 0) * (ticket.price || 0), 0);
    return { capacity, revenue };
  }, [ticketTypes]);

  const numberFormat = new Intl.NumberFormat('en-US');
  const isFinalStep = step === steps.length - 1;
  const isTicketed = entryType === 'ticketed';
  const isRsvp = entryType === 'rsvp';
  const isInviteOnly = entryType === 'invite';
  const entryTypeLabel: Record<EntryType, string> = {
    ticketed: 'Ticketed',
    rsvp: 'RSVP',
    free: 'Free Entry',
    invite: 'Invite Only',
  };

  const updateTicketType = (index: number, patch: Partial<TicketType>) => {
    setTicketTypes((current) => {
      const draft = [...current];
      draft[index] = { ...draft[index], ...patch };
      return draft;
    });
  };

  const removeTicketType = (index: number) => {
    setTicketTypes((current) => current.filter((_, idx) => idx !== index));
  };

  const addTicketType = () => {
    setTicketTypes((current) => [
      ...current,
      {
        id: `ticket-${Date.now()}`,
        name: 'New Ticket',
        price: 0,
        quantity: 0,
        description: '',
        salesStart: '',
        salesEnd: '',
        maxPerPerson: '',
      },
    ]);
  };

  const updateInviteCode = (index: number, patch: Partial<InviteCode>) => {
    setInviteCodes((current) => {
      const draft = [...current];
      draft[index] = { ...draft[index], ...patch };
      return draft;
    });
  };

  const addInviteCode = () => {
    setInviteCodes((current) => [
      ...current,
      {
        id: `code-${Date.now()}`,
        code: '',
        label: '',
        usage: 'unlimited',
        limitCount: '',
        expires: false,
        expiryDate: '',
      },
    ]);
  };

  const updateGuestInvite = (index: number, patch: Partial<GuestInvite>) => {
    setGuestList((current) => {
      const draft = [...current];
      draft[index] = { ...draft[index], ...patch };
      return draft;
    });
  };

  const addGuestInvite = () => {
    setGuestList((current) => [
      ...current,
      {
        id: `guest-${Date.now()}`,
        name: '',
        contact: '',
        link: '',
        allowedGuests: 'solo',
        customGuests: '',
      },
    ]);
  };

  const handlePublish = () => {
    const publishMessage = isTicketed
      ? 'Your ticketed event is now live for attendees.'
      : isRsvp
        ? 'Your RSVP event is now open for registrations.'
        : isInviteOnly
          ? 'Your invite-only event is ready. Share invites to start access.'
        : 'Your event is now live.';

    notifications.show({
      title: 'Event published',
      message: publishMessage,
      color: 'nightfall',
      icon: <IconCheck size={18} />,
    });
    navigate('/organizer');
  };

  const handleDraft = () => {
    notifications.show({
      title: 'Draft saved',
      message: 'You can return to finish publishing any time.',
      color: 'nightfall',
      icon: <IconCheck size={18} />,
    });
    navigate('/organizer');
  };

  return (
    <Container size={1100}>
      <Stack gap="xl">
        <Box>
          <Title order={2}>Create Event</Title>
          <Text size="sm" c="dimmed">
            You are minutes away from reaching your audience.
          </Text>
        </Box>

      <Paper radius="xl" p="md" className="glass-panel" style={{ overflowX: 'auto' }}>
        <Group wrap="nowrap" gap="md" align="center">
          {steps.map((item, index) => {
            const isActive = index === step;
            const isComplete = index < step;
            const circleBg = isComplete ? accent : isActive ? theme.colors.nightfall[5] : muted;
            const circleColor = isComplete || isActive ? theme.black : theme.colors.gray[4];
            const lineColor = isComplete ? accent : border;

            return (
              <Group key={item.title} wrap="nowrap" gap="sm" style={{ flex: 1, minWidth: 180 }}>
                <ThemeIcon radius="xl" size={32} style={{ backgroundColor: circleBg, color: circleColor }}>
                  {isComplete ? <IconCheck size={16} /> : <Text fw={700}>{index + 1}</Text>}
                </ThemeIcon>
                <Box>
                  <Text size="xs" fw={700} c={isActive ? undefined : 'dimmed'}>
                    Step {index + 1}
                  </Text>
                  <Text size="sm" fw={600} c={isActive ? undefined : 'dimmed'}>
                    {item.title}
                  </Text>
                </Box>
                {index < steps.length - 1 ? (
                  <Box style={{ flex: 1, height: 2, backgroundColor: lineColor, marginLeft: 8 }} />
                ) : null}
              </Group>
            );
          })}
        </Group>
      </Paper>

      {step === 0 && (
        <Card radius="xl" padding="xl" className="glass-panel">
          <Stack gap="lg">
            <div>
              <Title order={4}>How do people get in?</Title>
              <Text size="sm" c="dimmed">
                Choose the entry model for your event.
              </Text>
            </div>
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
              {entryOptions.map((option) => {
                const isSelected = entryType === option.id;
                const disabled = !option.active;
                return (
                  <Paper
                    key={option.id}
                    withBorder
                    radius="lg"
                    p="md"
                    onClick={() => {
                      if (!option.active) {
                        notifications.show({
                          title: 'Coming soon',
                          message: 'This flow is coming next.',
                          color: 'yellow',
                        });
                        return;
                      }
                      setEntryType(option.id as typeof entryType);
                    }}
                    style={{
                      cursor: disabled ? 'not-allowed' : 'pointer',
                      borderColor: isSelected ? accent : border,
                      backgroundColor: isSelected ? 'rgba(234, 255, 0, 0.12)' : surface,
                      opacity: disabled ? 0.6 : 1,
                      transition: 'all 150ms ease',
                    }}
                  >
                    <Group gap="md" wrap="nowrap" align="flex-start">
                      <ThemeIcon
                        radius="md"
                        size={40}
                        color="nightfall"
                        variant={isSelected ? 'filled' : 'light'}
                        styles={{ root: { color: isSelected ? theme.black : undefined } }}
                      >
                        <option.icon size={18} />
                      </ThemeIcon>
                      <Box>
                        <Text fw={700}>{option.title}</Text>
                        <Text size="sm" c="dimmed">
                          {option.description}
                        </Text>
                        {!option.active ? (
                          <Badge mt="xs" color="gray" variant="light">
                            Coming soon
                          </Badge>
                        ) : null}
                      </Box>
                    </Group>
                  </Paper>
                );
              })}
            </SimpleGrid>

            <Divider color={border} />

            <div>
              <Title order={5}>Who can discover this event?</Title>
              <Text size="sm" c="dimmed">
                Controls whether it appears in the browse page.
              </Text>
            </div>
            <Stack gap="sm">
              {visibilityOptions.map((option) => {
                const isSelected = visibility === option.id;
                return (
                  <Paper
                    key={option.id}
                    withBorder
                    radius="lg"
                    p="md"
                    onClick={() => setVisibility(option.id as typeof visibility)}
                    style={{
                      cursor: 'pointer',
                      borderColor: isSelected ? accent : border,
                      backgroundColor: isSelected ? 'rgba(234, 255, 0, 0.12)' : surface,
                      transition: 'all 150ms ease',
                    }}
                  >
                    <Group justify="space-between" align="center">
                      <Group gap="md" wrap="nowrap">
                        <ThemeIcon
                          radius="md"
                          size={36}
                          color="nightfall"
                          variant={isSelected ? 'filled' : 'light'}
                          styles={{ root: { color: isSelected ? theme.black : undefined } }}
                        >
                          <option.icon size={16} />
                        </ThemeIcon>
                        <Box>
                          <Text fw={700}>{option.title}</Text>
                          <Text size="sm" c="dimmed">
                            {option.description}
                          </Text>
                        </Box>
                      </Group>
                      {isSelected ? <IconCheck size={18} /> : null}
                    </Group>
                  </Paper>
                );
              })}
            </Stack>
          </Stack>
        </Card>
      )}

      {step === 1 && (
        <Card radius="xl" padding="xl" className="glass-panel">
          <Stack gap="lg">
            <Group gap="sm">
              <Badge color="nightfall" variant="light">
                {entryTypeLabel[entryType]}
              </Badge>
              <Badge color="gray" variant="light">
                {visibility === 'public' ? 'Public' : 'Private'}
              </Badge>
            </Group>

            <TextInput
              label="Event Name"
              placeholder="e.g. Addis Jazz Festival 2026"
              required
              {...form.getInputProps('name')}
            />
            <Textarea
              label="Description"
              placeholder="Tell people what to expect at your event..."
              minRows={4}
              {...form.getInputProps('description')}
            />
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
              <TextInput label="Date" type="date" required {...form.getInputProps('date')} />
              <TextInput label="Start Time" type="time" required {...form.getInputProps('startTime')} />
            </SimpleGrid>
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
              <TextInput label="End Date (optional)" type="date" {...form.getInputProps('endDate')} />
              <TextInput label="End Time (optional)" type="time" {...form.getInputProps('endTime')} />
            </SimpleGrid>
            <TextInput
              label="Venue / Location"
              placeholder="e.g. Millennium Hall, Addis Ababa"
              required
              {...form.getInputProps('venue')}
            />
            <TextInput
              label="Online Link (optional)"
              placeholder="https://zoom.us/..."
              {...form.getInputProps('onlineLink')}
            />
            <TextInput
              label="Banner Image URL"
              placeholder="https://..."
              {...form.getInputProps('bannerUrl')}
            />
          </Stack>
        </Card>
      )}

      {step === 2 && (
        <Stack gap="xl">
          {isTicketed && (
            <Card radius="xl" padding="xl" className="glass-panel">
              <Group justify="space-between" align="center" mb="md">
                <div>
                  <Title order={4}>Ticket Types</Title>
                  <Text size="sm" c="dimmed">
                    Add General, VIP, VVIP or any custom tier.
                  </Text>
                </div>
                <Button variant="light" radius="lg" leftSection={<IconPlus size={16} />} onClick={addTicketType}>
                  Add another ticket type
                </Button>
              </Group>

              <Stack gap="lg">
                {ticketTypes.map((ticketType, index) => (
                  <Card key={ticketType.id} radius="lg" padding="lg" style={{ backgroundColor: surface, border: `1px solid ${border}` }}>
                    <Group justify="space-between" align="center" mb="sm">
                      <Text fw={700}>Ticket Type {index + 1}</Text>
                      {ticketTypes.length > 1 ? (
                        <ActionIcon color="red" variant="subtle" onClick={() => removeTicketType(index)}>
                          <IconTrash size={16} />
                        </ActionIcon>
                      ) : null}
                    </Group>
                    <TextInput
                      label="Name"
                      placeholder="General Admission"
                      value={ticketType.name}
                      onChange={(event) => updateTicketType(index, { name: event.currentTarget.value })}
                    />
                    <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md" mt="md">
                      <NumberInput
                        label="Price (ETB)"
                        value={ticketType.price}
                        min={0}
                        thousandSeparator=","
                        onChange={(value) => updateTicketType(index, { price: Number(value) || 0 })}
                      />
                      <NumberInput
                        label="Quantity"
                        value={ticketType.quantity}
                        min={0}
                        onChange={(value) => updateTicketType(index, { quantity: Number(value) || 0 })}
                      />
                      <Box>
                        <Text size="xs" fw={700} c="dimmed" mb={6}>
                          Revenue
                        </Text>
                        <Text fw={700} size="sm">
                          {numberFormat.format((ticketType.quantity || 0) * (ticketType.price || 0))} ETB
                        </Text>
                      </Box>
                    </SimpleGrid>
                    <Textarea
                      mt="md"
                      label="Description (optional)"
                      placeholder="What is included?"
                      minRows={2}
                      value={ticketType.description}
                      onChange={(event) => updateTicketType(index, { description: event.currentTarget.value })}
                    />
                    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md" mt="md">
                      <TextInput
                        label="Sales start (optional)"
                        type="datetime-local"
                        value={ticketType.salesStart}
                        onChange={(event) => updateTicketType(index, { salesStart: event.currentTarget.value })}
                      />
                      <TextInput
                        label="Sales end (optional)"
                        type="datetime-local"
                        value={ticketType.salesEnd}
                        onChange={(event) => updateTicketType(index, { salesEnd: event.currentTarget.value })}
                      />
                    </SimpleGrid>
                    <NumberInput
                      mt="md"
                      label="Max tickets per person (optional)"
                      placeholder="No limit"
                      min={1}
                      value={ticketType.maxPerPerson}
                      onChange={(value) => updateTicketType(index, { maxPerPerson: value === '' ? '' : Number(value) })}
                    />
                  </Card>
                ))}
              </Stack>
            </Card>
          )}

          {isRsvp && (
            <Card radius="xl" padding="xl" className="glass-panel">
              <Stack gap="lg">
                <div>
                  <Title order={4}>RSVP Settings</Title>
                  <Text size="sm" c="dimmed">
                    People register for free; you track attendees.
                  </Text>
                </div>
                <Paper radius="lg" p="lg" style={{ backgroundColor: surface, border: `1px solid ${border}` }}>
                  <Stack gap="md">
                    <NumberInput
                      label="Capacity (optional)"
                      placeholder="Leave blank for unlimited"
                      min={1}
                      value={rsvpCapacity}
                      onChange={(value) => setRsvpCapacity(value === '' ? '' : Number(value))}
                    />
                    <Text size="xs" c="dimmed">
                      Extra RSVPs will be automatically waitlisted.
                    </Text>
                    <Divider color={border} />
                    <Text size="sm" fw={600}>
                      Approval
                    </Text>
                    <SegmentedControl
                      fullWidth
                      radius="lg"
                      value={rsvpApproval}
                      onChange={(value) => setRsvpApproval(value as 'auto' | 'manual')}
                      data={[
                        { label: 'Auto-approve', value: 'auto' },
                        { label: 'Require approval', value: 'manual' },
                      ]}
                    />
                    <Text size="xs" c="dimmed">
                      {rsvpApproval === 'auto'
                        ? 'RSVPs are confirmed instantly (up to capacity).'
                        : 'Each RSVP waits in a pending queue until you approve or reject it.'}
                    </Text>
                  </Stack>
                </Paper>
              </Stack>
            </Card>
          )}

          {isInviteOnly && (
            <Card radius="xl" padding="xl" className="glass-panel">
              <Stack gap="lg">
                <div>
                  <Title order={4}>Access Control</Title>
                  <Text size="sm" c="dimmed">
                    Choose how you want to restrict entry - use one or both methods below.
                  </Text>
                </div>

                <Paper radius="lg" p="lg" style={{ backgroundColor: surface, border: `1px solid ${border}` }}>
                  <Stack gap="md">
                    <Text size="sm" fw={600}>
                      Entry pricing
                    </Text>
                    <Text size="xs" c="dimmed">
                      How will invited guests attend?
                    </Text>
                    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                      {[
                        { id: 'free', title: 'Free', description: 'RSVP - no payment' },
                        { id: 'paid', title: 'Paid', description: 'Sell ticket tiers' },
                      ].map((option) => {
                        const selected = invitePricing === option.id;
                        return (
                          <Paper
                            key={option.id}
                            radius="lg"
                            p="md"
                            withBorder
                            onClick={() => setInvitePricing(option.id as 'free' | 'paid')}
                            style={{
                              cursor: 'pointer',
                              borderColor: selected ? accent : border,
                              backgroundColor: selected ? 'rgba(234, 255, 0, 0.12)' : surface,
                              transition: 'all 150ms ease',
                            }}
                          >
                            <Group wrap="nowrap" gap="md" align="flex-start">
                              <ThemeIcon
                                radius="xl"
                                size={28}
                                color="nightfall"
                                variant={selected ? 'filled' : 'light'}
                                styles={{ root: { color: selected ? theme.black : undefined } }}
                              >
                                {option.id === 'free' ? <IconUsers size={14} /> : <IconTicket size={14} />}
                              </ThemeIcon>
                              <Box>
                                <Text fw={600}>{option.title}</Text>
                                <Text size="xs" c="dimmed">
                                  {option.description}
                                </Text>
                              </Box>
                            </Group>
                          </Paper>
                        );
                      })}
                    </SimpleGrid>

                    {invitePricing === 'paid' && (
                      <Stack gap="md">
                        {ticketTypes.map((ticketType, index) => (
                          <Paper key={ticketType.id} radius="lg" p="md" style={{ backgroundColor: muted, border: `1px solid ${border}` }}>
                            <Text size="sm" fw={600} mb="sm">
                              Tier {index + 1}
                            </Text>
                            <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
                              <TextInput
                                label="Name"
                                placeholder="General Admission"
                                value={ticketType.name}
                                onChange={(event) => updateTicketType(index, { name: event.currentTarget.value })}
                              />
                              <NumberInput
                                label="Price (ETB)"
                                value={ticketType.price}
                                min={0}
                                thousandSeparator="," 
                                onChange={(value) => updateTicketType(index, { price: Number(value) || 0 })}
                              />
                              <NumberInput
                                label="Qty"
                                value={ticketType.quantity}
                                min={0}
                                onChange={(value) => updateTicketType(index, { quantity: Number(value) || 0 })}
                              />
                            </SimpleGrid>
                          </Paper>
                        ))}
                        <Button variant="light" radius="lg" leftSection={<IconPlus size={16} />} onClick={addTicketType}>
                          Add tier
                        </Button>
                      </Stack>
                    )}
                  </Stack>
                </Paper>

                <Paper radius="lg" p="lg" style={{ backgroundColor: surface, border: `1px solid ${border}` }}>
                  <Group justify="space-between" align="flex-start" mb="sm">
                    <Group gap="sm">
                      <ThemeIcon radius="xl" size={32} color="nightfall" variant="light">
                        <IconKey size={16} />
                      </ThemeIcon>
                      <Box>
                        <Text fw={600}>Invite Codes</Text>
                        <Text size="xs" c="dimmed">
                          Share codes - single-use, multi-use, or with expiry
                        </Text>
                      </Box>
                    </Group>
                    <Switch checked={inviteCodesEnabled} onChange={(event) => setInviteCodesEnabled(event.currentTarget.checked)} color="nightfall" />
                  </Group>

                  {inviteCodesEnabled && (
                    <Stack gap="md">
                      {inviteCodes.map((code, index) => (
                        <Paper key={code.id} radius="lg" p="md" style={{ backgroundColor: muted, border: `1px solid ${border}` }}>
                          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                            <TextInput
                              label="Code"
                              placeholder="e.g. ADDIS2026"
                              value={code.code}
                              onChange={(event) => updateInviteCode(index, { code: event.currentTarget.value })}
                            />
                            <TextInput
                              label="Label (optional)"
                              placeholder="e.g. VIP Access"
                              value={code.label}
                              onChange={(event) => updateInviteCode(index, { label: event.currentTarget.value })}
                            />
                          </SimpleGrid>
                          <Text size="xs" c="dimmed" mt="sm">
                            Uses
                          </Text>
                          <SegmentedControl
                            fullWidth
                            radius="lg"
                            value={code.usage}
                            onChange={(value) => updateInviteCode(index, { usage: value as InviteCode['usage'] })}
                            data={[
                              { label: 'Unlimited', value: 'unlimited' },
                              { label: 'Single-use', value: 'single' },
                              { label: 'Limited', value: 'limited' },
                            ]}
                          />
                          {code.usage === 'limited' && (
                            <NumberInput
                              mt="sm"
                              label="Limit"
                              placeholder="Set number of uses"
                              min={1}
                              value={code.limitCount}
                              onChange={(value) => updateInviteCode(index, { limitCount: value === '' ? '' : Number(value) })}
                            />
                          )}
                          <Group justify="space-between" align="center" mt="md">
                            <Text size="xs" c="dimmed">
                              Expiration date
                            </Text>
                            <Switch checked={code.expires} onChange={(event) => updateInviteCode(index, { expires: event.currentTarget.checked })} color="nightfall" />
                          </Group>
                          {code.expires && (
                            <TextInput
                              mt="sm"
                              type="date"
                              value={code.expiryDate}
                              onChange={(event) => updateInviteCode(index, { expiryDate: event.currentTarget.value })}
                            />
                          )}
                        </Paper>
                      ))}
                      <Button variant="light" radius="lg" leftSection={<IconPlus size={16} />} onClick={addInviteCode}>
                        Add code
                      </Button>
                    </Stack>
                  )}
                </Paper>

                <Paper radius="lg" p="lg" style={{ backgroundColor: surface, border: `1px solid ${border}` }}>
                  <Group justify="space-between" align="flex-start" mb="sm">
                    <Group gap="sm">
                      <ThemeIcon radius="xl" size={32} color="nightfall" variant="light">
                        <IconUser size={16} />
                      </ThemeIcon>
                      <Box>
                        <Text fw={600}>Guest List</Text>
                        <Text size="xs" c="dimmed">
                          Pre-add VIPs by name, phone, or email with optional personal links
                        </Text>
                      </Box>
                    </Group>
                    <Switch checked={guestListEnabled} onChange={(event) => setGuestListEnabled(event.currentTarget.checked)} color="nightfall" />
                  </Group>

                  {guestListEnabled && (
                    <Stack gap="md">
                      {guestList.map((guest, index) => (
                        <Paper key={guest.id} radius="lg" p="md" style={{ backgroundColor: muted, border: `1px solid ${border}` }}>
                          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                            <TextInput
                              label="Name (optional)"
                              placeholder="Biruk Tadesse"
                              value={guest.name}
                              onChange={(event) => updateGuestInvite(index, { name: event.currentTarget.value })}
                            />
                            <TextInput
                              label="Phone or Email"
                              placeholder="+251... or email@..."
                              value={guest.contact}
                              onChange={(event) => updateGuestInvite(index, { contact: event.currentTarget.value })}
                            />
                          </SimpleGrid>
                          <TextInput
                            mt="md"
                            label="Personalized link (optional, auto-generated if left blank)"
                            placeholder="ticket.et/g/..."
                            value={guest.link}
                            onChange={(event) => updateGuestInvite(index, { link: event.currentTarget.value })}
                          />
                          <Text size="xs" c="dimmed" mt="sm">
                            Allowed guests
                          </Text>
                          <SegmentedControl
                            fullWidth
                            radius="lg"
                            value={guest.allowedGuests}
                            onChange={(value) => updateGuestInvite(index, { allowedGuests: value as GuestInvite['allowedGuests'] })}
                            data={[
                              { label: 'Solo', value: 'solo' },
                              { label: '+1', value: 'plus1' },
                              { label: '+2', value: 'plus2' },
                              { label: '+3', value: 'plus3' },
                              { label: '+N', value: 'plusN' },
                            ]}
                          />
                          {guest.allowedGuests === 'plusN' && (
                            <NumberInput
                              mt="sm"
                              label="Custom guest count"
                              placeholder="Enter amount"
                              min={1}
                              value={guest.customGuests}
                              onChange={(value) => updateGuestInvite(index, { customGuests: value === '' ? '' : Number(value) })}
                            />
                          )}
                        </Paper>
                      ))}
                      <Group justify="space-between">
                        <Button variant="light" radius="lg" leftSection={<IconPlus size={16} />} onClick={addGuestInvite}>
                          Add guest
                        </Button>
                        <Button variant="subtle" color="gray">
                          Upload CSV
                        </Button>
                      </Group>
                    </Stack>
                  )}
                </Paper>
              </Stack>
            </Card>
          )}
        </Stack>
      )}

      {step === 3 && (
        <Stack gap="xl">
          <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="xl">
            <Card radius="xl" padding="xl" className="glass-panel">
              <Group justify="space-between" align="flex-start" mb="md">
                <Stack gap={4}>
                  <Group gap="sm">
                    <Badge color="nightfall" variant="light">
                      {entryTypeLabel[entryType]}
                    </Badge>
                    <Badge color="gray" variant="light">
                      {visibility === 'public' ? 'Public' : 'Private'}
                    </Badge>
                    {isRsvp && rsvpApproval === 'manual' ? (
                      <Badge color="nightfall" variant="light">
                        Approval required
                      </Badge>
                    ) : null}
                  </Group>
                  <Title order={3}>{form.values.name || 'Untitled Event'}</Title>
                  <Text size="sm" c="dimmed">
                    {formatDate(form.values.date)} at {form.values.startTime || 'Time TBD'}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {form.values.venue || 'Venue TBD'}
                  </Text>
                </Stack>
              </Group>

              {form.values.bannerUrl ? (
                <Image src={form.values.bannerUrl} radius="lg" h={180} fit="cover" alt="Event banner" />
              ) : (
                <Paper radius="lg" p="lg" style={{ backgroundColor: muted, border: `1px dashed ${border}` }}>
                  <Text size="sm" c="dimmed">
                    Add a banner image URL to preview the hero artwork.
                  </Text>
                </Paper>
              )}

              <Divider color={border} my="lg" />

              {isTicketed ? (
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                  <Paper radius="lg" p="md" style={{ backgroundColor: surface, border: `1px solid ${border}` }}>
                    <Text size="xs" fw={700} c="dimmed">
                      Total capacity
                    </Text>
                    <Text fw={700} size="lg">
                      {numberFormat.format(totals.capacity)} tickets
                    </Text>
                  </Paper>
                  <Paper radius="lg" p="md" style={{ backgroundColor: surface, border: `1px solid ${border}` }}>
                    <Text size="xs" fw={700} c="dimmed">
                      Potential revenue
                    </Text>
                    <Text fw={700} size="lg">
                      {numberFormat.format(totals.revenue)} ETB
                    </Text>
                  </Paper>
                </SimpleGrid>
              ) : isRsvp ? (
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                  <Paper radius="lg" p="md" style={{ backgroundColor: surface, border: `1px solid ${border}` }}>
                    <Text size="xs" fw={700} c="dimmed">
                      RSVP capacity
                    </Text>
                    <Text fw={700} size="lg">
                      {rsvpCapacity ? `${numberFormat.format(rsvpCapacity)} RSVPs` : 'Unlimited RSVPs'}
                    </Text>
                  </Paper>
                  <Paper radius="lg" p="md" style={{ backgroundColor: surface, border: `1px solid ${border}` }}>
                    <Text size="xs" fw={700} c="dimmed">
                      Approval
                    </Text>
                    <Text fw={700} size="lg">
                      {rsvpApproval === 'auto' ? 'Auto-approve' : 'Approval required'}
                    </Text>
                  </Paper>
                </SimpleGrid>
              ) : (
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                  <Paper radius="lg" p="md" style={{ backgroundColor: surface, border: `1px solid ${border}` }}>
                    <Text size="xs" fw={700} c="dimmed">
                      Entry pricing
                    </Text>
                    <Text fw={700} size="lg">
                      {invitePricing === 'paid' ? 'Paid tiers' : 'Free RSVP'}
                    </Text>
                  </Paper>
                  <Paper radius="lg" p="md" style={{ backgroundColor: surface, border: `1px solid ${border}` }}>
                    <Text size="xs" fw={700} c="dimmed">
                      Access methods
                    </Text>
                    <Text fw={700} size="lg">
                      {inviteCodesEnabled || guestListEnabled
                        ? `${inviteCodesEnabled ? 'Invite codes' : ''}${inviteCodesEnabled && guestListEnabled ? ' + ' : ''}${guestListEnabled ? 'Guest list' : ''}`
                        : 'No access method yet'}
                    </Text>
                  </Paper>
                </SimpleGrid>
              )}
            </Card>

            <Stack gap="lg">
              <Card radius="xl" padding="xl" className="glass-panel">
                <Group gap="sm" mb="sm">
                  <ThemeIcon radius="md" size={36} color="nightfall" variant="light">
                    {isTicketed ? <IconTicket size={18} /> : <IconUsers size={18} />}
                  </ThemeIcon>
                  <div>
                    <Text fw={700}>How attendees will enter</Text>
                    <Text size="sm" c="dimmed">
                      {entryTypeLabel[entryType]}
                    </Text>
                  </div>
                </Group>

                {isTicketed ? (
                  <>
                    <Text size="sm" fw={600} mb="sm">
                      Attendees purchase a ticket online before the event. No ticket, no entry.
                    </Text>
                    <Stack gap="sm">
                      {ticketTypes.map((ticket) => (
                        <Paper
                          key={ticket.id}
                          radius="lg"
                          p="md"
                          style={{ backgroundColor: surface, border: `1px solid ${border}` }}
                        >
                          <Group justify="space-between" align="center">
                            <div>
                              <Text fw={600}>{ticket.name || 'Ticket tier'}</Text>
                              <Text size="xs" c="dimmed">
                                {ticket.quantity || 0} tickets available
                              </Text>
                            </div>
                            <Text fw={700}>{numberFormat.format(ticket.price || 0)} ETB</Text>
                          </Group>
                        </Paper>
                      ))}
                    </Stack>
                    <Divider color={border} my="md" />
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">
                        Total capacity
                      </Text>
                      <Text fw={700}>{numberFormat.format(totals.capacity)} tickets</Text>
                    </Group>
                  </>
                ) : isRsvp ? (
                  <Stack gap="xs">
                    <Text size="sm" fw={600}>
                      Attendees register for free - no payment required.
                    </Text>
                    <Text size="sm" c="dimmed">
                      {rsvpApproval === 'auto'
                        ? 'RSVPs are confirmed instantly (up to capacity).'
                        : 'Each RSVP waits in a pending queue until you manually approve or reject it.'}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {rsvpCapacity
                        ? `Capacity is limited to ${numberFormat.format(rsvpCapacity)} RSVPs.`
                        : 'No capacity limit set - unlimited RSVPs accepted.'}
                    </Text>
                  </Stack>
                ) : (
                  <Stack gap="xs">
                    <Text size="sm" fw={600}>
                      {invitePricing === 'paid'
                        ? 'Invited guests purchase a ticket after gaining access.'
                        : 'Invited guests register for free - no payment required.'}
                    </Text>
                    {inviteCodesEnabled || guestListEnabled ? (
                      <Text size="sm" c="dimmed">
                        {inviteCodesEnabled ? 'Invite codes are enabled.' : ''}
                        {inviteCodesEnabled && guestListEnabled ? ' ' : ''}
                        {guestListEnabled ? 'Guest list access is enabled.' : ''}
                      </Text>
                    ) : (
                      <Text size="sm" c="dimmed">
                        Sections enabled but empty - add at least one code or guest before publishing.
                      </Text>
                    )}
                    {invitePricing === 'paid' && (
                      <Text size="sm" c="dimmed">
                        Ticket tiers will be visible after invite validation.
                      </Text>
                    )}
                  </Stack>
                )}
              </Card>

              <Card radius="xl" padding="xl" className="glass-panel">
                <Text fw={700}>Review notes</Text>
                <Text size="sm" c="dimmed">
                  Double-check entry settings, dates, and visibility before publishing.
                </Text>
              </Card>
            </Stack>
          </SimpleGrid>

          <Stack gap="sm">
            <Button size="lg" radius="lg" color="nightfall" onClick={handlePublish}>
              {isTicketed
                ? 'Publish - Start Selling Now'
                : isRsvp
                  ? 'Publish - Open RSVP'
                  : 'Publish - Share Invite Link'}
            </Button>
            <Button variant="subtle" color="gray" onClick={handleDraft}>
              Save as Draft
            </Button>
          </Stack>
        </Stack>
      )}

        <Group justify={step === 0 ? 'flex-end' : 'space-between'}>
          {step > 0 ? (
            <Button variant="light" color="gray" radius="xl" leftSection={<IconChevronLeft size={16} />} onClick={() => setStep((current) => Math.max(0, current - 1))}>
              Back
            </Button>
          ) : (
            <Box />
          )}
          {!isFinalStep ? (
            <Button color="nightfall" radius="xl" rightSection={<IconChevronRight size={16} />} onClick={() => setStep((current) => Math.min(steps.length - 1, current + 1))}>
              {steps[step].nextLabel}
            </Button>
          ) : null}
        </Group>
      </Stack>
    </Container>
  );
}
