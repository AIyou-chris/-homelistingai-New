import React from 'react';
import PayPalSignUpForm from '../components/auth/PayPalSignUpForm';

const PayPalSignUpPage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-sky-900 to-indigo-900">
    <div className="flex w-full max-w-5xl shadow-2xl rounded-3xl overflow-hidden bg-white/10 backdrop-blur-xl border border-slate-700">
      {/* Left: Exciting Marketing Section */}
      <div className="flex flex-col justify-center items-center w-1/2 p-12 bg-gradient-to-br from-sky-700/80 to-indigo-800/80 text-white relative">
        <img src="/ornelogog-11 copy.png" alt="HomeListingAI Logo" className="h-14 mb-8 drop-shadow-xl" />
        <h1 className="text-4xl font-extrabold mb-4 tracking-tight drop-shadow-lg text-center">Welcome to HomeListingAI</h1>
        <p className="text-lg mb-6 text-slate-100/90 max-w-xs text-center font-semibold">
          The all-in-one AI platform for real estate agents who want to dominate their market, save hours every week, and close more deals—faster.
        </p>
        <div className="mb-6 w-full max-w-xs">
          <h2 className="text-xl font-bold mb-2 text-sky-200 uppercase tracking-wide">Why Join Now?</h2>
          <ul className="space-y-3 text-base font-medium">
            <li className="flex items-start gap-3">
              <span className="text-sky-300 text-2xl">🚀</span>
              <span>Instant, AI-powered listing descriptions that make your properties irresistible</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-sky-300 text-2xl">📈</span>
              <span>Built-in lead generation & CRM—never lose a hot lead again</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-sky-300 text-2xl">📱</span>
              <span>Mobile-first dashboard—run your business from anywhere</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-sky-300 text-2xl">🔒</span>
              <span>Private, secure, and ad-free—your data is always yours</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-sky-300 text-2xl">🤝</span>
              <span>Ongoing, priority support from real humans who care about your success</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-sky-300 text-2xl">✨</span>
              <span>Early access to new AI tools and exclusive features—stay ahead of the competition</span>
            </li>
          </ul>
        </div>
        <div className="mb-8 w-full max-w-xs">
          <h2 className="text-xl font-bold mb-2 text-indigo-200 uppercase tracking-wide">What You Unlock:</h2>
          <ul className="space-y-2 text-base">
            <li className="flex items-center gap-2"><span className="text-indigo-300">•</span> Unlimited listings & edits</li>
            <li className="flex items-center gap-2"><span className="text-indigo-300">•</span> Advanced AI features</li>
            <li className="flex items-center gap-2"><span className="text-indigo-300">•</span> Priority support</li>
            <li className="flex items-center gap-2"><span className="text-indigo-300">•</span> Early access to new tools</li>
          </ul>
        </div>
        <div className="w-full max-w-xs mb-6">
          <div className="bg-white/10 rounded-xl p-4 text-center shadow-lg border border-white/10">
            <span className="block text-lg font-bold text-sky-300 mb-2">Ready to stand out?</span>
            <span className="block text-base text-white mb-2">Join a community of top agents who are closing more deals with less effort.</span>
            <span className="block text-base text-sky-200">Sign up now—your future clients are waiting!</span>
          </div>
        </div>
        <div className="absolute bottom-6 left-0 w-full flex justify-center">
          <span className="text-xs text-slate-200/60">© 2025 HomeListingAI</span>
        </div>
      </div>
      {/* Right: Signup Form */}
      <div className="flex flex-col justify-center items-center w-1/2 p-8 bg-white/80 dark:bg-slate-900/80">
        <PayPalSignUpForm />
      </div>
    </div>
  </div>
);

export default PayPalSignUpPage; 