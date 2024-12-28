import { Booking } from '../types/booking';
import { startOfWeek, endOfWeek } from 'date-fns';

export function useBookingLimits() {
  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const checkDailyLimit = (bookings: Booking[], selectedDate: Date): boolean => {
    const userBookingsForDay = bookings.filter(
      booking => isSameDay(new Date(booking.date), selectedDate)
    );
    return userBookingsForDay.length < 1;
  };

  const checkWeeklyLimit = (bookings: Booking[], selectedDate: Date): boolean => {
    const userBookingsForWeek = getUserWeeklyBookings(bookings, selectedDate);
    return userBookingsForWeek.length < 2;
  };

  const getUserWeeklyBookings = (bookings: Booking[], selectedDate: Date): Booking[] => {
    const startOfWeekDate = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const endOfWeekDate = endOfWeek(selectedDate, { weekStartsOn: 1 });

    return bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      return bookingDate >= startOfWeekDate && bookingDate <= endOfWeekDate;
    });
  };

  return {
    checkDailyLimit,
    checkWeeklyLimit,
    getUserWeeklyBookings
  };
}