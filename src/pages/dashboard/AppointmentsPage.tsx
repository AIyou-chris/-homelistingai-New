import React, { useState, useEffect } from 'react';
import { 
  CalendarIcon, 
  PlusIcon, 
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { Appointment } from '../../services/appointmentService';
import * as appointmentService from '../../services/appointmentService';
import Button from '../../components/shared/Button';
import Input from '../../components/shared/Input';
import { Calendar } from '../../components/ui/calendar';
import { enGB } from 'date-fns/locale';

interface AppointmentWithListing extends Appointment {
  listing?: {
    title: string;
    address: string;
    imageUrl?: string;
  };
}

const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentWithListing[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<AppointmentWithListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, searchTerm, statusFilter]);

  useEffect(() => {
    // Always inject demo appointment if none exist
    if (appointments.length === 0) {
      setAppointments([
        {
          id: 'demo-apt-1',
          name: 'Demo Appointment',
          email: 'demo@homelistingai.com',
          phone: '(555) 000-0000',
          preferredDate: '2025-07-08',
          preferredTime: 'afternoon',
          message: 'This is a demo appointment for preview purposes.',
          status: 'confirmed',
          timestamp: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          listing: {
            title: '123 Oak Street',
            address: '123 Oak Street, Austin, TX',
            imageUrl: '/slider1.png',
          },
        },
      ]);
    }
  }, [appointments]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getAppointments();
      setAppointments(data);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = appointments;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(apt =>
        apt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.listing?.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(apt => apt.status === statusFilter);
    }

    setFilteredAppointments(filtered);
  };

  const handleStatusChange = async (appointmentId: string, newStatus: Appointment['status']) => {
    try {
      await appointmentService.updateAppointmentStatus(appointmentId, newStatus);
      setAppointments(prev => prev.map(apt => 
        apt.id === appointmentId ? { ...apt, status: newStatus } : apt
      ));
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeSlot = (time: string) => {
    switch (time) {
      case 'morning':
        return '9:00 AM - 12:00 PM';
      case 'afternoon':
        return '12:00 PM - 5:00 PM';
      case 'evening':
        return '5:00 PM - 8:00 PM';
      default:
        return time;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // Mock data for demo
  const mockAppointments: AppointmentWithListing[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john@example.com',
      phone: '(555) 123-4567',
      preferredDate: '2024-01-20',
      preferredTime: 'afternoon',
      message: 'Interested in viewing the property',
      status: 'confirmed',
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      listing: {
        title: 'Beautiful 3-Bedroom Home',
        address: '123 Main Street, Austin, TX',
        imageUrl: 'https://via.placeholder.com/150'
      }
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '(555) 987-6543',
      preferredDate: '2024-01-21',
      preferredTime: 'morning',
      message: 'Would like to see the backyard',
      status: 'pending',
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      listing: {
        title: 'Modern Downtown Condo',
        address: '456 Oak Avenue, Austin, TX',
        imageUrl: 'https://via.placeholder.com/150'
      }
    }
  ];

  useEffect(() => {
    setAppointments(mockAppointments);
  }, []);

  // Calendar event handler
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setShowScheduleModal(true);
  };

  // Get all appointment dates for markers
  const appointmentDates = appointments.map(apt => new Date(apt.preferredDate));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <CalendarIcon className="h-6 w-6 text-sky-500" /> Appointments & Scheduling
      </h1>
      {/* Calendar removed */}
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments & Scheduling</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage property viewings and client appointments
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <div className="flex border border-gray-300 rounded-md">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 shadow-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${
                viewMode === 'list'
                  ? 'bg-sky-500 text-white'
                  : 'bg-slate-100 text-gray-700 hover:bg-slate-200'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 shadow-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${
                viewMode === 'calendar'
                  ? 'bg-sky-500 text-white'
                  : 'bg-slate-100 text-gray-700 hover:bg-slate-200'
              }`}
            >
              Calendar
            </button>
          </div>
          <Button 
            variant="primary" 
            leftIcon={<PlusIcon className="h-4 w-4" />}
            onClick={() => setShowScheduleModal(true)}
          >
            Schedule Appointment
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full py-2 rounded-md bg-slate-100 border border-slate-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
              style={{ boxShadow: 'none' }}
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-md bg-slate-100 border border-slate-200 text-gray-900 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            style={{ boxShadow: 'none' }}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Date Filter */}
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="px-3 py-2 rounded-md bg-slate-100 border border-slate-200 text-gray-900 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            style={{ boxShadow: 'none' }}
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-100 rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {appointments.filter(apt => apt.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-slate-100 rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-gray-900">
                {appointments.filter(apt => apt.status === 'confirmed').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-slate-100 rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {appointments.filter(apt => apt.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-slate-100 rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cancelled</p>
              <p className="text-2xl font-bold text-gray-900">
                {appointments.filter(apt => apt.status === 'cancelled').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      {viewMode === 'list' && (
        <div className="bg-slate-100 rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-slate-50 divide-y divide-slate-200">
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-slate-100 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap bg-slate-100 rounded-l-xl">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{appointment.name}</div>
                        <div className="text-sm text-gray-500">{appointment.email}</div>
                        <div className="text-sm text-gray-500">{appointment.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap bg-slate-100">
                      <div className="flex items-center">
                        {appointment.listing?.imageUrl && (
                          <img 
                            src={appointment.listing.imageUrl} 
                            alt="Property" 
                            className="h-10 w-10 rounded object-cover mr-3"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.listing?.title || 'Property'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.listing?.address || 'Address not available'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap bg-slate-100">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatDate(appointment.preferredDate)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {getTimeSlot(appointment.preferredTime)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap bg-slate-100">
                      <select
                        value={appointment.status}
                        onChange={(e) => handleStatusChange(appointment.id, e.target.value as Appointment['status'])}
                        className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(appointment.status)} border-0 focus:ring-0`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium bg-slate-100 rounded-r-xl">
                      <div className="flex items-center space-x-2">
                        <button className="text-sky-600 hover:text-sky-900 bg-slate-50 hover:bg-slate-200 rounded p-1 transition-colors">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 bg-slate-50 hover:bg-slate-200 rounded p-1 transition-colors">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 bg-slate-50 hover:bg-slate-200 rounded p-1 transition-colors">
                          <PhoneIcon className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 bg-slate-50 hover:bg-slate-200 rounded p-1 transition-colors">
                          <EnvelopeIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAppointments.length === 0 && (
            <div className="text-center py-12 bg-slate-50 rounded-xl">
              <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Schedule your first appointment to get started'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="bg-slate-100 rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Calendar View</h3>
            <p className="text-gray-500">Calendar view coming soon...</p>
            <p className="text-sm text-gray-400 mt-2">
              This will show a full calendar with appointments displayed on their scheduled dates.
            </p>
          </div>
        </div>
      )}

      {/* Schedule Appointment Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-slate-50">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Schedule Appointment</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Client Name</label>
                  <Input type="text" placeholder="Enter client name" className="bg-slate-100 border-0 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <Input type="email" placeholder="Enter email address" className="bg-slate-100 border-0 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <Input type="tel" placeholder="Enter phone number" className="bg-slate-100 border-0 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Property</label>
                  <select className="w-full px-3 py-2 rounded-md bg-slate-100 border-0 focus:bg-white">
                    <option>Select a property</option>
                    <option>123 Main Street</option>
                    <option>456 Oak Avenue</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <Input type="date" className="bg-slate-100 border-0 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Time</label>
                  <select className="w-full px-3 py-2 rounded-md bg-slate-100 border-0 focus:bg-white">
                    <option>Select time</option>
                    <option value="morning">Morning (9 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                    <option value="evening">Evening (5 PM - 8 PM)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea 
                    className="w-full px-3 py-2 rounded-md bg-slate-100 border-0 focus:bg-white"
                    rows={3}
                    placeholder="Any special requests or notes"
                  />
                </div>
                <div className="flex space-x-3">
                  <Button 
                    variant="primary" 
                    className="flex-1"
                    onClick={() => setShowScheduleModal(false)}
                  >
                    Schedule
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="flex-1"
                    onClick={() => setShowScheduleModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage; 