import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useSupabase } from '../contexts/SupabaseContext';

export function useBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSupabase();

  useEffect(() => {
    if (!user) return;

    const fetchBookings = async () => {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: true });

        if (error) throw error;
        setBookings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

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
        (payload) => {
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

    const { data, error } = await supabase
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

    if (error) throw error;
    return data;
  };

  const cancelBooking = async (bookingId: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId)
      .eq('user_id', user.id);

    if (error) throw error;
  };

  return {
    bookings,
    loading,
    error,
    createBooking,
    cancelBooking
  };
}