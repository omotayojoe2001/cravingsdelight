import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ootzekjdfcejtwssfwpv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vdHpla2pkZmNlanR3c3Nmd3B2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyOTEzMTIsImV4cCI6MjA4MDg2NzMxMn0.Lx3RUI8wzrFbN1rcOoahTzPcAQQ7qAabOKjF-o5TgEE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
