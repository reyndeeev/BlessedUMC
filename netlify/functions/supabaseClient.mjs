// This file initializes the Supabase client for server-side use in Netlify functions.
import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase project URL and service_role key
const SUPABASE_URL = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'YOUR_SUPABASE_SERVICE_ROLE_KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
 