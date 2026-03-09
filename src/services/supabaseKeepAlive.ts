import { supabase } from '@/lib/supabase';

// Keep Supabase active by pinging every 5 minutes
export function startSupabaseKeepAlive() {
  const pingDatabase = async () => {
    try {
      // Simple query to keep connection alive
      await supabase.from('products').select('id').limit(1);
      console.log('Supabase keep-alive ping successful');
    } catch (error) {
      console.error('Supabase keep-alive ping failed:', error);
    }
  };

  // Ping immediately
  pingDatabase();

  // Ping every 5 minutes (300000ms)
  setInterval(pingDatabase, 300000);
}
