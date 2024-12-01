import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import BookingLayout from './layouts/BookingLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookingSystem from './pages/BookingSystem';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminSchedulePage from './pages/AdminSchedulePage';
import { AdminProvider, useAdmin } from './contexts/AdminContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin } = useAdmin();
  return isAdmin ? <>{children}</> : <Navigate to="/admin" />;
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AdminProvider>
            <Routes>
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>
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
              <Route
                path="/admin"
                element={<AdminLoginPage />}
              />
              <Route
                path="/admin/schedule"
                element={
                  <ProtectedAdminRoute>
                    <AdminSchedulePage />
                  </ProtectedAdminRoute>
                }
              />
            </Routes>
          </AdminProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;