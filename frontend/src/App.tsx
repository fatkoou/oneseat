import { Route, Routes } from 'react-router';
import { RequireAuth } from './auth/RequireAuth';
import { Header } from './components/Header';
import { AuthPage } from './pages/AuthPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { ReservationsPage } from './pages/ReservationsPage';
import { EventPage } from './pages/EventPage';
import { RequireAdmin } from './auth/RequireAdmin';
import { AdminPage } from './pages/AdminPage';
import { AdminSeatsPage } from './pages/AdminSeatsPage';

export function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<DiscoverPage />} />
          <Route path="/events/:eventId" element={<EventPage />} />
          <Route path="/sign-in" element={<AuthPage mode="sign-in" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          
          <Route element={<RequireAuth />}>
            <Route path="/reservations" element={<ReservationsPage />} />
            <Route element={<RequireAdmin />}>
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/events/:eventId/seats" element={<AdminSeatsPage />} />
            </Route>
          </Route>
        </Routes>
      </main>
    </>
  );
}
