// Test script to verify login functionality
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gezqfksuazkfabhhpaqp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlenFma3N1YXprZmFiaGhwYXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMzU4NzIsImV4cCI6MjA2MTcxMTg3Mn0.DaLGsPHzz42ArvA0v8szH9R-bNkqYPeQkt3BSqCiy5o';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLogin() {
  console.log('Testing login functionality...');
  
  try {
    // Test with admin credentials
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'support@homelistingai.com',
      password: 'Jake@2024'
    });
    
    if (error) {
      console.error('Login failed:', error);
      return false;
    }
    
    console.log('Login successful:', data.user);
    return true;
  } catch (err) {
    console.error('Test failed:', err);
    return false;
  }
}

testLogin().then(success => {
  console.log('Test result:', success ? 'PASSED' : 'FAILED');
  process.exit(success ? 0 : 1);
}); 