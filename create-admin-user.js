const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://gezqfksuazkfabhhpaqp.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlenFma3N1YXprZmFiaGhwYXFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjEzNTg3MiwiZXhwIjoyMDYxNzExODcyfQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'; // You'll need to get this from your Supabase dashboard

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser() {
  try {
    console.log('Creating admin user...');
    
    // Create the user with admin role
    const { data: user, error: userError } = await supabase.auth.admin.createUser({
      email: 'support@homelistingai.com',
      password: 'Jake@2024',
      email_confirm: true,
      user_metadata: {
        name: 'Admin User',
        role: 'admin'
      }
    });

    if (userError) {
      console.error('Error creating user:', userError);
      return;
    }

    console.log('Admin user created successfully:', user);
    
    // Also insert into the profiles table if it exists
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: user.user.id,
        email: 'support@homelistingai.com',
        name: 'Admin User',
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (profileError) {
      console.log('Profile insert error (this might be expected):', profileError);
    } else {
      console.log('Profile created successfully');
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

createAdminUser(); 