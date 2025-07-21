// Script to check users in Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gezqfksuazkfabhhpaqp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlenFma3N1YXprZmFiaGhwYXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMzU4NzIsImV4cCI6MjA2MTcxMTg3Mn0.DaLGsPHzz42ArvA0v8szH9R-bNkqYPeQkt3BSqCiy5o';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkUsers() {
  console.log('Checking users in Supabase...');
  
  try {
    // Note: This requires admin privileges, so it might not work with anon key
    // But let's try to get current session info
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error);
    } else {
      console.log('Current session:', session ? 'Active' : 'None');
    }
    
    // Try to list users (this might not work with anon key)
    console.log('\nTrying to check users...');
    console.log('Note: This might not work with anonymous key - you may need to check via Supabase Dashboard');
    
  } catch (err) {
    console.error('Error:', err);
  }
}

checkUsers(); 