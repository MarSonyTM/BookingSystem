import { useAuth } from '../contexts/AuthContext';
import { Booking } from '../types/booking';

export function useBookingLimits() {
  const { user } = useAuth();

  const checkDailyLimit = (bookings: Booking[], selectedDate: Date): boolean => {
    if (!user) return false;
    
    const userBookingsForDay = bookings.filter(
      booking => 
        booking.userId === user.id &&
        booking.date.toDateString() === selectedDate.toDateString()
    );
    
    return userBookingsForDay.length === 0;
  };

  const checkWeeklyLimit = (bookings: Booking[], selectedDate: Date): boolean => {
    if (!user) return false;

    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const userBookingsForWeek = getUserWeeklyBookings(bookings, selectedDate);

    return userBookingsForWeek.length < 2;
  };

  const getUserWeeklyBookings = (bookings: Booking[], selectedDate: Date): Booking[] => {
    if (!user) return [];

    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

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