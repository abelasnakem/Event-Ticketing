import { AppShell, Button, Burger, Group, NavLink, ScrollArea, Text } from '@mantine/core';
import { IconCalendarPlus, IconTicket, IconUsersGroup } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import ColorSchemeToggle from '../common/ColorSchemeToggle';

const navLinks = [
  {
    label: 'Overview',
    path: '/organizer',
    icon: IconTicket,
  },
  {
    label: 'Create Event',
    path: '/organizer/events/new',
    icon: IconCalendarPlus,
  },
  {
    label: 'Scanners',
    path: '/organizer#scanners',
    icon: IconUsersGroup,
  },
];

export default function OrganizerLayout() {
  const [opened, { toggle }] = useDisclosure();
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <AppShell
      header={{ height: 72 }}
      navbar={{ width: 320, breakpoint: 'lg', collapsed: { mobile: !opened } }}
      padding="xl"
      styles={{ main: { background: 'transparent' } }}
    >
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

      <AppShell.Navbar p="lg" className="glass-nav">
        <ScrollArea h="100%">
          {navLinks.map((link) => {
            const isScannersLink = link.path.includes('#scanners');
            const isActive = isScannersLink
              ? location.pathname === '/organizer' && location.hash === '#scanners'
              : link.path === '/organizer'
                ? location.pathname === '/organizer' && location.hash !== '#scanners'
                : location.pathname === link.path;

            return (
              <NavLink
                key={link.label}
                label={link.label}
                active={isActive}
                leftSection={<link.icon size={18} stroke={1.6} />}
                onClick={() => {
                  if (link.path.includes('#')) {
                    navigate('/organizer#scanners');
                    requestAnimationFrame(() => {
                      document.getElementById('scanners-section')?.scrollIntoView({ behavior: 'smooth' });
                    });
                  } else {
                    navigate(link.path);
                  }
                }}
                variant={isActive ? 'filled' : 'subtle'}
                color="nightfall"
                className="sidebar-link"
              />
            );
          })}
        </ScrollArea>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
