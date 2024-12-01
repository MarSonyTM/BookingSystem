import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types/user';
import {
  checkRateLimit,
  validateAccount,
  validateCredentials,
  registerUser,
  generateCsrfToken,
  isPasswordComplex,
  sanitizeInput,
  sanitizeError,
  getUserRole,
  getUserName,
} from '../utils/security';
import { updateLastActivity, validateSession } from '../middleware/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';
const ACTIVITY_KEY = 'last_activity';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem(USER_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const navigate = useNavigate();

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const login = async (email: string, password: string) => {
    try {
      email = sanitizeInput(email);
      
      if (!isValidEmail(email)) {
        throw new Error('Invalid email format');
      }

      if (!checkRateLimit(email)) {
        throw new Error('Too many login attempts. Please try again later.');
      }

      // Check if account exists
      if (!validateAccount(email)) {
        throw new Error('Account does not exist. Please register first.');
      }

      // Validate credentials
      if (!validateCredentials(email, password)) {
        throw new Error('Invalid password');
      }

      if (!isPasswordComplex(password)) {
        throw new Error('Invalid password format');
      }

      const csrfToken = generateCsrfToken();
      const mockToken = btoa(`${email}:${Date.now()}`);
      const role = getUserRole(email) as UserRole;
      const name = getUserName(email);
      
      const userData: User = {
        id: btoa(email),
        email,
        name,
        role,
        emailVerified: true,
      };
      
      localStorage.setItem(TOKEN_KEY, mockToken);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      localStorage.setItem(ACTIVITY_KEY, Date.now().toString());
      
      setUser(userData);
      updateLastActivity();
      navigate(role === 'admin' ? '/admin' : '/');
    } catch (error) {
      console.error('Login failed:', sanitizeError(error));
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      email = sanitizeInput(email);
      name = sanitizeInput(name);

      if (!isValidEmail(email)) {
        throw new Error('Invalid email format');
      }

      if (!isPasswordComplex(password)) {
        throw new Error('Password must be at least 8 characters long');
      }

      if (!name || name.length < 2) {
        throw new Error('Name must be at least 2 characters long');
      }

      // Register new user
      registerUser(email, password, name);

      const mockToken = btoa(`${email}:${Date.now()}`);
      const userData: User = {
        id: btoa(email),
        email,
        name,
        role: 'user',
        emailVerified: true,
      };
      
      localStorage.setItem(TOKEN_KEY, mockToken);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      localStorage.setItem(ACTIVITY_KEY, Date.now().toString());
      
      setUser(userData);
      navigate('/');
    } catch (error) {
      console.error('Registration failed:', sanitizeError(error));
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ACTIVITY_KEY);
    setUser(null);
    navigate('/login');
  };

  // Session validation
  useEffect(() => {
    const checkSession = () => {
      const lastActivity = localStorage.getItem(ACTIVITY_KEY);
      if (lastActivity && !validateSession(parseInt(lastActivity))) {
        logout();
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Update activity on user interaction
  useEffect(() => {
    const handleActivity = () => {
      if (user) {
        updateLastActivity();
      }
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user?.emailVerified,
        user,
        login,
        register,
        logout,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}