import { useSupabase } from '../contexts/SupabaseContext';
import { Booking } from '../types/booking';
import { startOfWeek as getStartOfWeek, endOfWeek as getEndOfWeek } from 'date-fns';

export function useBookingLimits() {
  const { user } = useSupabase();

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const checkDailyLimit = (bookings: Booking[], selectedDate: Date): boolean => {
    if (!user) return false;
    
    const userBookingsForDay = bookings.filter(
      booking => 
        booking.userId === user.id &&
        isSameDay(new Date(booking.date), selectedDate)
    );
    
    return userBookingsForDay.length < 1;
  };

  const checkWeeklyLimit = (bookings: Booking[], selectedDate: Date): boolean => {
    if (!user) return false;

    const startOfWeek = getStartOfWeek(selectedDate, { weekStartsOn: 1 });
    const endOfWeek = getEndOfWeek(selectedDate, { weekStartsOn: 1 });

    const userBookingsForWeek = getUserWeeklyBookings(bookings, selectedDate);

    return userBookingsForWeek.length < 2;
  };

  const getUserWeeklyBookings = (bookings: Booking[], selectedDate: Date): Booking[] => {
    if (!user) return [];

    const startOfWeek = getStartOfWeek(selectedDate, { weekStartsOn: 1 });
    const endOfWeek = getEndOfWeek(selectedDate, { weekStartsOn: 1 });

    return bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      return (
        booking.userId === user.id &&
        bookingDate >= startOfWeek &&
        bookingDate <= endOfWeek
      );
    });
  };

  return {
    checkDailyLimit,
    checkWeeklyLimit,
    getUserWeeklyBookings
  };
}