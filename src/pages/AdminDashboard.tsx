import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, ChevronDown, LayoutDashboard } from 'lucide-react';
import { ServiceType, WeeklySchedule, Booking } from '../types/booking';
import { generateTimeSlots, generateWeekDays, formatTime } from '../utils/dateUtils';
import BookingMetrics from '../components/analytics/BookingMetrics';
import BookingCharts from '../components/analytics/BookingCharts';

// Sample data generator for demonstration
const generateSampleBookings = (): Booking[] => {
  const bookings: Booking[] = [];
  const users = ['user1', 'user2', 'user3'];
  const today = new Date();
  
  for (let i = 0; i < 20; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - Math.floor(Math.random() * 14)); // Random day within last 2 weeks
    date.setHours(10 + Math.floor(Math.random() * 7), Math.random() < 0.5 ? 0 : 30);
    
    bookings.push({
      id: `booking-${i}`,
      date,
      userId: users[Math.floor(Math.random() * users.length)],
      serviceType: Math.random() < 0.5 ? 'physio' : 'massage',
    });
  }
  
  return bookings;
};

export default function AdminDashboard() {
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<WeeklySchedule>({
    id: 'current',
    startDate: new Date(),
    slots: {},
  });
  const [activeTab, setActiveTab] = useState<'schedule' | 'analytics'>('analytics');
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Initialize with sample data
  useEffect(() => {
    setBookings(generateSampleBookings());
  }, []);

  const timeSlots = generateTimeSlots();
  const weekDays = generateWeekDays();

  const handleServiceTypeChange = (date: Date, time: string, type: ServiceType) => {
    const dateKey = date.toISOString().split('T')[0];
    setSchedule((prev) => ({
      ...prev,
      slots: {
        ...prev.slots,
        [dateKey]: {
          ...prev.slots[dateKey],
          [time]: {
            serviceType: type,
          },
        },
      },
    }));
  };

  const handleDayServiceTypeChange = (date: Date, type: ServiceType) => {
    const dateKey = date.toISOString().split('T')[0];
    const updatedSlots = { ...schedule.slots };
    
    timeSlots.forEach((time) => {
      if (!updatedSlots[dateKey]) {
        updatedSlots[dateKey] = {};
      }
      updatedSlots[dateKey][time] = {
        serviceType: type,
      };
    });

    setSchedule((prev) => ({
      ...prev,
      slots: updatedSlots,
    }));
  };

  const getServiceType = (date: Date, time: string): ServiceType => {
    const dateKey = date.toISOString().split('T')[0];
    return schedule.slots[dateKey]?.[time]?.serviceType || 'physio';
  };

  const toggleDay = (dayDate: string) => {
    setExpandedDay(expandedDay === dayDate ? null : dayDate);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">Manage schedules and view analytics</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <LayoutDashboard className="w-5 h-5 mr-2" />
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'schedule'
                  ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Calendar className="w-5 h-5 mr-2" />
              Schedule
            </button>
          </div>
        </div>

        {activeTab === 'analytics' ? (
          <div className="space-y-6">
            <BookingMetrics bookings={bookings} />
            <BookingCharts bookings={bookings} />
          </div>
        ) : (
          <div className="space-y-4">
            {weekDays.map((day) => (
              <div
                key={day.dayDate}
                className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden transition-all duration-300 ease-in-out"
              >
                <div className="p-6 bg-gradient-to-r from-transparent via-white/30 to-transparent dark:via-gray-700/30 transition-colors group border-b border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {day.dayName}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{day.dayDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Set all slots:
                        </span>
                        <select
                          onChange={(e) => handleDayServiceTypeChange(day.date, e.target.value as ServiceType)}
                          className="px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-600 border border-gray-200/50 dark:border-gray-500/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20"
                        >
                          <option value="physio">Physio</option>
                          <option value="massage">Massage</option>
                        </select>
                      </div>
                      <button
                        onClick={() => toggleDay(day.dayDate)}
                        className="p-2 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                      >
                        <div className={`transform transition-transform duration-300 ${expandedDay === day.dayDate ? 'rotate-180' : ''}`}>
                          <ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  className={`transition-all duration-300 ease-in-out ${
                    expandedDay === day.dayDate ? 'max-h-[60vh] opacity-100' : 'max-h-0 opacity-0'
                  } overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent`}
                >
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-6 bg-white/30 dark:bg-gray-800/30">
                    {timeSlots.map((time) => (
                      <div
                        key={time}
                        className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 animate-scale-in-center"
                      >
                        <div className="flex items-center space-x-3">
                          <Clock className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {formatTime(time)}
                          </span>
                        </div>
                        <select
                          value={getServiceType(day.date, time)}
                          onChange={(e) =>
                            handleServiceTypeChange(day.date, time, e.target.value as ServiceType)
                          }
                          className="px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-600 border border-gray-200/50 dark:border-gray-500/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20"
                        >
                          <option value="physio">Physio</option>
                          <option value="massage">Massage</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}