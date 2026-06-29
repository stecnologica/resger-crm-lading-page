import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nvruefczenukdhlalseq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52cnVlZmN6ZW51a2RobGFsc2VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3NDgxMTgsImV4cCI6MjA5MzMyNDExOH0.e7l01xMgiA3l2ZiPFD_KfrBCbI6gS-QeRhyA7C5Vsl8';

export const supabase = createClient(supabaseUrl, supabaseKey);
