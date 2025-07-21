// Script to create test users in cloud Supabase
const SUPABASE_URL = 'https://gezqfksuazkfabhhpaqp.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlenFma3N1YXprZmFiaGhwYXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMzU4NzIsImV4cCI6MjA2MTcxMTg3Mn0.DaLGsPHzz42ArvA0v8szH9R-bNkqYPeQkt3BSqCiy5o';

async function createTestUsers() {
  try {
    console.log('Creating test users...');
    
    // Test Agent User
    const agentResponse = await fetch(`${SUPABASE_URL}/functions/v1/auth-signup-handler`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`
      },
      body: JSON.stringify({
        email: 'agent@homelistingai.com',
        password: 'AgentPass123!',
        name: 'Test Agent',
        role: 'agent'
      })
    });

    const agentResult = await agentResponse.json();
    console.log('Agent user result:', agentResult);

    if (!agentResponse.ok) {
      console.error('Failed to create agent user:', agentResult);
    } else {
      console.log('Agent user created successfully!');
    }

    // Test Admin User (if not exists)
    const adminResponse = await fetch(`${SUPABASE_URL}/functions/v1/auth-signup-handler`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`
      },
      body: JSON.stringify({
        email: 'admin@homelistingai.com',
        password: 'AdminPass123!',
        name: 'Test Admin',
        role: 'admin'
      })
    });

    const adminResult = await adminResponse.json();
    console.log('Admin user result:', adminResult);

    if (!adminResponse.ok) {
      console.error('Failed to create admin user:', adminResult);
    } else {
      console.log('Admin user created successfully!');
    }

  } catch (error) {
    console.error('Error creating test users:', error);
  }
}

createTestUsers(); 