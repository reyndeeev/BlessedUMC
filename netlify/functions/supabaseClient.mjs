// This file initializes the Supabase client for server-side use in Netlify functions.
import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase project URL and service_role key
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://unkaptrjqaveyfqeildi.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVua2FwdHJqcWF2ZXlmcWVpbGRpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjMwNzc4OSwiZXhwIjoyMDcxODgzNzg5fQ.l7Fu_X9iT4AH6uLzlaKM1Rhdnkm5MXSc9CVeejButxY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
 