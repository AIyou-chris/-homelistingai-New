// Test script for specific user login
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gezqfksuazkfabhhpaqp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlenFma3N1YXprZmFiaGhwYXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMzU4NzIsImV4cCI6MjA2MTcxMTg3Mn0.DaLGsPHzz42ArvA0v8szH9R-bNkqYPeQkt3BSqCiy5o';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Replace these with your actual email and password
const TEST_EMAIL = 'your-email@example.com'; // CHANGE THIS
const TEST_PASSWORD = 'your-password'; // CHANGE THIS

async function testSpecificUser() {
  console.log(`Testing login for: ${TEST_EMAIL}`);
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });
    
    if (error) {
      console.error('❌ Login failed:', error.message);
      
      if (error.message.includes('Invalid login credentials')) {
        console.log('\n💡 Possible issues:');
        console.log('1. Email not confirmed - check your inbox for confirmation link');
        console.log('2. Wrong password - try resetting it');
        console.log('3. User doesn\'t exist - try signing up again');
      }
      
      return false;
    }
    
    console.log('✅ Login successful!');
    console.log('User ID:', data.user.id);
    console.log('Email confirmed:', data.user.email_confirmed_at ? 'Yes' : 'No');
    console.log('User metadata:', data.user.user_metadata);
    return true;
  } catch (err) {
    console.error('❌ Test failed:', err);
    return false;
  }
}

testSpecificUser().then(success => {
  console.log('\nTest result:', success ? 'PASSED' : 'FAILED');
  process.exit(success ? 0 : 1);
}); 