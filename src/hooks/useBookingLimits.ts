import { useSupabase } from '../contexts/SupabaseContext';
import { Booking } from '../types/booking';

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
    
    return userBookingsForDay.length === 0;
  };

  const checkWeeklyLimit = (bookings: Booking[], selectedDate: Date): boolean => {
    if (!user) return false;

    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const userBookingsForWeek = getUserWeeklyBookings(bookings, selectedDate);

    return userBookingsForWeek.length < 2;
  };

  const getUserWeeklyBookings = (bookings: Booking[], selectedDate: Date): Booking[] => {
    if (!user) return [];

    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return bookings.filter(booking => {
      if (booking.userId !== user.id) return false;
      const bookingDate = new Date(booking.date);
      return bookingDate >= startOfWeek && bookingDate <= endOfWeek;
    });
  };

  return {
    checkDailyLimit,
    checkWeeklyLimit,
    getUserWeeklyBookings,
  };
}