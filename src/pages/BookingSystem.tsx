import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import { generateTimeSlots, generateWeekDays } from '../utils/dateUtils';
import DayColumn from '../components/DayColumn';
import BookingModal from '../components/BookingModal';
import { Booking } from '../types/booking';
import { useAuth } from '../contexts/AuthContext';
import { useBookingLimits } from '../hooks/useBookingLimits';

export default function BookingSystem() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<{
    time: string;
    date: Date;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();
  const { checkDailyLimit, checkWeeklyLimit, getUserWeeklyBookings } = useBookingLimits();

  const timeSlots = generateTimeSlots();
  const weekDays = generateWeekDays();

  const getExistingBooking = (date: Date): Booking | null => {
    if (!user) return null;
    
    return bookings.find(
      booking => 
        booking.userId === user.id &&
        booking.date.toDateString() === date.toDateString()
    ) || null;
  };

  const getTimeSlotsForDay = (date: Date) => {
    return timeSlots.map((time) => {
      const booking = bookings.find(
        (b) =>
          b.date.toDateString() === date.toDateString() &&
          time === new Date(b.date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })
      );

      return {
        time,
        isBooked: !!booking,
        booking,
        serviceType: 'physio', // This would come from the admin's configuration
      };
    });
  };

  const handleBook = () => {
    if (!selectedSlot || !user) return;

    // Check daily limit
    if (!checkDailyLimit(bookings, selectedSlot.date)) {
      setError('You can only book one slot per day');
      setSelectedSlot(null);
      return;
    }

    // Check weekly limit
    if (!checkWeeklyLimit(bookings, selectedSlot.date)) {
      setError('You can only book two slots per week');
      setSelectedSlot(null);
      return;
    }

    const [hours, minutes] = selectedSlot.time.split(':');
    const bookingDate = new Date(selectedSlot.date);
    bookingDate.setHours(parseInt(hours), parseInt(minutes));

    const newBooking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      date: bookingDate,
      userId: user.id,
      serviceType: 'physio', // This would come from the admin's configuration
    };

    setBookings([...bookings, newBooking]);
    setSelectedSlot(null);
    setError(null);
  };

  const handleCancelAndBook = (bookingToCancel: Booking) => {
    if (!selectedSlot || !user) return;

    // Check daily limit for the new booking date
    const existingBookingsForNewDay = bookings.filter(
      booking => 
        booking.userId === user.id &&
        booking.date.toDateString() === selectedSlot.date.toDateString() &&
        booking.id !== bookingToCancel.id
    );

    if (existingBookingsForNewDay.length > 0) {
      setError('You can only book one slot per day');
      setSelectedSlot(null);
      return;
    }
    
    // Remove existing booking
    const updatedBookings = bookings.filter(booking => booking.id !== bookingToCancel.id);
    
    // Add new booking
    const [hours, minutes] = selectedSlot.time.split(':');
    const bookingDate = new Date(selectedSlot.date);
    bookingDate.setHours(parseInt(hours), parseInt(minutes));

    const newBooking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      date: bookingDate,
      userId: user.id,
      serviceType: 'physio',
    };

    setBookings([...updatedBookings, newBooking]);
    setSelectedSlot(null);
    setError(null);
  };

  const handleCancel = (time: string, date: Date) => {
    setBookings(
      bookings.filter(
        (booking) =>
          !(
            booking.date.toDateString() === date.toDateString() &&
            new Date(booking.date).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            }) === time
          )
      )
    );
    setError(null);
  };

  const isExceedingWeeklyLimit = selectedSlot ? !checkWeeklyLimit(bookings, selectedSlot.date) : false;
  const weeklyBookings = selectedSlot ? getUserWeeklyBookings(bookings, selectedSlot.date) : [];

  return (
    <>
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 shadow-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/10">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                Physio & Massage
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
            {error}
          </div>
        )}
        <div className="flex flex-col space-y-4">
          {weekDays.map((day) => (
            <div key={day.dayDate}>
              <DayColumn
                {...day}
                timeSlots={getTimeSlotsForDay(day.date)}
                onBook={(time) => setSelectedSlot({ time, date: day.date })}
                onCancel={(time) => handleCancel(time, day.date)}
              />
            </div>
          ))}
        </div>
      </main>

      <BookingModal
        isOpen={!!selectedSlot}
        onClose={() => {
          setSelectedSlot(null);
          setError(null);
        }}
        onBook={handleBook}
        selectedTime={selectedSlot?.time || ''}
        selectedDate={selectedSlot?.date || new Date()}
        existingBooking={selectedSlot ? getExistingBooking(selectedSlot.date) : null}
        weeklyBookings={weeklyBookings}
        onCancelPrevious={handleCancelAndBook}
        exceedingWeeklyLimit={isExceedingWeeklyLimit}
      />
    </>
  );
}