import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  History,
  User,
  LayoutDashboard
} from 'lucide-react';
import { useSupabase } from '../contexts/SupabaseContext';
import { useBookings } from '../hooks/useBookings';
import { formatTime } from '../utils/dateUtils';

export default function UserDashboard() {
  const { user } = useSupabase();
  const { bookings } = useBookings();
  const navigate = useNavigate();

  const upcomingBookings = bookings.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Logo Section */}
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/10 mb-4">
          <Activity className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 mb-4">
          Physio & Massage
        </h1>
        <button
          onClick={() => navigate('/book')}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <LayoutDashboard size={18} />
          <span>Go to Calendar</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/book')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Plus className="w-5 h-5" />
                <span>Book New Appointment</span>
              </div>
            </button>
            <button
              onClick={() => navigate('/history')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <History className="w-5 h-5" />
                <span>View History</span>
              </div>
            </button>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Upcoming Appointments
          </h2>
          <div className="space-y-3">
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50"
                >
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {booking.date.toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatTime(booking.date.toLocaleTimeString())}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                    Confirmed
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No upcoming appointments
              </div>
            )}
          </div>
        </div>

        {/* Account Status */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Account Status
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">Profile</span>
              </div>
              <span className="flex items-center text-green-600 dark:text-green-400">
                <CheckCircle2 className="w-5 h-5" />
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">
                  Booking Limit
                </span>
              </div>
              <span className="text-sm text-gray-900 dark:text-white font-medium">
                {bookings.length}/2 this week
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 