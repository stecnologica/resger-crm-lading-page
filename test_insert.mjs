import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nvruefczenukdhlalseq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52cnVlZmN6ZW51a2RobGFsc2VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3NDgxMTgsImV4cCI6MjA5MzMyNDExOH0.e7l01xMgiA3l2ZiPFD_KfrBCbI6gS-QeRhyA7C5Vsl8';

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
