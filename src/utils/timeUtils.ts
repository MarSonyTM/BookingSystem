import { format, addDays, isAfter, startOfDay, endOfDay, addMinutes } from 'date-fns';
import { Booking } from '../types/booking';
import { generateTimeSlots } from './dateUtils';

export function getNextAvailableSlot(bookings: Booking[]) {
  const now = new Date();
  const timeSlots = generateTimeSlots(); // Use the same time slots as booking system
  
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

      // Add 30-minute buffer for slots
      const slotWithBuffer = addMinutes(slotDate, -30);

      // Skip if slot is in the past (including buffer)
      if (!isAfter(slotDate, now) || !isAfter(slotWithBuffer, now)) continue;

      // Check if slot is available
      const isBooked = dayBookings.some(booking => {
        const bookingTime = format(new Date(booking.date), 'HH:mm');
        return bookingTime === slot;
      });

      if (!isBooked) {
        // Calculate availability percentage based on remaining slots for the day
        const totalSlotsForDay = timeSlots.length;
        const availableSlots = timeSlots.filter(timeSlot => {
          const [h, m] = timeSlot.split(':').map(Number);
          const timeSlotDate = new Date(currentDate);
          timeSlotDate.setHours(h, m, 0, 0);
          const timeSlotWithBuffer = addMinutes(timeSlotDate, -30);

          // Check if slot is bookable (not in past and not booked)
          const isPast = !isAfter(timeSlotDate, now) || !isAfter(timeSlotWithBuffer, now);
          const isSlotBooked = dayBookings.some(booking => 
            format(new Date(booking.date), 'HH:mm') === timeSlot
          );

          return !isPast && !isSlotBooked;
        }).length;

        const availabilityPercentage = Math.round((availableSlots / totalSlotsForDay) * 100);

        return {
          date: format(slotDate, 'EEE, MMM d'),
          time: format(slotDate, 'HH:mm'),
          full: format(slotDate, 'EEE, MMM d HH:mm'),
          trend: availabilityPercentage
        };
      }
    }
  }

  return null;
} 