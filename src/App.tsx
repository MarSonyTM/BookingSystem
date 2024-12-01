import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import BookingLayout from './layouts/BookingLayout';
import AdminLayout from './layouts/AdminLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import VerifyPendingPage from './pages/VerifyPendingPage';
import BookingSystem from './pages/BookingSystem';
import AdminDashboard from './pages/AdminDashboard';
import { ThemeProvider } from './contexts/ThemeContext';
import { SupabaseProvider, useSupabase } from './contexts/SupabaseContext';

const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) => {
  const { user, loading } = useSupabase();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (requireAdmin && user.user_metadata.role !== 'admin') {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <SupabaseProvider>
        <ThemeProvider>
          <Routes>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>
            
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/verify-pending" element={<VerifyPendingPage />} />
            
            <Route element={<BookingLayout />}>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <BookingSystem />
                  </ProtectedRoute>
                }
              />
            </Route>
            
            <Route element={<AdminLayout />}>
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </ThemeProvider>
      </SupabaseProvider>
    </BrowserRouter>
  );
}

export default App;