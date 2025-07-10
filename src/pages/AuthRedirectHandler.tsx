import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';

const AuthRedirectHandler: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const state = params.get('state'); // user_id
    const error = params.get('error');

    if (error) {
      setStatus('error');
      setMessage(`Error: ${error}`);
      return;
    }

    if (code && state) {
      // Call backend to exchange code for tokens and store them
      fetch('/functions/v1/calendly-oauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, redirect_uri: window.location.origin + '/auth', user_id: state }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setStatus('success');
            setMessage('Calendly connected! You can close this window or return to the app.');
            setTimeout(() => navigate('/settings'), 2000);
          } else {
            setStatus('error');
            setMessage(data.error || 'Failed to connect Calendly.');
          }
        })
        .catch(err => {
          setStatus('error');
          setMessage('Network error: ' + err.message);
        });
    } else {
      setStatus('error');
      setMessage('Missing authorization code or user.');
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        {status === 'loading' && <LoadingSpinner size="lg" />}
        <h1 className="text-2xl font-bold mb-4">Connecting Account...</h1>
        <p className="text-gray-700 mb-2">{message || 'Please wait while we complete the connection.'}</p>
        {status === 'success' && <p className="text-green-600 font-semibold">Success! Redirecting...</p>}
        {status === 'error' && <p className="text-red-600 font-semibold">There was a problem connecting your account.</p>}
      </div>
    </div>
  );
};

export default AuthRedirectHandler; 