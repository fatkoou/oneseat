import { Link, NavLink } from 'react-router';
import { useAuth } from '../auth/AuthContext';
import './Header.css';

export function Header() {
  const { session, signOut } = useAuth();

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="brand">
          <span className="brand__mark" aria-hidden="true" />
          OneSeat
        </Link>
        <nav className="header__nav" aria-label="Main">
          {session ? (
            <>
              {session.role === 'admin' && (
                <NavLink to="/admin" className="header__link">
                  Admin
                </NavLink>
              )}
              <NavLink to="/reservations" className="header__link">
                My reservations
              </NavLink>
              <button type="button" className="btn btn--secondary btn--sm" onClick={signOut}>
                Sign out
              </button>
            </>
          ) : (
            <Link to="/sign-in" className="btn btn--primary btn--sm">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
