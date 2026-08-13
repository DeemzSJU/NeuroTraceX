/**
 * NeuroTraceX — Supabase Client Instance
 *
 * Configured Supabase JavaScript client for authentication (Google OAuth & Email OTP)
 * and direct database/storage access.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cxvflftxfxtqfzeuimgg.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'dummy-anon-key-placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
