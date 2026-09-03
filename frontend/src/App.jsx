import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import RegisterPage from './pages/RegisterPage';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <a href="#main-content" className="sr-only-focusable">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content">
        <Routes>
          {/* Layout route: everything nested here requires an authenticated user */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardPage />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </main>
    </div>
  );
}
