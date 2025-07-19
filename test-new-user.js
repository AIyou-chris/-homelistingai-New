// Test login with the user we just created
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gezqfksuazkfabhhpaqp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlenFma3N1YXprZmFiaGhwYXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMzU4NzIsImV4cCI6MjA2MTcxMTg3Mn0.DaLGsPHzz42ArvA0v8szH9R-bNkqYPeQkt3BSqCiy5o';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test with the user we just created
const TEST_EMAIL = 'test-fix@example.com';
const TEST_PASSWORD = 'Test123!';

async function testNewUser() {
  console.log(`Testing login for: ${TEST_EMAIL}`);
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });
    
    if (error) {
      console.error('❌ Login failed:', error.message);
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

testNewUser().then(success => {
  console.log('\nTest result:', success ? 'PASSED' : 'FAILED');
  process.exit(success ? 0 : 1);
}); 