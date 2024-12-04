import React from 'react';
import { X, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { formatTime } from '../utils/dateUtils';
import { Booking } from '../types/booking';
import { format } from 'date-fns';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBook: () => void;
  selectedTime: string;
  selectedDate: Date;
  existingBooking: Booking | null;
  weeklyBookings: Booking[];
  onCancelPrevious: (bookingToCancel: Booking) => void;
  exceedingWeeklyLimit: boolean;
}

export default function BookingModal({
  isOpen,
  onClose,
  onBook,
  selectedTime,
  selectedDate,
  existingBooking,
  weeklyBookings,
  onCancelPrevious,
  exceedingWeeklyLimit,
}: BookingModalProps) {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBook();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl w-full max-w-md relative shadow-2xl transform transition-all border border-gray-200/50 dark:border-gray-700/50 scale-in-center">
        <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-gray-400 dark:text-gray-500 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <X size={20} />
          </button>
          
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 mb-1">
            {exceedingWeeklyLimit ? 'Weekly Limit Reached' : existingBooking ? 'Replace Existing Booking?' : 'Confirm Booking'}
          </h2>
          
          <div className="flex items-center space-x-4 mt-4">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <Calendar size={18} />
              <span>{format(selectedDate, 'EEEE, MMMM d')}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <Clock size={18} />
              <span>{formatTime(selectedTime)}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {exceedingWeeklyLimit ? (
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium">Weekly booking limit reached</p>
                  <p className="mt-1">You can only have 2 bookings per week. Please choose which booking you'd like to replace:</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {weeklyBookings.map((booking) => (
                  <button
                    key={booking.id}
                    type="button"
                    onClick={() => onCancelPrevious(booking)}
                    className="w-full p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left group"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                          {format(new Date(booking.date), 'EEEE, MMMM d')}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatTime(format(new Date(booking.date), 'HH:mm'))}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                        Replace this
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : existingBooking ? (
            <div className="flex items-start space-x-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium">You already have a booking on this day</p>
                <p className="mt-1">
                  Would you like to cancel your existing booking at{' '}
                  <span className="font-medium">
                    {formatTime(format(new Date(existingBooking.date), 'HH:mm'))}
                  </span>{' '}
                  and book this new time instead?
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">
              Would you like to book this time slot?
            </p>
          )}

          {!exceedingWeeklyLimit && (
            <div className="flex space-x-3">
              {existingBooking ? (
                <>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    Keep Existing
                  </button>
                  <button
                    type="button"
                    onClick={() => onCancelPrevious(existingBooking)}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white py-2.5 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition-all font-medium shadow-sm hover:shadow-md focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20"
                  >
                    Replace Booking
                  </button>
                </>
              ) : (
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white py-2.5 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition-all font-medium shadow-sm hover:shadow-md focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20"
                >
                  Confirm Booking
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}