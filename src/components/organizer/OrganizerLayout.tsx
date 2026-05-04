import { AppShell, Avatar, Burger, Button, Divider, Group, NavLink, ScrollArea, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconCalendarPlus, IconLogout, IconTicket, IconUsersGroup, IconBell } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import ColorSchemeToggle from '../common/ColorSchemeToggle';
import { clearOrganizerAccount } from '../../data/organizerAccount';

const navLinks = [
  { label: 'Overview', path: '/organizer', icon: IconTicket },
  { label: 'Create Event', path: '/organizer/events/new', icon: IconCalendarPlus },
  { label: 'Scanners', path: '/organizer#scanners', icon: IconUsersGroup },
];

function SidebarItem({ label, icon: Icon, active, onClick }: { label: string; icon: React.ComponentType<{ size?: number; stroke?: number }>; active?: boolean; onClick: () => void }) {
  return (
    <NavLink
      label={label}
      leftSection={<Icon size={18} stroke={1.6} />}
      onClick={onClick}
      active={active}
      variant={active ? 'filled' : 'subtle'}
      styles={(theme) => ({
        root: {
          borderRadius: 12,
          minHeight: 44,
          paddingInline: 12,
          marginBottom: 8,
          fontWeight: 600,
          color: active ? 'var(--sidebar-active-color)' : 'var(--sidebar-link)',
          backgroundColor: active ? 'var(--sidebar-active-bg)' : 'transparent',
          transition: 'all 150ms ease',
          '&:hover': {
            backgroundColor: active ? 'var(--sidebar-active-bg)' : 'var(--sidebar-hover-bg)',
            color: active ? 'var(--sidebar-active-color)' : 'var(--sidebar-hover-color)',
          },
        },
        label: { fontSize: theme.fontSizes.sm },
        section: { color: active ? 'var(--sidebar-active-color)' : 'var(--sidebar-muted)' },
      })}
    />
  );
}

export default function OrganizerLayout() {
  const [opened, { toggle }] = useDisclosure();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <AppShell header={{ height: 72 }} navbar={{ width: 280, breakpoint: 'lg', collapsed: { mobile: !opened } }} padding="xl" styles={{ main: { background: 'transparent' } }}>
      <AppShell.Header className="glass-header">
        <Group h="100%" px="xl" justify="space-between">
          <Group gap="md" align="center">
            <Burger opened={opened} onClick={toggle} hiddenFrom="lg" color="#f5f6fa" size="sm" />
            <div>
              <Text fw={700}>Digis Studio</Text>
              <Text size="sm" c="dimmed">
                Organizer mode
              </Text>
            </div>
            <Button variant="light" color="nightfall" radius="xl" onClick={() => navigate('/admin')}>
              Switch to Super Admin
            </Button>
          </Group>

          <Group gap="sm">
            <ColorSchemeToggle />
            <Button radius="lg" color="nightfall" leftSection={<IconCalendarPlus size={18} />} onClick={() => navigate('/organizer/events/new')}>
              New Event
            </Button>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="lg" className="sidebar-rail">
        <Stack h="100%" justify="space-between" gap="md">
          <ScrollArea style={{ flex: 1 }}>
            <Stack gap="sm">
              <div>
                <Text size="xs" tt="uppercase" fw={700} c="var(--sidebar-muted)" mb={10}>
                  Management
                </Text>
                {navLinks.map((link) => {
                  const isScannersLink = link.path.includes('#scanners');
                  const isActive = isScannersLink ? location.pathname === '/organizer' && location.hash === '#scanners' : link.path === '/organizer' ? location.pathname === '/organizer' && location.hash !== '#scanners' : location.pathname === link.path;
                  return <SidebarItem key={link.path} label={link.label} icon={link.icon} active={isActive} onClick={() => navigate(link.path)} />;
                })}
              </div>

              <Divider color="var(--sidebar-divider)" my="sm" />

              <div>
                <Button
                  variant="subtle"
                  fullWidth
                  justify="flex-start"
                  leftSection={<IconLogout size={16} />}
                  onClick={() => {
                    clearOrganizerAccount();
                    navigate('/login');
                  }}
                  styles={{ root: { borderRadius: 12, color: 'var(--sidebar-link)', fontWeight: 600, height: 44, paddingInline: 12 }, inner: { justifyContent: 'flex-start' } }}
                >
                  Logout
                </Button>
              </div>
            </Stack>
          </ScrollArea>

          <div>
            <Divider color="var(--sidebar-divider)" mb="md" />
            <Group align="center" wrap="nowrap">
              <Avatar radius="sm" size={44} color="nightfall">
                OG
              </Avatar>
              <div style={{ minWidth: 0 }}>
                <Text fw={700} size="sm" lineClamp={1}>
                  Organizer Name
                </Text>
                <Text size="xs" c="var(--sidebar-muted)" lineClamp={1}>
                  Organizer
                </Text>
              </div>
              <ThemeIcon variant="light" color="nightfall" radius="xl" size="lg" ml="auto">
                <IconBell size={18} />
              </ThemeIcon>
            </Group>
          </div>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
