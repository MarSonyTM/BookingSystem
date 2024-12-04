import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  Calendar,
  Clock, 
  Info,
  AlertCircle,
  Plus,
  History,
  User,
  PhoneCall,
  MapPin,
  Mail
} from 'lucide-react';
import { useSupabase } from '../contexts/SupabaseContext';
import { useBookings } from '../hooks/useBookings';

export default function UserDashboard() {
  const { user } = useSupabase();
  const { bookings } = useBookings();
  const navigate = useNavigate();

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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Important Information */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Info className="w-5 h-5 mr-2 text-indigo-500" />
            Important Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Opening Hours</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Mon-Fri: 9:00 - 18:00</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <PhoneCall className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Contact</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">+1 234 567 890</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Location</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">123 Therapy Street, Health City</p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Guidelines */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-indigo-500" />
            Booking Guidelines
          </h2>
          <ul className="space-y-3 text-gray-600 dark:text-gray-400">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
              <span>Maximum 2 bookings per week</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
              <span>Cancel at least 24 hours before appointment</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
              <span>Arrive 10 minutes before your appointment</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => navigate('/book')}
          className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all group"
        >
          <div className="flex flex-col items-center text-center">
            <Calendar className="w-8 h-8 text-indigo-500 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Book Appointment</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Schedule your next session</p>
          </div>
        </button>

        <button
          onClick={() => window.location.href = 'mailto:support@example.com'}
          className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all group"
        >
          <div className="flex flex-col items-center text-center">
            <Mail className="w-8 h-8 text-indigo-500 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Contact Us</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Questions or concerns?</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/history')}
          className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all group"
        >
          <div className="flex flex-col items-center text-center">
            <History className="w-8 h-8 text-indigo-500 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">View History</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">See past appointments</p>
          </div>
        </button>
      </div>
    </div>
  );
} 