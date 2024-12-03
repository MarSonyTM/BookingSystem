import { supabase } from './lib/supabase'

async function cleanDatabase() {
  try {
    // First delete all bookings
    const { error: bookingsError } = await supabase
      .from('bookings')
      .delete()
      .not('id', 'is', null);
    if (bookingsError) throw bookingsError;
    console.log('Deleted all bookings');

    // Delete all profiles
    const { error: profilesError } = await supabase
      .from('profiles')
      .delete()
      .not('id', 'is', null);
    if (profilesError) throw profilesError;
    console.log('Deleted all profiles');

    // Note: Cannot delete auth users directly through the client
    // This needs to be done through the Supabase dashboard
    console.log('Note: Please delete users through the Supabase dashboard Auth > Users section');
    console.log('Database cleanup completed');
  } catch (error) {
    console.error('Database cleanup error:', error);
  }
}

cleanDatabase() 