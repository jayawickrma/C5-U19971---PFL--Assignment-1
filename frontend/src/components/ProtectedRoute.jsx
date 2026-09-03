import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * React Router's recommended layout-route pattern for guarding a whole
 * subtree: rendered as a parent <Route element={<ProtectedRoute />}>,
 * it renders its protected children via <Outlet /> only once we know the
 * visitor is authenticated, otherwise it redirects to /login and remembers
 * where they were headed so we can send them back after signing in.
 */
export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex justify-center py-16" role="status" aria-live="polite">
        <span className="text-slate-500">Checking your session…</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
