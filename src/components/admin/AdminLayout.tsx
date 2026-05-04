import { AppShell, Avatar, Badge, Burger, Button, Divider, Group, NavLink, ScrollArea, Stack, Text, ThemeIcon, UnstyledButton } from '@mantine/core';
import { IconBell, IconCalendarEvent, IconDashboard, IconLogout, IconSettings, IconUsers } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import ColorSchemeToggle from '../common/ColorSchemeToggle';

const navLinks = [
  { label: 'Overview', path: '/admin', icon: IconDashboard },
  { label: 'Events', path: '/admin/events', icon: IconCalendarEvent },
  { label: 'Organizers', path: '/admin/organizers', icon: IconUsers },
];

function SidebarItem({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  icon: React.ComponentType<{ size?: number; stroke?: number }>;
  active?: boolean;
  onClick: () => void;
}) {
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
        label: {
          fontSize: theme.fontSizes.sm,
        },
        section: {
          color: active ? 'var(--sidebar-active-color)' : 'var(--sidebar-muted)',
        },
      })}
    />
  );
}

export default function AdminLayout() {
  const [opened, { toggle }] = useDisclosure();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{
        width: 290,
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
              Digis Admin
            </Text>
            <Badge radius="sm" variant="light" color="nightfall">
              Beta
            </Badge>
          </Group>

          <Group gap="md">
            <ColorSchemeToggle size={40} />
            <Button variant="light" color="nightfall" radius="xl" leftSection={<IconLogout size={16} />} onClick={() => navigate('/login')}>
              Logout
            </Button>
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

      <AppShell.Navbar p="lg" className="sidebar-rail">
        <Stack h="100%" justify="space-between" gap="md">
          <ScrollArea type="scroll" style={{ flex: 1 }}>
            <Stack gap="sm">
              <div>
                <Text size="xs" tt="uppercase" fw={700} c="var(--sidebar-muted)" mb={10}>
                  Management
                </Text>
                {navLinks.map((link) => (
                  <SidebarItem
                    key={link.path}
                    label={link.label}
                    icon={link.icon}
                    active={location.pathname === link.path}
                    onClick={() => navigate(link.path)}
                  />
                ))}
              </div>

              <Divider color="var(--sidebar-divider)" my="sm" />

              <div>
                <SidebarItem
                  label="Settings"
                  icon={IconSettings}
                  active={location.pathname === '/admin/settings'}
                  onClick={() => navigate('/admin/settings')}
                />
                <Button
                  variant="subtle"
                  fullWidth
                  justify="flex-start"
                  leftSection={<IconLogout size={16} />}
                  onClick={() => navigate('/login')}
                  styles={{
                    root: {
                      borderRadius: 14,
                      color: 'var(--sidebar-link)',
                      fontWeight: 600,
                      height: 44,
                      paddingInline: 14,
                    },
                    inner: {
                      justifyContent: 'flex-start',
                    },
                  }}
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
                AD
              </Avatar>
              <div style={{ minWidth: 0 }}>
                <Text fw={700} size="sm" lineClamp={1}>
                  Admin Doe
                </Text>
                <Text size="xs" c="var(--sidebar-muted)" lineClamp={1}>
                  Super Admin
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
