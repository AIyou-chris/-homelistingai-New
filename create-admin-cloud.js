// Script to create admin user in cloud Supabase
const SUPABASE_URL = 'https://gezqfksuazkfabhhpaqp.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlenFma3N1YXprZmFiaGhwYXFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MjA2MTcxMTg3Mn0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';

async function createAdminUser() {
  try {
    console.log('Creating admin user in cloud Supabase...');
    
    // Create user with admin role
    const response = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({
        email: 'support@homelistingai.com',
        password: 'Jake@2024',
        email_confirm: true,
        user_metadata: {
          name: 'Admin User',
          role: 'admin'
        }
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