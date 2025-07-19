import React, { useState } from 'react';
import { X, Calendar, Clock, User, Mail, Building2, Mic, Phone, Sparkles } from 'lucide-react';
import * as appointmentService from '../../services/appointmentService';

interface ConsultationModalProps {
  open: boolean;
  onClose: () => void;
  context?: 'default' | 'white-label';
}

const ConsultationModal: React.FC<ConsultationModalProps> = ({ open, onClose, context = 'default' }) => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    date: '',
    time: '',
    goals: '',
    website: '', // Honeypot field - hidden from users
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Spam prevention: Check if honeypot field is filled (bots will fill it)
    if (form.website) {
      setError('Invalid submission detected.');
      setSubmitting(false);
      return;
    }

    // Basic validation
    if (!form.name || !form.email || !form.phone) {
      setError('Please fill in all required fields.');
      setSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError('Please enter a valid email address.');
      setSubmitting(false);
      return;
    }

    try {
      // 1. Create appointment in Supabase
      await appointmentService.createAppointment({
        name: form.name,
        email: form.email,
        phone: form.phone,
        preferredDate: form.date,
        preferredTime: form.time,
        message: form.goals,
      });
      // 2. Send email to support@homelistingai.com
      await fetch('https://gezqfksuazkfabhhpaqp.functions.supabase.co/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: ['support@homelistingai.com', 'cdipotter@me.com'],
          subject: 'New AI Consultation Booking',
          html: `
            <h2>New AI Consultation Booking</h2>
            <p><b>Name:</b> ${form.name}</p>
            <p><b>Email:</b> ${form.email}</p>
            <p><b>Phone:</b> ${form.phone}</p>
            <p><b>Company:</b> ${form.company}</p>
            <p><b>Date:</b> ${form.date}</p>
            <p><b>Time:</b> ${form.time}</p>
            <p><b>Goals:</b> ${form.goals}</p>
          `
        })
      });
      setSuccess(true);
    } catch (err) {
      setError('There was a problem booking your consultation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full relative animate-pop-in">
        {/* Header */}
        <div className="rounded-t-2xl p-6 pb-4 bg-gradient-to-r from-sky-400 to-blue-500 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-7 h-7 text-white/90" />
            <h2 className="text-2xl font-bold">
              {context === 'white-label' ? 'Book Your White Label Consultation' : 'Book Your Free AI Consultation'}
            </h2>
          </div>
          <p className="text-white/90 text-sm mb-4">
            Discover how HomeListingAI can transform your real estate business
          </p>
          <div className="flex gap-4 text-center mb-2">
            <div className="flex-1">
              <div className="font-bold text-lg">30min</div>
              <div className="text-xs opacity-80">Duration</div>
            </div>
            <div className="flex-1">
              <div className="font-bold text-lg">Free</div>
              <div className="text-xs opacity-80">No Cost</div>
            </div>
            <div className="flex-1">
              <div className="font-bold text-lg">AI Demo</div>
              <div className="text-xs opacity-80">Live Preview</div>
            </div>
          </div>
        </div>
        {/* Form */}
        {success ? (
          <div className="p-6 text-center">
            <div className="text-green-600 text-2xl mb-2">✓</div>
            <div className="text-lg font-semibold mb-2">Thank you!</div>
            <div className="text-gray-700 mb-4">Your consultation has been booked. We'll be in touch soon.</div>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg" onClick={onClose}>Close</button>
          </div>
        ) : (
        <form className="p-6 pt-4 space-y-4" onSubmit={handleSubmit}>
          {error && <div className="bg-red-100 text-red-700 p-2 rounded text-sm">{error}</div>}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold mb-1">Full Name *</label>
              <div className="relative">
                <User className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                <input className="w-full pl-8 pr-2 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" required placeholder="Your full name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} disabled={submitting} />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold mb-1">Phone Number *</label>
              <div className="relative">
                <Phone className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                <input className="w-full pl-8 pr-2 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" required placeholder="(555) 123-4567" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} disabled={submitting} />
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                <input className="w-full pl-8 pr-2 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" required placeholder="your@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} disabled={submitting} />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold mb-1">Real Estate Company</label>
              <div className="relative">
                <Building2 className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                <input className="w-full pl-8 pr-2 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Your brokerage or company" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} disabled={submitting} />
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold mb-1">Preferred Date *</label>
              <div className="relative">
                <Calendar className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                <input type="date" className="w-full pl-8 pr-2 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" required value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} disabled={submitting} />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold mb-1">Preferred Time *</label>
              <div className="relative">
                <Clock className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                <input type="time" className="w-full pl-8 pr-2 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" required value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} disabled={submitting} />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">What are your main goals? *</label>
            <div className="relative">
              <Mic className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
              <textarea className="w-full pl-8 pr-2 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" required placeholder="Tell us about your current challenges and what you'd like to achieve with AI..." value={form.goals} onChange={e => setForm(f => ({ ...f, goals: e.target.value }))} disabled={submitting} />
            </div>
          </div>
          {/* Honeypot field - hidden from users but visible to bots */}
          <div style={{ position: 'absolute', left: '-9999px', opacity: 0 }}>
            <input
              type="text"
              name="website"
              value={form.website}
              onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          {/* What to expect info box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900 flex gap-2 items-start">
            <Sparkles className="w-5 h-5 text-blue-400 mt-0.5" />
            <span>
              <b>What to expect:</b> We'll show you a live demo of HomeListingAI, discuss your specific needs, and create a custom implementation plan for your business. No sales pressure—just valuable insights.
            </span>
          </div>
          <button type="submit" className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg shadow-lg transition text-lg flex items-center justify-center gap-2" disabled={submitting}>
            <Sparkles className="w-5 h-5" /> {submitting ? 'Booking...' : 'Book My Free Consultation'}
          </button>
        </form>
        )}
      </div>
    </div>
  );
};

export default ConsultationModal; 