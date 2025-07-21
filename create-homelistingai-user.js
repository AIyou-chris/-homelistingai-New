// Script to create homelistingai@gmail.com user
const SUPABASE_URL = 'https://gezqfksuazkfabhhpaqp.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlenFma3N1YXprZmFiaGhwYXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMzU4NzIsImV4cCI6MjA2MTcxMTg3Mn0.DaLGsPHzz42ArvA0v8szH9R-bNkqYPeQkt3BSqCiy5o';

async function createHomelistingAIUser() {
  try {
    console.log('Creating homelistingai@gmail.com user...');
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/auth-signup-handler`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`
      },
      body: JSON.stringify({
        email: 'homelistingai@gmail.com',
        password: 'Jake@2024',
        name: 'HomeListingAI User',
        role: 'admin'
      })
    });

    const result = await response.json();
    console.log('Response:', result);

    if (!response.ok) {
      console.error('Failed to create user:', result);
    } else {
      console.log('✅ User created successfully!');
      console.log('📧 Email: homelistingai@gmail.com');
      console.log('🔑 Password: Jake@2024');
    }
  } catch (error) {
    console.error('Error creating user:', error);
  }
}

createHomelistingAIUser(); 