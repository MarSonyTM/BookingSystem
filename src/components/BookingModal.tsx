import React, { useState } from 'react';
import { X, Calendar, Mail, User, Clock } from 'lucide-react';
import { formatTime } from '../utils/dateUtils';
import { useAdmin } from '../contexts/AdminContext';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBook: (data: {
    clientName: string;
    clientEmail: string;
  }) => void;
  selectedTime: string;
  selectedDate: Date;
}

export default function BookingModal({
  isOpen,
  onClose,
  onBook,
  selectedTime,
  selectedDate,
}: BookingModalProps) {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const { weeklySchedule } = useAdmin();

  if (!isOpen) return null;

  // Get the service type for the selected slot
  const daySchedule = weeklySchedule.find(
    (day) => day.date.toDateString() === selectedDate.toDateString()
  );
  const slot = daySchedule?.slots.find((s) => s.time === selectedTime);
  const serviceType = slot?.service || 'Not available';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBook({ clientName, clientEmail });
    setClientName('');
    setClientEmail('');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl w-full sm:w-auto sm:max-w-md relative shadow-2xl transform transition-all border-t sm:border border-gray-200/50 dark:border-gray-700/50 sm:rounded-2xl">
        <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-gray-400 dark:text-gray-500 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <X size={20} />
          </button>
          
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 mb-1">
            Book {serviceType} Appointment
          </h2>
          
          <div className="flex items-center space-x-4 mt-4">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <Calendar size={18} />
              <span>{selectedDate.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <Clock size={18} />
              <span>{formatTime(selectedTime)}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300/50 dark:border-gray-600/50 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 transition-all backdrop-blur-sm"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="email"
                required
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300/50 dark:border-gray-600/50 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 transition-all backdrop-blur-sm"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white py-2.5 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition-all font-medium shadow-sm hover:shadow-md focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
}