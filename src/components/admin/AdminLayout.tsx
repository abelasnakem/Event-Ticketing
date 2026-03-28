import { AppShell, Avatar, Badge, Burger, Group, NavLink, ScrollArea, Text, ThemeIcon, UnstyledButton } from '@mantine/core';
import { IconBell, IconCalendarEvent, IconDashboard, IconSettings, IconUsers } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import ColorSchemeToggle from '../common/ColorSchemeToggle';

const navLinks = [
  { label: 'Overview', path: '/admin', icon: IconDashboard },
  { label: 'Events', path: '/admin/events', icon: IconCalendarEvent },
  { label: 'Organizers', path: '/admin/organizers', icon: IconUsers },
  { label: 'Platform', path: '/admin/settings', icon: IconSettings },
];

export default function AdminLayout() {
  const [opened, { toggle }] = useDisclosure();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{
        width: 280,
        breakpoint: 'md',
        collapsed: { mobile: !opened },
      }}
      padding="xl"
      styles={{ main: { backgroundColor: 'transparent' } }}
    >
      <AppShell.Header className="glass-header" style={{ border: 'none' }}>
        <Group justify="space-between" h="100%" px="lg">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" color="#f5f6fa" />
            <Text fw={700} fz="lg">
              EthioTix Admin
            </Text>
            <Badge radius="sm" variant="light" color="nightfall">
              Beta
            </Badge>
          </Group>

          <Group gap="md">
            <ColorSchemeToggle size={40} />
            <ThemeIcon variant="light" color="nightfall" radius="xl" size="lg">
              <IconBell size={18} />
            </ThemeIcon>
            <UnstyledButton>
              <Group gap="xs">
                <Avatar radius="xl" color="nightfall">
                  AD
                </Avatar>
                <div>
                  <Text size="sm" fw={600}>
                    Admin Doe
                  </Text>
                  <Text size="xs" c="dimmed">
                    Super Admin
                  </Text>
                </div>
              </Group>
            </UnstyledButton>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar className="glass-nav" p="lg">
        <ScrollArea type="scroll" style={{ height: '100%' }}>
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              label={link.label}
              leftSection={<link.icon size={18} stroke={1.5} />}
              active={location.pathname === link.path}
              onClick={() => navigate(link.path)}
              variant={location.pathname === link.path ? 'filled' : 'subtle'}
              color="nightfall"
              style={{ borderRadius: 12, marginBottom: 6 }}
            />
          ))}
        </ScrollArea>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
