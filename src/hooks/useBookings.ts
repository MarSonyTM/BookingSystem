import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Booking } from '../types/booking';
import { useSupabase } from '../contexts/SupabaseContext';

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useSupabase();

  const fetchBookings = async () => {
    try {
      if (!user) return;

      const { data, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (fetchError) throw fetchError;
      
      const formattedBookings: Booking[] = (data || []).map(booking => ({
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
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const createBooking = async (date: string, serviceType: 'physio' | 'massage') => {
    try {
      if (!user) throw new Error('User not authenticated');

      const { data, error: insertError } = await supabase
        .from('bookings')
        .insert([
          {
            user_id: user.id,
            date,
            service_type: serviceType,
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (insertError) throw insertError;
      
      const newBooking: Booking = {
        id: data.id,
        date: new Date(data.date),
        userId: data.user_id,
        serviceType: data.service_type
      };

      setBookings(prev => [...prev, newBooking]);
      return newBooking;
    } catch (err) {
      console.error('Error creating booking:', err);
      throw err;
    }
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);

      if (deleteError) throw deleteError;
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