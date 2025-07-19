import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../shared/LoadingSpinner';
import { Plus, Edit, Trash2, Eye, Calendar as CalendarIcon } from 'lucide-react';

interface AdminAppointment {
  id: string;
  agent_name: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes: string;
  created_at: string;
}

interface NewAppointment {
  agent_name: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes: string;
}

const AdminAppointmentOversight: React.FC = () => {
  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState<AdminAppointment | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState<NewAppointment>({
    agent_name: '',
    client_name: '',
    client_email: '',
    client_phone: '',
    appointment_date: '',
    appointment_time: '',
    status: 'scheduled',
    notes: ''
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      
      // Fetch appointments with agent information
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          client_name,
          client_email,
          client_phone,
          appointment_date,
          appointment_time,
          status,
          notes,
          created_at,
          agent_profiles!inner(
            first_name,
            last_name,
            display_name
          )
        `)
        .order('appointment_date', { ascending: false });

      if (error) throw error;

      // Transform data to match AdminAppointment interface
      const transformedAppointments: AdminAppointment[] = data?.map(appointment => ({
        id: appointment.id,
        agent_name: appointment.agent_profiles?.[0]?.display_name || 
                   `${appointment.agent_profiles?.[0]?.first_name} ${appointment.agent_profiles?.[0]?.last_name}`.trim(),
        client_name: appointment.client_name,
        client_email: appointment.client_email,
        client_phone: appointment.client_phone,
        appointment_date: appointment.appointment_date,
        appointment_time: appointment.appointment_time,
        status: appointment.status || 'scheduled',
        notes: appointment.notes || '',
        created_at: appointment.created_at
      })) || [];

      setAppointments(transformedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const createAppointment = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([{
          client_name: newAppointment.client_name,
          client_email: newAppointment.client_email,
          client_phone: newAppointment.client_phone,
          appointment_date: newAppointment.appointment_date,
          appointment_time: newAppointment.appointment_time,
          status: newAppointment.status,
          notes: newAppointment.notes,
          agent_id: 'default-agent-id' // You'll need to get the actual agent ID
        }])
        .select();

      if (error) throw error;

      // Refresh appointments
      await fetchAppointments();
      setShowCreateModal(false);
      setNewAppointment({
        agent_name: '',
        client_name: '',
        client_email: '',
        client_phone: '',
        appointment_date: '',
        appointment_time: '',
        status: 'scheduled',
        notes: ''
      });
    } catch (error) {
      console.error('Error creating appointment:', error);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointmentId);

      if (error) throw error;

      // Update local state
      setAppointments(prev => prev.map(appointment => 
        appointment.id === appointmentId ? { ...appointment, status: newStatus } : appointment
      ));
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const deleteAppointment = async (appointmentId: string) => {
    if (!confirm('Are you sure you want to delete this appointment? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', appointmentId);

      if (error) throw error;

      // Remove from local state
      setAppointments(prev => prev.filter(appointment => appointment.id !== appointmentId));
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.agent_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.client_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no-show': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAppointmentsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return appointments.filter(appointment => appointment.appointment_date === dateString);
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dayAppointments = getAppointmentsForDate(date);
      if (dayAppointments.length > 0) {
        return (
          <div className="absolute bottom-1 left-1 right-1">
            <div className="flex flex-wrap gap-1">
              {dayAppointments.slice(0, 3).map((appointment, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    appointment.status === 'confirmed' ? 'bg-green-500' :
                    appointment.status === 'scheduled' ? 'bg-blue-500' :
                    appointment.status === 'completed' ? 'bg-gray-500' :
                    appointment.status === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}
                  title={`${appointment.client_name} - ${appointment.appointment_time}`}
                />
              ))}
              {dayAppointments.length > 3 && (
                <div className="w-2 h-2 rounded-full bg-gray-400 text-xs flex items-center justify-center">
                  +
                </div>
              )}
            </div>
          </div>
        );
      }
    }
    return null;
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Appointment Oversight</h2>
          <p className="text-gray-400">Monitor and manage all client appointments</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-400">
            Total Appointments: {appointments.length}
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Appointment</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-white">{appointments.filter(a => a.status === 'scheduled').length}</div>
          <div className="text-sm text-gray-400">Scheduled</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-white">{appointments.filter(a => a.status === 'confirmed').length}</div>
          <div className="text-sm text-gray-400">Confirmed</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-white">{appointments.filter(a => a.status === 'completed').length}</div>
          <div className="text-sm text-gray-400">Completed</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-white">{appointments.filter(a => a.status === 'cancelled').length}</div>
          <div className="text-sm text-gray-400">Cancelled</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-white">{appointments.length}</div>
          <div className="text-sm text-gray-400">Total</div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no-show">No Show</option>
          </select>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              viewMode === 'calendar' 
                ? 'bg-sky-600 text-white' 
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Calendar</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              viewMode === 'list' 
                ? 'bg-sky-600 text-white' 
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            <span>List</span>
          </button>
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Appointment Calendar</h3>
            <div className="text-sm text-gray-400">
              Click on a date to view appointments for that day
            </div>
          </div>
          
          <div className="calendar-container">
            <Calendar
              onChange={(value) => {
                if (value instanceof Date) {
                  setSelectedDate(value);
                }
              }}
              value={selectedDate}
              tileContent={tileContent}
              className="admin-calendar"
            />
          </div>

          {/* Selected Date Appointments */}
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-white mb-4">
              Appointments for {selectedDate.toLocaleDateString()}
            </h4>
            <div className="space-y-3">
              {getAppointmentsForDate(selectedDate).map((appointment) => (
                <div key={appointment.id} className="bg-slate-700 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="text-white font-medium">{appointment.client_name}</h5>
                      <p className="text-gray-400 text-sm">{appointment.appointment_time}</p>
                      <p className="text-gray-400 text-sm">Agent: {appointment.agent_name}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setShowEditModal(true);
                        }}
                        className="text-sky-400 hover:text-sky-300"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteAppointment(appointment.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {getAppointmentsForDate(selectedDate).length === 0 && (
                <div className="text-gray-400 text-center py-8">
                  No appointments scheduled for this date
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-slate-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Agent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-slate-800 divide-y divide-slate-700">
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-slate-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">{appointment.client_name}</div>
                        <div className="text-sm text-gray-400">{appointment.client_email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {appointment.agent_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        {new Date(appointment.appointment_date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-400">{appointment.appointment_time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={appointment.status}
                        onChange={(e) => updateAppointmentStatus(appointment.id, e.target.value)}
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(appointment.status)} border-none`}
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="no-show">No Show</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setShowEditModal(true);
                        }}
                        className="text-sky-400 hover:text-sky-300 mr-3"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteAppointment(appointment.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Appointment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">Create New Appointment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Client Name</label>
                <input
                  type="text"
                  value={newAppointment.client_name}
                  onChange={(e) => setNewAppointment({...newAppointment, client_name: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Client Email</label>
                <input
                  type="email"
                  value={newAppointment.client_email}
                  onChange={(e) => setNewAppointment({...newAppointment, client_email: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Client Phone</label>
                <input
                  type="tel"
                  value={newAppointment.client_phone}
                  onChange={(e) => setNewAppointment({...newAppointment, client_phone: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                <input
                  type="date"
                  value={newAppointment.appointment_date}
                  onChange={(e) => setNewAppointment({...newAppointment, appointment_date: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Time</label>
                <input
                  type="time"
                  value={newAppointment.appointment_time}
                  onChange={(e) => setNewAppointment({...newAppointment, appointment_time: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  value={newAppointment.status}
                  onChange={(e) => setNewAppointment({...newAppointment, status: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no-show">No Show</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
                <textarea
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={createAppointment}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
              >
                Create Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Appointment Modal */}
      {showEditModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">Edit Appointment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Client Name</label>
                <input
                  type="text"
                  value={selectedAppointment.client_name}
                  onChange={(e) => setSelectedAppointment({...selectedAppointment, client_name: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Client Email</label>
                <input
                  type="email"
                  value={selectedAppointment.client_email}
                  onChange={(e) => setSelectedAppointment({...selectedAppointment, client_email: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Client Phone</label>
                <input
                  type="tel"
                  value={selectedAppointment.client_phone}
                  onChange={(e) => setSelectedAppointment({...selectedAppointment, client_phone: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                <input
                  type="date"
                  value={selectedAppointment.appointment_date}
                  onChange={(e) => setSelectedAppointment({...selectedAppointment, appointment_date: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Time</label>
                <input
                  type="time"
                  value={selectedAppointment.appointment_time}
                  onChange={(e) => setSelectedAppointment({...selectedAppointment, appointment_time: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  value={selectedAppointment.status}
                  onChange={(e) => setSelectedAppointment({...selectedAppointment, status: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no-show">No Show</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
                <textarea
                  value={selectedAppointment.notes}
                  onChange={(e) => setSelectedAppointment({...selectedAppointment, notes: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Update appointment logic here
                  setShowEditModal(false);
                }}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
              >
                Update Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAppointmentOversight; 