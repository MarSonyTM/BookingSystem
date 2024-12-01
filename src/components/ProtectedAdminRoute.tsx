import { Navigate } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';

export function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAdmin();
  return isAdmin ? <>{children}</> : <Navigate to="/admin" />;
} 