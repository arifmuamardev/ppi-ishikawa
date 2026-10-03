import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const fallbackUrl = 'https://hdeepkpiacfjdrlydemc.supabase.co';
const fallbackPublishableKey = 'sb_publishable_NoaJrSfFpGKh4ZjBjF-sgQ_TwgDiVAL';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL?.trim() || fallbackUrl;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() || fallbackPublishableKey;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
