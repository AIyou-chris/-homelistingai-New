import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Mail, Building2, MessageCircle, Phone, Sparkles } from 'lucide-react';

interface ConsultationModalProps {
  open: boolean;
  onClose: () => void;
  context?: 'default' | 'white-label';
}

const ConsultationModal: React.FC<ConsultationModalProps> = ({ open, onClose, context = 'default' }) => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [showContactForm, setShowContactForm] = useState(false);

  // Load Calendly script when modal opens
  useEffect(() => {
    if (open) {
      // Add Calendly CSS
      const link = document.createElement('link');
      link.href = 'https://assets.calendly.com/assets/external/widget.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);

      // Add Calendly script
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.head.appendChild(script);

      // Cleanup function
      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    }
  }, [open]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Contact form submitted:', contactForm);
    alert('Thank you for your message! We\'ll get back to you soon.');
    setContactForm({ name: '', email: '', phone: '', message: '' });
    setShowContactForm(false);
  };

  const openCalendly = () => {
    if ((window as any).Calendly) {
      (window as any).Calendly.initPopupWidget({
        url: 'https://calendly.com/aichris-aybv/set-up-your-bot-to-be-an-ai-you'
      });
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
        
        {/* Main Content */}
        <div className="p-6 pt-4">
          {!showContactForm ? (
            <>
              {/* Primary Booking Option */}
              <div className="text-center mb-6">
                <p className="text-gray-600 mb-6">
                  Choose how you'd like to connect with us. Book a free consultation to see HomeListingAI in action, or send us a message with your questions.
                </p>
                
                {/* Calendly Booking Button */}
                <button
                  onClick={openCalendly}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition text-lg flex items-center justify-center gap-3 mb-4"
                >
                  <Calendar className="w-5 h-5" />
                  Schedule Free Consultation
                </button>

                {/* Divider */}
                <div className="flex items-center my-6">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="px-4 text-gray-500 text-sm">or</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>

                {/* Alternative Contact Option */}
                <button
                  onClick={() => setShowContactForm(true)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition text-base flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Send us a message instead
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Contact Form */}
              <div className="mb-4">
                <button
                  onClick={() => setShowContactForm(false)}
                  className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1 mb-4"
                >
                  ← Back to booking options
                </button>
                
                <h3 className="text-lg font-semibold mb-4">Send us a message</h3>
                
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-xs font-semibold mb-1">Full Name *</label>
                      <div className="relative">
                        <User className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                        <input 
                          className="w-full pl-8 pr-2 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" 
                          required 
                          placeholder="Your full name" 
                          value={contactForm.name} 
                          onChange={e => setContactForm(f => ({ ...f, name: e.target.value }))} 
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-semibold mb-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                        <input 
                          className="w-full pl-8 pr-2 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" 
                          placeholder="(555) 123-4567" 
                          value={contactForm.phone} 
                          onChange={e => setContactForm(f => ({ ...f, phone: e.target.value }))} 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold mb-1">Email Address *</label>
                    <div className="relative">
                      <Mail className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                      <input 
                        type="email"
                        className="w-full pl-8 pr-2 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" 
                        required 
                        placeholder="your@email.com" 
                        value={contactForm.email} 
                        onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))} 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold mb-1">Message *</label>
                    <div className="relative">
                      <MessageCircle className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                      <textarea 
                        className="w-full pl-8 pr-2 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" 
                        required 
                        rows={4}
                        placeholder="Tell us about your needs and how we can help..." 
                        value={contactForm.message} 
                        onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))} 
                      />
                    </div>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg transition text-lg flex items-center justify-center gap-2"
                  >
                    <Mail className="w-5 h-5" /> Send Message
                  </button>
                </form>
              </div>
            </>
          )}

          {/* What to expect info box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900 flex gap-2 items-start">
            <Sparkles className="w-5 h-5 text-blue-400 mt-0.5" />
            <span>
              <b>What to expect:</b> We'll show you a live demo of HomeListingAI, discuss your specific needs, and create a custom implementation plan for your business. No sales pressure—just valuable insights.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationModal; 