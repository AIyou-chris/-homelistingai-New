
// Quick demo login - paste this in your browser console on localhost:3001

// Method 1: Auto demo login
window.demoLogin = function() {
  const demoUser = {
    id: 'demo-user-agent',
    email: 'agent@demo.com',
    name: 'Demo Agent',
    role: 'agent',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    app_metadata: {},
    user_metadata: { name: 'Demo Agent', role: 'agent' },
    aud: 'authenticated',
  };
  
  localStorage.setItem('demo_user', JSON.stringify(demoUser));
  localStorage.setItem('demo_session', 'true');
  console.log('✅ Demo login set! Refresh the page.');
  window.location.reload();
};

// Method 2: Use this in console: demoLogin()
console.log('🎯 Run: demoLogin() in console to login as demo agent');

