import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3"
      >
        <Link to="/" className="text-lg font-bold text-brand-700">
          Expense Tracker
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-slate-600" data-testid="greeting">
                Hi, {user?.name}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-700 hover:text-brand-700">
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
