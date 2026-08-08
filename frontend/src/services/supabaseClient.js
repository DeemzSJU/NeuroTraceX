/**
 * NeuroTraceX — Supabase Client Instance
 *
 * Configured Supabase JavaScript client for authentication (Google OAuth & Email OTP)
 * and direct database/storage access.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || process.env.SUPABASE_URL || 'https://cxvflftxfxtqfzeuimgg.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'dummy-anon-key-placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
