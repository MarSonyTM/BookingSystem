import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useSupabase } from '../contexts/SupabaseContext';
import { Booking } from '../types/booking';

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useSupabase();

  const fetchBookings = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .order('date', { ascending: true });

      if (error) throw error;
      
      // Convert the bookings to the correct format
      const formattedBookings: Booking[] = data.map(booking => ({
        id: booking.id,
        date: new Date(booking.date),
        userId: booking.user_id,
        serviceType: booking.service_type
      }));
      
      setBookings(formattedBookings);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    fetchBookings();

    // Subscribe to changes
    const subscription = supabase
      .channel('bookings_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'bookings',
          filter: `user_id=eq.${user.id}`
        }, 
        () => {
          // Update bookings when changes occur
          fetchBookings();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const createBooking = async (date: string, serviceType: 'physio' | 'massage') => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            user_id: user.id,
            date: date,
            service_type: serviceType,
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      // Convert the booking to the correct format
      const formattedBooking: Booking = {
        id: data.id,
        date: new Date(data.date),
        userId: data.user_id,
        serviceType: data.service_type
      };

      // Update local state
      setBookings(prev => [...prev, formattedBooking]);
      
      return formattedBooking;
    } catch (err) {
      console.error('Error creating booking:', err);
      throw err;
    }
  };

  const cancelBooking = async (bookingId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setBookings(prev => prev.filter(b => b.id !== bookingId));
    } catch (err) {
      console.error('Error cancelling booking:', err);
      throw err;
    }
  };

  return {
    bookings,
    loading,
    error,
    createBooking,
    cancelBooking,
    refetch: fetchBookings
  };
}