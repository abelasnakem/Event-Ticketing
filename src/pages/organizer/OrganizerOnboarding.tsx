import {
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  Divider,
  FileButton,
  Group,
  Paper,
  PasswordInput,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Textarea,
  ThemeIcon,
  Title,
  useComputedColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  IconBuildingBank,
  IconBuildingCommunity,
  IconBuildingStore,
  IconCalendarEvent,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconDeviceMobile,
  IconFileText,
  IconSettings,
  IconStar,
  IconTicket,
  IconUpload,
  IconUser,
  IconUsersGroup,
} from '@tabler/icons-react';
import { type ComponentType, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { getOrganizerAccount, saveOrganizerAccount } from '../../data/organizerAccount';

type OnboardingValues = {
  fullName: string;
  phone: string;
  nationalId: string;
  email: string;
  password: string;
  organizationName: string;
  organizerType: string;
  socialLinks: string;
  businessLicense: File | null;
  tinNumber: string;
  businessAddress: string;
  bankAccountName: string;
  bankName: string;
  bankAccountNumber: string;
  contactRole: string;
  hasExperience: string;
  eventTypes: string[];
  audienceSize: string;
  eventFrequency: string;
  upcomingEventName: string;
  payoutMethod: string;
  needSetupSupport: string;
  useQrScanner: string;
  agreeTerms: boolean;
  agreeFees: boolean;
  confirmAccuracy: boolean;
};


type StepItem = {
  title: string;
  icon: ComponentType<{ size?: number; stroke?: number }>;
};

const steps: StepItem[] = [
  { title: 'Profile', icon: IconUser },
  { title: 'Business', icon: IconBuildingStore },
  { title: 'Experience', icon: IconCalendarEvent },
  { title: 'Preferences', icon: IconSettings },
  { title: 'Agreement', icon: IconFileText },
];

const stepMeta = [
  {
    heading: 'Organizer Profile',
    description: 'Start with your basic information and organization details.',
    nextLabel: 'Continue to Business Details',
  },
  {
    heading: 'Business & Legal',
    description: 'Help us verify your business and set up secure payouts.',
    nextLabel: 'Continue to Experience',
  },
  {
    heading: 'Event Profile',
    description: 'Tell us about your event experience and what you organize.',
    nextLabel: 'Continue to Preferences',
  },
  {
    heading: 'Platform Setup',
    description: 'Configure how you want to use Digis for your events.',
    nextLabel: 'Review & Agreement',
  },
  {
    heading: 'Agreement',
    description: 'Review our terms and complete your registration.',
    nextLabel: 'Complete Registration',
  },
];

type SelectableCardProps = {
  title: string;
  icon?: ComponentType<{ size?: number; stroke?: number }>;
  selected?: boolean;
  onClick: () => void;
  minHeight?: number;
};

function SelectableCard({ title, icon: Icon, selected, onClick, minHeight = 48 }: SelectableCardProps) {
  const theme = useMantineTheme();
  const scheme = useComputedColorScheme('dark');
  const isDark = scheme === 'dark';
  const accent = theme.colors.nightfall[4];
  const border = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(13, 18, 54, 0.08)';
  const surface = isDark ? 'rgba(255, 255, 255, 0.03)' : '#ffffff';
  const selectedSurface = isDark ? 'rgba(49, 78, 244, 0.18)' : 'rgba(49, 78, 244, 0.12)';
  const iconBg = selected ? accent : isDark ? 'rgba(255, 255, 255, 0.08)' : '#eef2ff';
  const iconColor = selected ? theme.white : isDark ? theme.colors.gray[4] : theme.colors.gray[6];

  return (
    <Paper
      withBorder
      radius="lg"
      p="sm"
      onClick={onClick}
      style={{
        cursor: 'pointer',
        borderColor: selected ? accent : border,
        backgroundColor: selected ? selectedSurface : surface,
        minHeight,
        display: 'flex',
        alignItems: 'center',
        transition: 'all 150ms ease',
      }}
    >
      <Group gap="sm" wrap="nowrap">
        {Icon ? (
          <ThemeIcon
            radius="md"
            size={32}
            styles={{
              root: {
                backgroundColor: iconBg,
                color: iconColor,
              },
            }}
          >
            <Icon size={16} stroke={1.6} />
          </ThemeIcon>
        ) : null}
        <Text size="sm" fw={600}>
          {title}
        </Text>
      </Group>
    </Paper>
  );
}

function OnboardingStepper({ step }: { step: number }) {
  const theme = useMantineTheme();
  const scheme = useComputedColorScheme('dark');
  const isDark = scheme === 'dark';
  const border = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(13, 18, 54, 0.08)';
  const accent = theme.colors.nightfall[4];
  const inactiveBg = isDark ? 'rgba(255, 255, 255, 0.08)' : '#eef2ff';
  const activeBg = theme.colors.nightfall[5];

  return (
    <Paper
      radius="xl"
      p="sm"
      className="glass-panel"
      style={{ overflowX: 'auto' }}
    >
      <Group gap={0} wrap="nowrap">
        {steps.map((item, index) => {
          const isActive = index === step;
          const isCompleted = index < step;
          const Icon = item.icon;
          const label = `Step ${String(index + 1).padStart(2, '0')}`;
          const iconBg = isCompleted ? accent : isActive ? activeBg : inactiveBg;
          const iconColor = isCompleted || isActive ? theme.white : theme.colors.gray[4];

          return (
            <Box
              key={item.title}
              style={{
                flex: 1,
                minWidth: 160,
                padding: '8px 14px',
                borderRight: index === steps.length - 1 ? 'none' : `1px solid ${border}`,
                borderBottom: `2px solid ${isActive || isCompleted ? accent : 'transparent'}`,
              }}
            >
              <Group gap="sm" wrap="nowrap">
                <ThemeIcon
                  radius="xl"
                  size={32}
                  styles={{
                    root: {
                      backgroundColor: iconBg,
                      color: iconColor,
                    },
                  }}
                >
                  {isCompleted ? <IconCheck size={16} /> : <Icon size={16} stroke={1.6} />}
                </ThemeIcon>
                <Box>
                  <Text size="xs" fw={700} c={isActive ? undefined : 'dimmed'}>
                    {label}
                  </Text>
                  <Text size="sm" fw={600} c={isActive ? undefined : 'dimmed'}>
                    {item.title}
                  </Text>
                </Box>
              </Group>
            </Box>
          );
        })}
      </Group>
    </Paper>
  );
}

export default function OrganizerOnboarding() {
  const theme = useMantineTheme();
  const scheme = useComputedColorScheme('dark');
  const isDark = scheme === 'dark';
  const panelBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(13, 18, 54, 0.08)';
  const panelSurface = isDark ? 'rgba(255, 255, 255, 0.04)' : '#ffffff';
  const panelSurfaceMuted = isDark ? 'rgba(255, 255, 255, 0.02)' : '#f5f7ff';
  const navigate = useNavigate();
  const existingAccount = getOrganizerAccount();
  const [step, setStep] = useState(0);

  const form = useForm<OnboardingValues>({
    initialValues: {
      fullName: '',
      phone: '',
      nationalId: '',
      email: '',
      password: '',
      organizationName: '',
      organizerType: '',
      socialLinks: '',
      businessLicense: null,
      tinNumber: '',
      businessAddress: '',
      bankAccountName: '',
      bankName: '',
      bankAccountNumber: '',
      contactRole: '',
      hasExperience: 'yes',
      eventTypes: [],
      audienceSize: '',
      eventFrequency: '',
      upcomingEventName: '',
      payoutMethod: '',
      needSetupSupport: '',
      useQrScanner: '',
      agreeTerms: false,
      agreeFees: false,
      confirmAccuracy: false,
    },
  });

  if (existingAccount) {
    return <Navigate to="/organizer" replace />;
  }

  const canComplete = form.values.agreeTerms && form.values.agreeFees && form.values.confirmAccuracy;
  const isLastStep = step === steps.length - 1;
  const { heading, description, nextLabel } = stepMeta[step];

  const toggleMultiValue = (values: string[], value: string) =>
    values.includes(value) ? values.filter((item) => item !== value) : [...values, value];

  const handleFinish = () => {
    const email = form.values.email.trim() || 'organizer@example.com';

    saveOrganizerAccount({
      fullName: form.values.fullName.trim() || 'New Organizer',
      businessName: form.values.organizationName.trim() || 'Organizer Studio',
      email,
      createdAt: new Date().toISOString(),
    });

    notifications.show({
      title: 'All set',
      message: 'Your organizer workspace is ready.',
      color: 'teal',
      icon: <IconCheck size={18} />,
    });

    navigate('/organizer', { replace: true });
  };

  return (
    <Box style={{ minHeight: '100vh', padding: '36px 16px 64px' }}>
      <Container size={1100}>
        <Stack gap="xl">
          <Box>
            <Title order={1}>Be an organizer on the Digis app</Title>
            <Text size="sm" c="dimmed">
              Build your brand, launch ticket sales fast, and manage payouts with confidence. Digis helps you verify
              your organization, tailor your event setup, and reach your audience in one streamlined flow.
            </Text>
          </Box>
          <OnboardingStepper step={step} />

          <Card
            radius="xl"
            padding="xl"
            className="glass-panel"
          >
            <Stack gap="xl">
              <Box>
                <Title order={2}>{heading}</Title>
                <Text size="sm" c="dimmed">
                  {description}
                </Text>
              </Box>

              {step === 0 && (
                <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: 'md', md: 'xl' }}>
                  <Stack gap="md">
                    <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                      Personal Information
                    </Text>
                    <TextInput
                      label="Full Name"
                      placeholder="e.g. John Doe"
                      value={form.values.fullName}
                      onChange={(event) => form.setFieldValue('fullName', event.currentTarget.value)}
                    />
                    <TextInput
                      label="Phone Number"
                      placeholder="+251 ..."
                      value={form.values.phone}
                      onChange={(event) => form.setFieldValue('phone', event.currentTarget.value)}
                    />
                    <TextInput
                      label="National ID Number"
                      placeholder="Enter ID number"
                      value={form.values.nationalId}
                      onChange={(event) => form.setFieldValue('nationalId', event.currentTarget.value)}
                    />

                    <Text size="xs" fw={700} tt="uppercase" c="dimmed" mt="sm">
                      Security
                    </Text>
                    <TextInput
                      label="Email Address"
                      placeholder="mail@example.com"
                      value={form.values.email}
                      onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                    />
                    <PasswordInput
                      label="Password"
                      placeholder="Enter a secure password"
                      value={form.values.password}
                      onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
                    />
                  </Stack>

                  <Stack gap="md">
                    <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                      Organization Details
                    </Text>
                    <TextInput
                      label="Organization/Brand Name"
                      placeholder="e.g. Digis Events"
                      value={form.values.organizationName}
                      onChange={(event) => form.setFieldValue('organizationName', event.currentTarget.value)}
                    />
                    <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                      Type of Organizer
                    </Text>
                    <SimpleGrid cols={2} spacing="sm">
                      <SelectableCard
                        title="Individual"
                        icon={IconUser}
                        selected={form.values.organizerType === 'individual'}
                        onClick={() => form.setFieldValue('organizerType', 'individual')}
                      />
                      <SelectableCard
                        title="Event Company"
                        icon={IconUsersGroup}
                        selected={form.values.organizerType === 'company'}
                        onClick={() => form.setFieldValue('organizerType', 'company')}
                      />
                      <SelectableCard
                        title="NGO"
                        icon={IconBuildingCommunity}
                        selected={form.values.organizerType === 'ngo'}
                        onClick={() => form.setFieldValue('organizerType', 'ngo')}
                      />
                      <SelectableCard
                        title="University Club"
                        icon={IconTicket}
                        selected={form.values.organizerType === 'university'}
                        onClick={() => form.setFieldValue('organizerType', 'university')}
                      />
                      <SelectableCard
                        title="Other"
                        icon={IconStar}
                        selected={form.values.organizerType === 'other'}
                        onClick={() => form.setFieldValue('organizerType', 'other')}
                      />
                    </SimpleGrid>
                    <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                      Social Links
                    </Text>
                    <Textarea
                      placeholder="Instagram, Website, etc."
                      minRows={3}
                      value={form.values.socialLinks}
                      onChange={(event) => form.setFieldValue('socialLinks', event.currentTarget.value)}
                    />
                  </Stack>
                </SimpleGrid>
              )}

              {step === 1 && (
                <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: 'md', md: 'xl' }}>
                  <Stack gap="md">
                    <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                      Verification Documents
                    </Text>
                    <FileButton
                      onChange={(file) => form.setFieldValue('businessLicense', file)}
                      accept="application/pdf,image/png,image/jpeg"
                    >
                      {(props) => (
                        <Paper
                          withBorder
                          radius="lg"
                          p="lg"
                          onClick={props.onClick}
                          style={{
                            borderStyle: 'dashed',
                            borderColor: panelBorder,
                            backgroundColor: panelSurfaceMuted,
                            cursor: 'pointer',
                          }}
                        >
                          <Stack gap="xs" align="center">
                            <ThemeIcon radius="xl" size={44} color="nightfall" variant="light">
                              <IconUpload size={18} />
                            </ThemeIcon>
                            <Text size="sm" fw={600}>
                              Upload Business License
                            </Text>
                            <Text size="xs" c="dimmed">
                              PDF, JPG, PNG up to 10MB
                            </Text>
                            {form.values.businessLicense ? (
                              <Text size="xs">
                                {form.values.businessLicense.name}
                              </Text>
                            ) : null}
                          </Stack>
                        </Paper>
                      )}
                    </FileButton>
                    <TextInput
                      label="TIN Number (Optional)"
                      placeholder="Enter TIN number"
                      value={form.values.tinNumber}
                      onChange={(event) => form.setFieldValue('tinNumber', event.currentTarget.value)}
                    />
                    <TextInput
                      label="Business Address"
                      placeholder="Registered address"
                      value={form.values.businessAddress}
                      onChange={(event) => form.setFieldValue('businessAddress', event.currentTarget.value)}
                    />
                  </Stack>

                  <Stack gap="md">
                    <Paper
                      withBorder
                      radius="lg"
                      p="lg"
                      style={{ borderColor: panelBorder, backgroundColor: panelSurface }}
                    >
                      <Stack gap="md">
                        <Group gap="xs">
                          <ThemeIcon radius="md" size={32} color="nightfall" variant="light">
                            <IconBuildingBank size={16} />
                          </ThemeIcon>
                          <Text fw={600}>
                            Payout Information
                          </Text>
                        </Group>
                        <TextInput
                          label="Bank Account Holder"
                          placeholder="Name on account"
                          value={form.values.bankAccountName}
                          onChange={(event) => form.setFieldValue('bankAccountName', event.currentTarget.value)}
                        />
                        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                          <TextInput
                            label="Bank Name"
                            placeholder="e.g. CBE, Dashen"
                            value={form.values.bankName}
                            onChange={(event) => form.setFieldValue('bankName', event.currentTarget.value)}
                          />
                          <TextInput
                            label="Account Number"
                            placeholder="0000 0000 0000"
                            value={form.values.bankAccountNumber}
                            onChange={(event) => form.setFieldValue('bankAccountNumber', event.currentTarget.value)}
                          />
                        </SimpleGrid>
                      </Stack>
                    </Paper>
                    <TextInput
                      label="Primary Contact Person's Role"
                      placeholder="e.g. Manager, Founder"
                      value={form.values.contactRole}
                      onChange={(event) => form.setFieldValue('contactRole', event.currentTarget.value)}
                    />
                  </Stack>
                </SimpleGrid>
              )}

              {step === 2 && (
                <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: 'md', md: 'xl' }}>
                  <Stack gap="md">
                    <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                      Experience
                    </Text>
                    <Text size="sm" fw={600}>
                      Have you organized events before?
                    </Text>
                    <Group grow>
                      <SelectableCard
                        title="Yes"
                        selected={form.values.hasExperience === 'yes'}
                        onClick={() => form.setFieldValue('hasExperience', 'yes')}
                        minHeight={44}
                      />
                      <SelectableCard
                        title="No"
                        selected={form.values.hasExperience === 'no'}
                        onClick={() => form.setFieldValue('hasExperience', 'no')}
                        minHeight={44}
                      />
                    </Group>

                    <Text size="sm" fw={600}>
                      What kind of events do you organize?
                    </Text>
                    <SimpleGrid cols={2} spacing="sm">
                      <SelectableCard
                        title="Music/Concerts"
                        icon={IconTicket}
                        selected={form.values.eventTypes.includes('music')}
                        onClick={() =>
                          form.setFieldValue('eventTypes', toggleMultiValue(form.values.eventTypes, 'music'))
                        }
                      />
                      <SelectableCard
                        title="Festivals"
                        icon={IconStar}
                        selected={form.values.eventTypes.includes('festivals')}
                        onClick={() =>
                          form.setFieldValue('eventTypes', toggleMultiValue(form.values.eventTypes, 'festivals'))
                        }
                      />
                      <SelectableCard
                        title="Nightlife/Clubbing"
                        icon={IconBuildingStore}
                        selected={form.values.eventTypes.includes('nightlife')}
                        onClick={() =>
                          form.setFieldValue('eventTypes', toggleMultiValue(form.values.eventTypes, 'nightlife'))
                        }
                      />
                      <SelectableCard
                        title="Conferences/Seminars"
                        icon={IconUsersGroup}
                        selected={form.values.eventTypes.includes('conferences')}
                        onClick={() =>
                          form.setFieldValue('eventTypes', toggleMultiValue(form.values.eventTypes, 'conferences'))
                        }
                      />
                      <SelectableCard
                        title="Training/Workshops"
                        icon={IconBuildingCommunity}
                        selected={form.values.eventTypes.includes('training')}
                        onClick={() =>
                          form.setFieldValue('eventTypes', toggleMultiValue(form.values.eventTypes, 'training'))
                        }
                      />
                      <SelectableCard
                        title="Other"
                        icon={IconStar}
                        selected={form.values.eventTypes.includes('other')}
                        onClick={() =>
                          form.setFieldValue('eventTypes', toggleMultiValue(form.values.eventTypes, 'other'))
                        }
                      />
                    </SimpleGrid>
                  </Stack>

                  <Stack gap="md">
                    <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                      Estimated Audience per Event
                    </Text>
                    <SimpleGrid cols={2} spacing="sm">
                      {['Under 100', '100 - 500', '500 - 1,000', '1,000+'].map((value) => (
                        <SelectableCard
                          key={value}
                          title={value}
                          icon={IconUsersGroup}
                          selected={form.values.audienceSize === value}
                          onClick={() => form.setFieldValue('audienceSize', value)}
                        />
                      ))}
                    </SimpleGrid>

                    <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                      Event Frequency
                    </Text>
                    <SimpleGrid cols={2} spacing="sm">
                      {['Weekly', 'Monthly', 'Occasionally', 'First Time Organizer'].map((value) => (
                        <SelectableCard
                          key={value}
                          title={value}
                          icon={IconCalendarEvent}
                          selected={form.values.eventFrequency === value}
                          onClick={() => form.setFieldValue('eventFrequency', value)}
                        />
                      ))}
                    </SimpleGrid>

                    <TextInput
                      label="Upcoming Event Name (Optional)"
                      placeholder="e.g. Summer Music Fest"
                      value={form.values.upcomingEventName}
                      onChange={(event) => form.setFieldValue('upcomingEventName', event.currentTarget.value)}
                    />
                  </Stack>
                </SimpleGrid>
              )}

              {step === 3 && (
                <Stack gap="lg">
                  <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                    Payout Method
                  </Text>
                  <SimpleGrid
                    cols={{ base: 1, sm: 2, md: 3 }}
                    spacing={{ base: 'md', md: 'sm' }}
                  >
                    <SelectableCard
                      title="Bank Transfer"
                      icon={IconBuildingBank}
                      selected={form.values.payoutMethod === 'bank'}
                      onClick={() => form.setFieldValue('payoutMethod', 'bank')}
                      minHeight={56}
                    />
                    <SelectableCard
                      title="Mobile Money"
                      icon={IconDeviceMobile}
                      selected={form.values.payoutMethod === 'mobile'}
                      onClick={() => form.setFieldValue('payoutMethod', 'mobile')}
                      minHeight={56}
                    />
                    <SelectableCard
                      title="Both"
                      icon={IconBuildingStore}
                      selected={form.values.payoutMethod === 'both'}
                      onClick={() => form.setFieldValue('payoutMethod', 'both')}
                      minHeight={56}
                    />
                  </SimpleGrid>

                  <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: 'md', md: 'lg' }}>
                    <Paper
                      withBorder
                      radius="lg"
                      p="lg"
                      style={{ borderColor: panelBorder, backgroundColor: panelSurface }}
                    >
                      <Stack gap="sm">
                        <Group gap="sm">
                          <ThemeIcon radius="xl" size={36} color="nightfall" variant="light">
                            <IconStar size={18} />
                          </ThemeIcon>
                          <Box>
                            <Text fw={600}>
                              Setup Support
                            </Text>
                            <Text size="sm" c="dimmed">
                              Do you need Digis support to set up your first event page?
                            </Text>
                          </Box>
                        </Group>
                        <Group grow>
                          <SelectableCard
                            title="Yes"
                            selected={form.values.needSetupSupport === 'yes'}
                            onClick={() => form.setFieldValue('needSetupSupport', 'yes')}
                            minHeight={44}
                          />
                          <SelectableCard
                            title="No"
                            selected={form.values.needSetupSupport === 'no'}
                            onClick={() => form.setFieldValue('needSetupSupport', 'no')}
                            minHeight={44}
                          />
                        </Group>
                      </Stack>
                    </Paper>
                    <Paper
                      withBorder
                      radius="lg"
                      p="lg"
                      style={{ borderColor: panelBorder, backgroundColor: panelSurface }}
                    >
                      <Stack gap="sm">
                        <Group gap="sm">
                          <ThemeIcon radius="xl" size={36} color="nightfall" variant="light">
                            <IconTicket size={18} />
                          </ThemeIcon>
                          <Box>
                            <Text fw={600}>
                              QR Scanner
                            </Text>
                            <Text size="sm" c="dimmed">
                              Use Digis's QR code scanner for ticket validation?
                            </Text>
                          </Box>
                        </Group>
                        <Group grow>
                          <SelectableCard
                            title="Yes"
                            selected={form.values.useQrScanner === 'yes'}
                            onClick={() => form.setFieldValue('useQrScanner', 'yes')}
                            minHeight={44}
                          />
                          <SelectableCard
                            title="No"
                            selected={form.values.useQrScanner === 'no'}
                            onClick={() => form.setFieldValue('useQrScanner', 'no')}
                            minHeight={44}
                          />
                        </Group>
                      </Stack>
                    </Paper>
                  </SimpleGrid>
                </Stack>
              )}

              {step === 4 && (
                <Stack gap="md">
                  <Paper
                    withBorder
                    radius="lg"
                    p="md"
                    style={{ borderColor: panelBorder, backgroundColor: panelSurface }}
                  >
                    <Checkbox
                      color="nightfall"
                      checked={form.values.agreeTerms}
                      onChange={(event) => form.setFieldValue('agreeTerms', event.currentTarget.checked)}
                      label="Terms and Conditions"
                      description={
                        <Text size="xs" c="dimmed">
                          I have read and agree to Digis's{' '}
                          <Text component="span" c={theme.colors.nightfall[4]} fw={600}>
                            Organizer Terms and Conditions
                          </Text>
                        </Text>
                      }
                    />
                  </Paper>
                  <Paper
                    withBorder
                    radius="lg"
                    p="md"
                    style={{ borderColor: panelBorder, backgroundColor: panelSurface }}
                  >
                    <Checkbox
                      color="nightfall"
                      checked={form.values.agreeFees}
                      onChange={(event) => form.setFieldValue('agreeFees', event.currentTarget.checked)}
                      label="Service Fee Agreement"
                      description={
                        <Text size="xs" c="dimmed">
                          I understand that Digis deducts a service fee per ticket sold to cover platform costs.
                        </Text>
                      }
                    />
                  </Paper>
                  <Paper
                    withBorder
                    radius="lg"
                    p="md"
                    style={{ borderColor: panelBorder, backgroundColor: panelSurface }}
                  >
                    <Checkbox
                      color="nightfall"
                      checked={form.values.confirmAccuracy}
                      onChange={(event) => form.setFieldValue('confirmAccuracy', event.currentTarget.checked)}
                      label="Information Accuracy"
                      description={
                        <Text size="xs" c="dimmed">
                          I confirm that all provided information is accurate and truthful.
                        </Text>
                      }
                    />
                  </Paper>
                </Stack>
              )}

              <Divider color={panelBorder} />

              <Group justify={step === 0 ? 'flex-end' : 'space-between'}>
                {step > 0 ? (
                  <Button
                    variant="light"
                    color="gray"
                    radius="xl"
                    leftSection={<IconChevronLeft size={16} />}
                    onClick={() => setStep((current) => Math.max(0, current - 1))}
                  >
                    Back
                  </Button>
                ) : (
                  <Box />
                )}
                <Button
                  color="nightfall"
                  radius="xl"
                  rightSection={isLastStep ? undefined : <IconChevronRight size={16} />}
                  leftSection={isLastStep ? <IconCheck size={16} /> : undefined}
                  disabled={isLastStep && !canComplete}
                  onClick={() => {
                    if (isLastStep) {
                      handleFinish();
                    } else {
                      setStep((current) => Math.min(steps.length - 1, current + 1));
                    }
                  }}
                >
                  {nextLabel}
                </Button>
              </Group>
            </Stack>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}
