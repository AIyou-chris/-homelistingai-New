import React, { useState } from 'react';
import { X, Calendar, Clock, User, Mail, Building2, MessageCircle, Phone, Sparkles } from 'lucide-react';

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
  });
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
        <form className="p-6 pt-4 space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold mb-1">Full Name *</label>
              <div className="relative">
                <User className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                <input className="w-full pl-8 pr-2 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" required placeholder="Your full name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold mb-1">Phone Number *</label>
              <div className="relative">
                <Phone className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                <input className="w-full pl-8 pr-2 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" required placeholder="(555) 123-4567" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                <input className="w-full pl-8 pr-2 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" required placeholder="your@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold mb-1">Real Estate Company</label>
              <div className="relative">
                <Building2 className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                <input className="w-full pl-8 pr-2 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Your brokerage or company" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold mb-1">Preferred Date *</label>
              <div className="relative">
                <Calendar className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                <input type="date" className="w-full pl-8 pr-2 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" required value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold mb-1">Preferred Time *</label>
              <div className="relative">
                <Clock className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                <input type="time" className="w-full pl-8 pr-2 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" required value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">What are your main goals? *</label>
            <div className="relative">
              <MessageCircle className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
              <textarea className="w-full pl-8 pr-2 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" required placeholder="Tell us about your current challenges and what you'd like to achieve with AI..." value={form.goals} onChange={e => setForm(f => ({ ...f, goals: e.target.value }))} />
            </div>
          </div>
          {/* What to expect info box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900 flex gap-2 items-start">
            <Sparkles className="w-5 h-5 text-blue-400 mt-0.5" />
            <span>
              <b>What to expect:</b> We'll show you a live demo of HomeListingAI, discuss your specific needs, and create a custom implementation plan for your business. No sales pressure—just valuable insights.
            </span>
          </div>
          <button type="submit" className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg shadow-lg transition text-lg flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" /> Book My Free Consultation
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConsultationModal; 