import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { SupabaseProvider } from './contexts/SupabaseContext';
import BookingLayout from './layouts/BookingLayout';
import BookingSystem from './pages/BookingSystem';
import OverviewPage from './pages/OverviewPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AuthLayout from './layouts/AuthLayout';
import { useSupabase } from './contexts/SupabaseContext';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useSupabase();
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user } = useSupabase();
  return !user ? <>{children}</> : <Navigate to="/" />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      </Route>
      
      <Route element={<BookingLayout />}>
        <Route path="/" element={<PrivateRoute><OverviewPage /></PrivateRoute>} />
        <Route path="/book" element={<PrivateRoute><BookingSystem /></PrivateRoute>} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SupabaseProvider>
        <ThemeProvider>
          <AppRoutes />
        </ThemeProvider>
      </SupabaseProvider>
    </BrowserRouter>
  );
}