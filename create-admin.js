// Simple script to create admin user
async function createAdminUser() {
  try {
    console.log('Creating admin user via Edge Function...');
    
    const response = await fetch('https://gezqfksuazkfabhhpaqp.supabase.co/functions/v1/auth-signup-handler', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlenFma3N1YXprZmFiaGhwYXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMzU4NzIsImV4cCI6MjA2MTcxMTg3Mn0.DaLGsPHzz42ArvA0v8szH9R-bNkqYPeQkt3BSqCiy5o',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlenFma3N1YXprZmFiaGhwYXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMzU4NzIsImV4cCI6MjA2MTcxMTg3Mn0.DaLGsPHzz42ArvA0v8szH9R-bNkqYPeQkt3BSqCiy5o'
      },
      body: JSON.stringify({
        email: 'support@homelistingai.com',
        password: 'Jake@2024',
        name: 'Admin User',
        role: 'admin' // Set as admin
      })
    });

    const result = await response.json();
    console.log('Response:', result);

    if (!response.ok) {
      console.error('Failed to create admin user:', result);
    } else {
      console.log('Admin user created successfully!');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdminUser(); 