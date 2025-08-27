// This script seeds the admin user into Supabase. Run it once in your Netlify function environment or locally.
import { supabase } from "./supabaseClient.mjs";

async function seedAdmin() {
  const { data, error } = await supabase
    .from('users')
    .insert([{ username: 'admin', password: 'admin123' }]);
  if (error) {
    console.error('Error seeding admin:', error);
  } else {
    console.log('Admin user seeded:', data);
  }
}

seedAdmin();
