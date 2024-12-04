import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import { generateTimeSlots, generateWeekDays } from '../utils/dateUtils';
import DayColumn from '../components/DayColumn';
import BookingModal from '../components/BookingModal';
import { Booking } from '../types/booking';
import { useSupabase } from '../contexts/SupabaseContext';
import { useBookingLimits } from '../hooks/useBookingLimits';
import { useBookings } from '../hooks/useBookings';
import { isBefore, isSameDay, addMinutes, startOfToday } from 'date-fns';

export default function BookingSystem() {
  const [selectedSlot, setSelectedSlot] = useState<{
    time: string;
    date: Date;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useSupabase();
  const { bookings, loading, createBooking, cancelBooking, refetch } = useBookings();
  const { checkDailyLimit, checkWeeklyLimit, getUserWeeklyBookings } = useBookingLimits();

  const timeSlots = generateTimeSlots();
  const weekDays = generateWeekDays();

  const getExistingBooking = (date: Date): Booking | null => {
    if (!user) return null;
    
    return bookings.find(
      booking => 
        booking.userId === user.id &&
        new Date(booking.date).toDateString() === date.toDateString()
    ) || null;
  };

  const getTimeSlotsForDay = (date: Date) => {
    const now = new Date();
    const today = startOfToday();
    const isToday = isSameDay(date, today);
    const isPastDay = isBefore(date, today);

    return timeSlots.map((time) => {
      const [hours, minutes] = time.split(':');
      const slotDate = new Date(date);
      slotDate.setHours(parseInt(hours), parseInt(minutes));

      // Add 30 minutes buffer for booking
      const slotWithBuffer = addMinutes(slotDate, -30);
      
      // Mark as past if:
      // 1. It's a past day, or
      // 2. It's today and the slot (with buffer) is in the past
      const isPastSlot = isPastDay || (isToday && isBefore(slotWithBuffer, now));

      const booking = bookings.find(
        (b) => {
          const bookingDate = new Date(b.date);
          return bookingDate.toDateString() === date.toDateString() &&
            bookingDate.getHours() === parseInt(hours) &&
            bookingDate.getMinutes() === parseInt(minutes);
        }
      );

      return {
        time,
        isBooked: !!booking,
        booking,
        serviceType: 'physio',
        isPast: isPastSlot
      };
    });
  };

  const handleBook = async () => {
    if (!selectedSlot || !user) return;

    try {
      setError(null);

      const [hours, minutes] = selectedSlot.time.split(':');
      const bookingDate = new Date(selectedSlot.date);
      bookingDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      // Add 30 minutes buffer for booking
      const now = new Date();
      const bookingWithBuffer = addMinutes(bookingDate, -30);
      
      // Check if trying to book a past slot
      if (isBefore(bookingWithBuffer, now)) {
        setError('Cannot book appointments less than 30 minutes in advance');
        setSelectedSlot(null);
        return;
      }

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
      
      await createBooking(bookingDate.toISOString(), 'physio');
      await refetch();
      setSelectedSlot(null);
    } catch (err) {
      console.error('Booking error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    }
  };

  const handleCancelAndBook = async (bookingToCancel: Booking) => {
    if (!selectedSlot || !user) return;

    try {
      setError(null);

      // Check daily limit for the new booking date
      const existingBookingsForNewDay = bookings.filter(
        booking => 
          booking.userId === user.id &&
          new Date(booking.date).toDateString() === selectedSlot.date.toDateString() &&
          booking.id !== bookingToCancel.id
      );

      if (existingBookingsForNewDay.length > 0) {
        setError('You can only book one slot per day');
        setSelectedSlot(null);
        return;
      }
      
      // Cancel existing booking
      await cancelBooking(bookingToCancel.id);
      
      // Create new booking
      const [hours, minutes] = selectedSlot.time.split(':');
      const bookingDate = new Date(selectedSlot.date);
      bookingDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      await createBooking(bookingDate.toISOString(), 'physio');
      await refetch(); // Refresh bookings after updating
      setSelectedSlot(null);
    } catch (err) {
      console.error('Booking update error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update booking');
    }
  };

  const handleCancel = async (time: string, date: Date) => {
    try {
      setError(null);
      const [hours, minutes] = time.split(':');
      const slotDate = new Date(date);
      slotDate.setHours(parseInt(hours), parseInt(minutes));

      const booking = bookings.find(
        (b) => {
          const bookingDate = new Date(b.date);
          return bookingDate.toDateString() === date.toDateString() &&
            bookingDate.getHours() === parseInt(hours) &&
            bookingDate.getMinutes() === parseInt(minutes);
        }
      );

      if (booking) {
        await cancelBooking(booking.id);
        await refetch(); // Refresh bookings after cancelling
      }
    } catch (err) {
      console.error('Cancel error:', err);
      setError(err instanceof Error ? err.message : 'Failed to cancel booking');
    }
  };

  const isExceedingWeeklyLimit = selectedSlot ? !checkWeeklyLimit(bookings, selectedSlot.date) : false;
  const weeklyBookings = selectedSlot ? getUserWeeklyBookings(bookings, selectedSlot.date) : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

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