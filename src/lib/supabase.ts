import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const fallbackUrl = 'https://hdeepkpiacfjdrlydemc.supabase.co';
const fallbackPublishableKey = 'sb_publishable_NoaJrSfFpGKh4ZjBjF-sgQ_TwgDiVAL';

// Preview builds must never authenticate against the production membership backend.
const forceDemoMode = import.meta.env.PUBLIC_PREVIEW_DEMO_MODE === 'true';
const supabaseUrl = forceDemoMode ? '' : (import.meta.env.PUBLIC_SUPABASE_URL?.trim() || fallbackUrl);
const supabaseKey = forceDemoMode ? '' : (import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() || fallbackPublishableKey);

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
