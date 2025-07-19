import React, { useState } from 'react';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  ClockIcon,
  CalendarIcon,
  LightBulbIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

interface BookingRequest {
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  topic: string;
  message: string;
}

interface FeatureSuggestion {
  title: string;
  description: string;
  category: string;
}

const ContactPage: React.FC = () => {
  const [contactForm, setContactForm] = useState<ContactForm>({
    name: '',
    email: '',
    message: ''
  });

  const [bookingRequest, setBookingRequest] = useState<BookingRequest>({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    topic: '',
    message: ''
  });

  const [featureSuggestion, setFeatureSuggestion] = useState<FeatureSuggestion>({
    title: '',
    description: '',
    category: 'general'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmitSuccess(true);
    setIsSubmitting(false);
    setContactForm({ name: '', email: '', message: '' });
    
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmitSuccess(true);
    setIsSubmitting(false);
    setBookingRequest({
      name: '',
      email: '',
      phone: '',
      preferredDate: '',
      preferredTime: '',
      topic: '',
      message: ''
    });
    
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  const handleFeatureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmitSuccess(true);
    setIsSubmitting(false);
    setFeatureSuggestion({ title: '', description: '', category: 'general' });
    
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      {/* Success Message */}
      {submitSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-700 font-medium">Thank you! Your message has been sent successfully.</p>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact & Feedback</h1>
        <p className="text-gray-600">We're here to help! Reach out for support, schedule a consultation, or share your ideas.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <EnvelopeIcon className="h-5 w-5 mr-2 text-sky-600" />
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  rows={4}
                  required
                />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Booking Request */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2 text-sky-600" />
              Schedule a Consultation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <Label htmlFor="booking-name">Name</Label>
                <Input
                  id="booking-name"
                  value={bookingRequest.name}
                  onChange={(e) => setBookingRequest({ ...bookingRequest, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="booking-email">Email</Label>
                  <Input
                    id="booking-email"
                    type="email"
                    value={bookingRequest.email}
                    onChange={(e) => setBookingRequest({ ...bookingRequest, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="booking-phone">Phone</Label>
                  <Input
                    id="booking-phone"
                    type="tel"
                    value={bookingRequest.phone}
                    onChange={(e) => setBookingRequest({ ...bookingRequest, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="preferred-date">Preferred Date</Label>
                  <Input
                    id="preferred-date"
                    type="date"
                    value={bookingRequest.preferredDate}
                    onChange={(e) => setBookingRequest({ ...bookingRequest, preferredDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="preferred-time">Preferred Time</Label>
                  <Input
                    id="preferred-time"
                    type="time"
                    value={bookingRequest.preferredTime}
                    onChange={(e) => setBookingRequest({ ...bookingRequest, preferredTime: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="topic">Topic</Label>
                <Input
                  id="topic"
                  placeholder="e.g., Demo, Training, Custom Features"
                  value={bookingRequest.topic}
                  onChange={(e) => setBookingRequest({ ...bookingRequest, topic: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="booking-message">Additional Details</Label>
                <Textarea
                  id="booking-message"
                  value={bookingRequest.message}
                  onChange={(e) => setBookingRequest({ ...bookingRequest, message: e.target.value })}
                  rows={3}
                />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Scheduling...' : 'Schedule Consultation'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Feature Suggestion */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <LightBulbIcon className="h-5 w-5 mr-2 text-sky-600" />
            Feature Suggestion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Have an idea for a new feature? We'd love to hear it! No email required.
          </p>
          <form onSubmit={handleFeatureSubmit} className="space-y-4">
            <div>
              <Label htmlFor="feature-title">Feature Title</Label>
              <Input
                id="feature-title"
                placeholder="e.g., AI-powered lead scoring"
                value={featureSuggestion.title}
                onChange={(e) => setFeatureSuggestion({ ...featureSuggestion, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="feature-category">Category</Label>
              <select
                id="feature-category"
                value={featureSuggestion.category}
                onChange={(e) => setFeatureSuggestion({ ...featureSuggestion, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="general">General</option>
                <option value="ai">AI Features</option>
                <option value="analytics">Analytics</option>
                <option value="automation">Automation</option>
                <option value="integrations">Integrations</option>
                <option value="mobile">Mobile App</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <Label htmlFor="feature-description">Description</Label>
              <Textarea
                id="feature-description"
                placeholder="Describe your feature idea in detail..."
                value={featureSuggestion.description}
                onChange={(e) => setFeatureSuggestion({ ...featureSuggestion, description: e.target.value })}
                rows={4}
                required
              />
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Submitting...' : 'Submit Feature Idea'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Company Information */}
      <Card className="shadow-lg bg-gradient-to-br from-sky-50 to-white">
        <CardHeader>
          <CardTitle className="text-sky-700">Get in Touch</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <EnvelopeIcon className="h-6 w-6 text-sky-600 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Email</h3>
                <p className="text-gray-600">support@homelistingai.com</p>
                <p className="text-sm text-gray-500">We typically respond within 24 hours</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <PhoneIcon className="h-6 w-6 text-sky-600 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Phone</h3>
                <p className="text-gray-600">+1 (555) 123-4567</p>
                <p className="text-sm text-gray-500">Mon-Fri, 9AM-6PM EST</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <MapPinIcon className="h-6 w-6 text-sky-600 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Office</h3>
                <p className="text-gray-600">123 Innovation Drive</p>
                <p className="text-sm text-gray-500">Tech City, TC 12345</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-white rounded-lg border border-sky-200">
            <h3 className="font-medium text-gray-900 mb-2">What to expect:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Quick response times (usually within 24 hours)</li>
              <li>• Personalized support from our team</li>
              <li>• Free consultations for new features</li>
              <li>• Regular updates on your suggestions</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactPage; 