import { Link, Outlet } from 'react-router';
import { EmptyState } from '../components/EmptyState';
import { useAuth } from './AuthContext';

// Only decides what the page shows. The real check is on the server
// (RolesGuard), which rejects non-admins with 403 even if they call the API directly.
export function RequireAdmin() {
  const { session } = useAuth();

  if (session?.role !== 'admin') {
    return (
      <div className="container page">
        <EmptyState title="Admins only" text="Your account doesn't have access to this page.">
          <Link to="/" className="btn btn--secondary">
            Back to events
          </Link>
        </EmptyState>
      </div>
    );
  }

  return <Outlet />;
}
