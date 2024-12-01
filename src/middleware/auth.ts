import { User, UserRole } from '../types/user';
import { checkPermission, isSessionValid } from '../utils/security';

export const requireAuth = (user: User | null): boolean => {
  return !!user;
};

export const requireRole = (user: User | null, role: UserRole): boolean => {
  if (!user) return false;
  return checkPermission(user.role, role);
};

export const validateSession = (lastActivity: number | null): boolean => {
  if (!lastActivity) return false;
  return isSessionValid(lastActivity);
};

export const updateLastActivity = (): void => {
  localStorage.setItem('last_activity', Date.now().toString());
};