import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import { generateTimeSlots, generateWeekDays } from '../utils/dateUtils';
import DayColumn from '../components/DayColumn';
import BookingModal from '../components/BookingModal';
import { Booking, TimeSlot } from '../types/booking';
import { useAdmin } from '../contexts/AdminContext';

export default function BookingSystem() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<{
    time: string;
    date: Date;
  } | null>(null);

  const timeSlots = generateTimeSlots();
  const weekDays = generateWeekDays();
  const { weeklySchedule } = useAdmin();

  const getTimeSlotsForDay = (date: Date): TimeSlot[] => {
    const daySchedule = weeklySchedule.find(
      (day) => day.date.toDateString() === date.toDateString()
    );

    return timeSlots.map((time) => {
      const scheduleSlot = daySchedule?.slots.find((slot) => slot.time === time);
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
        service: scheduleSlot?.service || null,
        isBooked: !!booking,
        booking,
      };
    });
  };

  const handleBook = (
    data: { clientName: string; clientEmail: string; service: 'physio' | 'massage' }
  ) => {
    if (!selectedSlot) return;

    const [hours, minutes] = selectedSlot.time.split(':');
    const bookingDate = new Date(selectedSlot.date);
    bookingDate.setHours(parseInt(hours), parseInt(minutes));

    const newBooking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      date: bookingDate,
      ...data,
    };

    setBookings([...bookings, newBooking]);
    setSelectedSlot(null);
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
  };

  return (
    <>
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 shadow-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/10">
                <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                Physio & Massage
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:gap-4 gap-3">
          {weekDays.map((day) => (
            <div 
              key={day.dayDate} 
              className="w-full sm:w-auto transition-all duration-300 ease-in-out"
            >
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
        onClose={() => setSelectedSlot(null)}
        onBook={handleBook}
        selectedTime={selectedSlot?.time || ''}
        selectedDate={selectedSlot?.date || new Date()}
      />
    </>
  );
}