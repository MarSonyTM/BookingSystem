import React, { createContext, useContext, useState, useEffect } from 'react';

interface ScheduleSlot {
  time: string;
  service: 'physio' | 'massage' | null;
}

interface DaySchedule {
  date: Date;
  slots: ScheduleSlot[];
}

interface AdminContextType {
  isAdmin: boolean;
  weeklySchedule: DaySchedule[];
  setWeeklySchedule: (schedule: DaySchedule[]) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('isAdmin') === 'true';
  });
  
  const [weeklySchedule, setWeeklySchedule] = useState<DaySchedule[]>(() => {
    const saved = localStorage.getItem('weeklySchedule');
    return saved ? JSON.parse(saved, (key, value) => {
      if (key === 'date') return new Date(value);
      return value;
    }) : [];
  });

  // Save schedule to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('weeklySchedule', JSON.stringify(weeklySchedule));
  }, [weeklySchedule]);

  const login = async (email: string, password: string) => {
    if (email === 'admin@admin.com' && password === 'admin123') {
      setIsAdmin(true);
      localStorage.setItem('isAdmin', 'true');
    } else {
      throw new Error('Invalid admin credentials');
    }
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
  };

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        weeklySchedule,
        setWeeklySchedule,
        login,
        logout,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
} 