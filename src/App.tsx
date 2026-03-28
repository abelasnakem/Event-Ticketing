import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { appTheme } from './theme';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import EventsManagement from './pages/admin/EventsManagement';
import OrganizerLayout from './components/organizer/OrganizerLayout';
import OrganizerDashboard from './pages/organizer/OrganizerDashboard';
import EventBuilder from './pages/organizer/EventBuilder';
import EventDetails from './pages/organizer/EventDetails';

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
          </Route>
          <Route path="/organizer" element={<OrganizerLayout />}>
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
