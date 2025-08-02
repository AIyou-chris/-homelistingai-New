import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UserGroupIcon, 
  CalendarIcon, 
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  CheckIcon,
  XMarkIcon,
  PlusIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import ContactModal from '../../components/shared/ContactModal';
import AddLeadModal from '../../components/shared/AddLeadModal';
import ScheduleAppointmentModal from '../../components/shared/ScheduleAppointmentModal';
import { leadService, Lead } from '../../services/leadService';
import { appointmentService, Appointment } from '../../services/appointmentService';

// Simple calendar component
const CalendarView: React.FC<{ appointments: Appointment[] }> = ({ appointments }) => {
  // Get all unique dates with appointments
  const datesWithAppointments = useMemo(() => {
    return Array.from(new Set(appointments.map(a => a.preferred_date)));
  }, [appointments]);

  // Get current month and year
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Helper to format date as yyyy-mm-dd
  const formatDate = (d: number) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mt-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Appointments Calendar</h2>
      <div className="grid grid-cols-7 gap-2 text-center">
        {[...Array(daysInMonth)].map((_, i) => {
          const dateStr = formatDate(i + 1);
          const hasAppt = datesWithAppointments.includes(dateStr);
          return (
            <div
              key={dateStr}
              className={`rounded-lg p-2 text-sm font-medium ${hasAppt ? 'bg-blue-100 text-blue-700 border border-blue-300 shadow' : 'text-gray-500'}`}
            >
              {i + 1}
              {hasAppt && (
                <div className="mt-1 text-xs font-normal">
                  {appointments.filter(a => a.preferred_date === dateStr).map(a => (
                    <div key={a.id} className="truncate">
                      <span className="block">{a.preferred_time} - {a.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const LeadsAppointmentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'leads' | 'appointments'>('leads');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [addLeadModalOpen, setAddLeadModalOpen] = useState(false);
  const [scheduleAppointmentModalOpen, setScheduleAppointmentModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from Supabase
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [leadsData, appointmentsData] = await Promise.all([
        leadService.getLeads(),
        appointmentService.getAppointments()
      ]);
      setLeads(leadsData);
      setAppointments(appointmentsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeadAdded = () => {
    loadData();
  };

  const handleAppointmentScheduled = () => {
    loadData();
  };

  const handleStatusUpdate = async (id: string, newStatus: string, type: 'lead' | 'appointment') => {
    try {
      if (type === 'lead') {
        await leadService.updateLeadStatus(id, newStatus as any);
      } else {
        await appointmentService.updateAppointmentStatus(id, newStatus as any);
      }
      loadData(); // Reload data to show updated status
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
      case 'confirmed':
        return 'bg-yellow-100 text-yellow-800';
      case 'qualified':
        return 'bg-purple-100 text-purple-800';
      case 'converted':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'lost':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'showing':
        return MapPinIcon;
      case 'consultation':
        return PhoneIcon;
      case 'signing':
        return CheckIcon;
      default:
        return CalendarIcon;
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = (lead.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (lead.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || lead.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = (appointment.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (appointment.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || appointment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Modals */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        lead={selectedLead ? {
          id: selectedLead.id,
          name: selectedLead.name,
          email: selectedLead.email,
          phone: selectedLead.phone || '',
          property: 'Property Inquiry',
          status: selectedLead.status,
          value: '$0',
          notes: selectedLead.message
        } : {
          id: '',
          name: '',
          email: '',
          phone: '',
          property: '',
          status: 'new',
          value: '',
          notes: ''
        }}
      />
      <AddLeadModal
        isOpen={addLeadModalOpen}
        onClose={() => setAddLeadModalOpen(false)}
        onLeadAdded={handleLeadAdded}
      />
      <ScheduleAppointmentModal
        isOpen={scheduleAppointmentModalOpen}
        onClose={() => setScheduleAppointmentModalOpen(false)}
        onAppointmentScheduled={handleAppointmentScheduled}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leads & Appointments</h1>
          <p className="text-gray-600 mt-2">Manage your prospects and schedule showings</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setAddLeadModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add New Lead
          </button>
          <button 
            onClick={() => setScheduleAppointmentModalOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center"
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            Schedule Appointment
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <UserGroupIcon className="w-8 h-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-2xl font-bold text-gray-900">{leads.length}</p>
              <p className="text-sm text-gray-600">Total Leads</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <CalendarIcon className="w-8 h-8 text-green-500" />
            <div className="ml-3">
              <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
              <p className="text-sm text-gray-600">Appointments</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <CheckIcon className="w-8 h-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-2xl font-bold text-gray-900">{leads.filter(l => l.status === 'qualified').length}</p>
              <p className="text-sm text-gray-600">Converted</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <ClockIcon className="w-8 h-8 text-orange-500" />
            <div className="ml-3">
              <p className="text-2xl font-bold text-gray-900">{appointments.filter(a => a.status === 'pending').length}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('leads')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'leads'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <UserGroupIcon className="w-5 h-5 inline mr-2" />
              Leads ({leads.length})
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'appointments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <CalendarIcon className="w-5 h-5 inline mr-2" />
              Appointments ({appointments.length})
            </button>
          </nav>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FunnelIcon className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                {activeTab === 'leads' ? (
                  <>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="converted">Converted</option>
                    <option value="lost">Lost</option>
                  </>
                ) : (
                  <>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'leads' ? (
            <div className="space-y-4">
              {filteredLeads.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <UserGroupIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No leads found. Add your first lead to get started!</p>
                </div>
              ) : (
                filteredLeads.map((lead, index) => (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{lead.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                            {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <EnvelopeIcon className="w-4 h-4 mr-2" />
                            {lead.email}
                          </div>
                          <div className="flex items-center">
                            <PhoneIcon className="w-4 h-4 mr-2" />
                            {lead.phone || 'No phone'}
                          </div>
                          <div className="flex items-center">
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {lead.source}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500">
                              {new Date(lead.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        {lead.message && (
                          <p className="text-sm text-gray-500 mt-2">{lead.message}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                          onClick={() => { setSelectedLead(lead); setContactModalOpen(true); }}
                        >
                          Contact
                        </button>
                        <button 
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                          onClick={() => {
                            setScheduleAppointmentModalOpen(true);
                            // Pre-fill with lead data
                            setSelectedLead(lead);
                          }}
                        >
                          Schedule
                        </button>
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusUpdate(lead.id, e.target.value, 'lead')}
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="lost">Lost</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No appointments found. Schedule your first appointment!</p>
                </div>
              ) : (
                filteredAppointments.map((appointment, index) => (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{appointment.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <EnvelopeIcon className="w-4 h-4 mr-2" />
                            {appointment.email}
                          </div>
                          <div className="flex items-center">
                            <PhoneIcon className="w-4 h-4 mr-2" />
                            {appointment.phone}
                          </div>
                          <div className="flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            {new Date(appointment.preferred_date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <ClockIcon className="w-4 h-4 mr-2" />
                            {appointment.preferred_time}
                          </div>
                        </div>
                        {appointment.message && (
                          <p className="text-sm text-gray-500 mt-2">{appointment.message}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button 
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                          onClick={() => handleStatusUpdate(appointment.id, 'confirmed', 'appointment')}
                        >
                          <CheckIcon className="w-4 h-4" />
                        </button>
                        <button 
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                          onClick={() => handleStatusUpdate(appointment.id, 'cancelled', 'appointment')}
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                        <select
                          value={appointment.status}
                          onChange={(e) => handleStatusUpdate(appointment.id, e.target.value, 'appointment')}
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
          {/* Calendar View for Appointments */}
          <CalendarView appointments={appointments} />
        </div>
      </div>
    </div>
  );
};

export default LeadsAppointmentsPage; 