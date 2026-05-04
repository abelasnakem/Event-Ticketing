import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { appTheme } from './theme';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import EventsManagement from './pages/admin/EventsManagement';
import Organizers from './pages/admin/Organizers';
import AdminSettings from './pages/admin/AdminSettings';
import OrganizerLayout from './components/organizer/OrganizerLayout';
import OrganizerDashboard from './pages/organizer/OrganizerDashboard';
import EventBuilder from './pages/organizer/EventBuilder';
import EventDetails from './pages/organizer/EventDetails';
import OrganizerOnboarding from './pages/organizer/OrganizerOnboarding';
import Login from './pages/auth/Login';
import { getOrganizerAccount } from './data/organizerAccount';

function OrganizerAccessRoute({ children }: { children: React.ReactNode }) {
  const hasAccount = Boolean(getOrganizerAccount());
  if (!hasAccount) {
    return <Navigate to="/organizer/onboarding" replace />;
  }
  return <>{children}</>;
}

function OnboardingOnlyRoute({ children }: { children: React.ReactNode }) {
  const hasAccount = Boolean(getOrganizerAccount());
  if (hasAccount) {
    return <Navigate to="/organizer" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <MantineProvider theme={appTheme} defaultColorScheme="dark">
      <Notifications position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/organizer" replace />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="events" element={<EventsManagement />} />
            <Route path="organizers" element={<Organizers />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          <Route
            path="/organizer/onboarding"
            element={
              <OnboardingOnlyRoute>
                <OrganizerOnboarding />
              </OnboardingOnlyRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route
            path="/organizer"
            element={
              <OrganizerAccessRoute>
                <OrganizerLayout />
              </OrganizerAccessRoute>
            }
          >
            <Route index element={<OrganizerDashboard />} />
            <Route path="events/new" element={<EventBuilder />} />
            <Route path="events/:eventId" element={<EventDetails />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
