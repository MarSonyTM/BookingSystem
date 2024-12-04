import { format, addDays, isAfter, startOfDay, endOfDay } from 'date-fns';
import { Booking } from '../types/booking';

export function getNextAvailableSlot(bookings: Booking[]) {
  const now = new Date();
  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  
  // Look ahead for the next 5 days
  for (let i = 0; i < 5; i++) {
    const currentDate = addDays(now, i);
    const dayStart = startOfDay(currentDate);
    const dayEnd = endOfDay(currentDate);

    // Get bookings for this day
    const dayBookings = bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      return bookingDate >= dayStart && bookingDate <= dayEnd;
    });

    // Find first available slot
    for (const slot of timeSlots) {
      const [hours, minutes] = slot.split(':').map(Number);
      const slotDate = new Date(currentDate);
      slotDate.setHours(hours, minutes, 0, 0);

      // Skip if slot is in the past
      if (!isAfter(slotDate, now)) continue;

      // Check if slot is available
      const isBooked = dayBookings.some(booking => {
        const bookingTime = new Date(booking.date).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
        return bookingTime === slot;
      });

      if (!isBooked) {
        return {
          date: format(slotDate, 'EEE, MMM d'),
          time: format(slotDate, 'HH:mm'),
          full: format(slotDate, 'EEE, MMM d HH:mm')
        };
      }
    }
  }

  return null;
} 