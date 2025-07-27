import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  ClockIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { notificationService } from '../../services/notificationService';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: {
    id: string;
    name: string;
    email: string;
    phone: string;
    property: string;
    status: string;
    value: string;
    notes?: string;
  };
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, lead }) => {
  const [activeTab, setActiveTab] = useState<'email' | 'phone' | 'sms' | 'schedule' | 'notification'>('email');
  const [emailSubject, setEmailSubject] = useState(`Re: ${lead.property} - HomeListingAI`);
  const [emailBody, setEmailBody] = useState(`Hi ${lead.name},

Thank you for your interest in ${lead.property}. I'd love to discuss this property with you and answer any questions you may have.

Would you be available for a quick call or showing?

Best regards,
Your HomeListingAI Agent`);
  const [smsMessage, setSmsMessage] = useState(`Hi ${lead.name}, thanks for your interest in ${lead.property}. When would be a good time to call you?`);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('showing');
  const [appointmentNotes, setAppointmentNotes] = useState('');
  const [notificationMessage, setNotificationMessage] = useState(`Hi ${lead.name}, thanks for your interest! I'd love to discuss this property with you. When would be a good time to call?`);
  const [isSendingNotification, setIsSendingNotification] = useState(false);

  const handleEmailSend = () => {
    const mailtoLink = `mailto:${lead.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailtoLink, '_blank');
    onClose();
  };

  const handlePhoneCall = () => {
    window.open(`tel:${lead.phone}`, '_blank');
    onClose();
  };

  const handleSMS = () => {
    const smsLink = `sms:${lead.phone}?body=${encodeURIComponent(smsMessage)}`;
    window.open(smsLink, '_blank');
    onClose();
  };

  const handleScheduleAppointment = async () => {
    // TODO: Save appointment to Supabase
    console.log('Scheduling appointment:', {
      leadId: lead.id,
      date: scheduledDate,
      time: scheduledTime,
      type: appointmentType,
      notes: appointmentNotes
    });
    onClose();
  };

  const handleSendNotification = async () => {
    setIsSendingNotification(true);
    try {
      await notificationService.createNotification({
        lead_id: lead.id,
        message: notificationMessage,
        type: 'message'
      });
      alert('Message sent! Lead will see it when they log in.');
      onClose();
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSendingNotification(false);
    }
  };

  const tabs = [
    { id: 'email', name: 'Email', icon: EnvelopeIcon, color: 'text-blue-600' },
    { id: 'phone', name: 'Call', icon: PhoneIcon, color: 'text-green-600' },
    { id: 'sms', name: 'SMS', icon: ChatBubbleLeftRightIcon, color: 'text-purple-600' },
    { id: 'notification', name: 'In-App', icon: BellIcon, color: 'text-indigo-600' },
    { id: 'schedule', name: 'Schedule', icon: CalendarIcon, color: 'text-orange-600' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Contact {lead.name}</h2>
                <p className="text-sm text-gray-600">{lead.property}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <Icon className={`w-4 h-4 ${tab.color}`} />
                        <span>{tab.name}</span>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="p-6">
              {activeTab === 'email' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      rows={8}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleEmailSend}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <EnvelopeIcon className="w-4 h-4 mr-2" />
                      Send Email
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'phone' && (
                <div className="space-y-4">
                  <div className="text-center">
                    <PhoneIcon className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Call {lead.name}</h3>
                    <p className="text-gray-600 mb-4">{lead.phone}</p>
                    <p className="text-sm text-gray-500">This will open your phone app to make the call.</p>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePhoneCall}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                    >
                      <PhoneIcon className="w-4 h-4 mr-2" />
                      Call Now
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'sms' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      value={smsMessage}
                      onChange={(e) => setSmsMessage(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      placeholder="Type your message..."
                    />
                    <p className="text-xs text-gray-500 mt-1">This will open your SMS app.</p>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSMS}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                    >
                      <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                      Send SMS
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'notification' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      value={notificationMessage}
                      onChange={(e) => setNotificationMessage(e.target.value)}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      placeholder="Enter your message to the lead"
                    />
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <BellIcon className="w-4 h-4 inline mr-1" />
                      This message will be sent as an in-app notification. The lead will see it when they log into their dashboard.
                    </p>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      disabled={isSendingNotification}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendNotification}
                      disabled={isSendingNotification}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isSendingNotification ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'schedule' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                      <input
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                      <input
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      value={appointmentType}
                      onChange={(e) => setAppointmentType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="showing">Property Showing</option>
                      <option value="consultation">Consultation</option>
                      <option value="signing">Contract Signing</option>
                      <option value="inspection">Inspection</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea
                      value={appointmentNotes}
                      onChange={(e) => setAppointmentNotes(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      placeholder="Add any notes about this appointment..."
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleScheduleAppointment}
                      disabled={!scheduledDate || !scheduledTime}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      Schedule Appointment
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContactModal; 