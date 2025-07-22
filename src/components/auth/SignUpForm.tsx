import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../shared/Button';
import Input from '../shared/Input';

const SignUpForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setPasswordError(null);
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      return;
    }
    try {
      await signup(name, email, password);
      setSuccess(true);
    } catch (err) {
      setError((err as Error).message || 'Failed to sign up. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-slate-800 rounded-xl shadow-2xl">
      <div className="text-center space-y-2">
        <Link to="/" className="flex justify-center mb-4">
          <img src="/new hlailogo.png" alt="HomeListingAI Logo" className="h-12 w-auto" />
        </Link>
        <h2 className="text-3xl font-bold text-center text-sky-400">Create Your Account</h2>
        <p className="text-center text-gray-400">Sign up to start managing your listings and leads.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Full Name"
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Your Name"
          autoComplete="name"
        />
        <Input
          label="Email Address"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          autoComplete="email"
        />
        <Input
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
          autoComplete="new-password"
        />
        {error && <p className="text-xs text-red-400 text-center py-2 bg-red-900/30 rounded">{error}</p>}
        {passwordError && <p className="text-xs text-red-400 text-center py-2 bg-red-900/30 rounded">{passwordError}</p>}
        {success && <p className="text-xs text-green-400 text-center py-2 bg-green-900/30 rounded">Account created! Please check your email to verify your account before logging in.</p>}
        <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
          {isLoading ? 'Signing Up...' : 'Sign Up'}
        </Button>
      </form>
      <div className="text-sm text-center text-gray-500 pt-3 border-t border-slate-700">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-sky-500 hover:text-sky-400">Sign in</Link>
      </div>
    </div>
  );
};

export default SignUpForm; 