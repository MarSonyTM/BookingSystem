import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

interface User {
  email: string;
  name: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Constants for token storage
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem(USER_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const navigate = useNavigate();

  // Validate email format
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate password strength
  const isValidPassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const login = async (email: string, password: string) => {
    try {
      if (!isValidEmail(email)) {
        throw new Error('Invalid email format');
      }

      if (!isValidPassword(password)) {
        throw new Error('Password must be at least 8 characters long');
      }

      // Simulate API call with basic security measures
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real application, this would be a JWT token from your backend
      const mockToken = btoa(`${email}:${new Date().getTime()}`);
      
      const userData = { email, name: email.split('@')[0] };
      
      // Store auth data securely
      localStorage.setItem(TOKEN_KEY, mockToken);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      
      setUser(userData);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      if (!isValidEmail(email)) {
        throw new Error('Invalid email format');
      }

      if (!isValidPassword(password)) {
        throw new Error('Password must be at least 8 characters long');
      }

      if (!name || name.length < 2) {
        throw new Error('Name must be at least 2 characters long');
      }

      // Simulate API call with basic security measures
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockToken = btoa(`${email}:${new Date().getTime()}`);
      const userData = { email, name };
      
      localStorage.setItem(TOKEN_KEY, mockToken);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      
      setUser(userData);
      navigate('/');
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    navigate('/login');
  };

  // Check token expiration on mount and setup periodic checks
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        // In a real application, you would verify the token's expiration
        // For this demo, we'll use a simple timestamp check
        const [, timestamp] = atob(token).split(':');
        const tokenAge = Date.now() - parseInt(timestamp);
        
        // Logout if token is older than 24 hours
        if (tokenAge > 24 * 60 * 60 * 1000) {
          logout();
        }
      }
    };

    checkAuth();
    const interval = setInterval(checkAuth, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        login,
        register,
        logout,
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