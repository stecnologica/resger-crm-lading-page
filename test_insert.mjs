import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('pilot_registrations').insert([
    {
      name: 'Test',
      phone: '123',
      email: 'test@example.com',
      business_type: 'cafeteria'
    }
  ]);
  console.log("Data:", data);
  console.log("Error:", error);
}

test();
