import { supabase } from '../lib/supabase';

export interface AppointmentData {
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
  listingId?: string;
}

export interface Appointment {
  id: string;
  listingId?: string;
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

export const createAppointment = async (appointmentData: AppointmentData): Promise<Appointment> => {
  const { data, error } = await supabase
    .from('appointments')
    .insert([{
      name: appointmentData.name,
      email: appointmentData.email,
      phone: appointmentData.phone,
      preferred_date: appointmentData.preferredDate,
      preferred_time: appointmentData.preferredTime,
      message: appointmentData.message,
      listing_id: appointmentData.listingId,
      status: 'pending',
      timestamp: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }

  return data;
};

export const getAppointments = async (agentId?: string): Promise<Appointment[]> => {
  let query = supabase
    .from('appointments')
    .select(`
      *,
      listing:listings(*)
    `)
    .order('timestamp', { ascending: false });

  if (agentId) {
    query = query.eq('listing.agent_id', agentId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }

  return data || [];
};

export const updateAppointmentStatus = async (appointmentId: string, status: Appointment['status']): Promise<Appointment> => {
  const { data, error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', appointmentId)
    .select()
    .single();

  if (error) {
    console.error('Error updating appointment status:', error);
    throw error;
  }

  return data;
};

// Mock function for demo purposes
export const createMockAppointment = async (appointmentData: AppointmentData): Promise<Appointment> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const mockAppointment: Appointment = {
    id: `appointment-${Date.now()}`,
    listingId: appointmentData.listingId,
    name: appointmentData.name,
    email: appointmentData.email,
    phone: appointmentData.phone,
    preferredDate: appointmentData.preferredDate,
    preferredTime: appointmentData.preferredTime,
    message: appointmentData.message,
    status: 'pending',
    timestamp: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  console.log('Mock appointment created:', mockAppointment);
  return mockAppointment;
};

// Email notification function (placeholder for integration)
export const sendAppointmentConfirmation = async (appointment: Appointment): Promise<void> => {
  // TODO: Integrate with email service (SendGrid, Mailgun, etc.)
  console.log('Sending appointment confirmation email to:', appointment.email);
  
  // Mock email sending
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('Appointment confirmation email sent successfully');
};

// Calendar integration (placeholder for integration)
export const addToCalendar = async (appointment: Appointment): Promise<string> => {
  // TODO: Integrate with Google Calendar, Outlook, etc.
  console.log('Adding appointment to calendar:', appointment);
  
  // Mock calendar integration
  await new Promise(resolve => setTimeout(resolve, 500));
  return `https://calendar.google.com/event?action=TEMPLATE&text=Property+Viewing&dates=${appointment.preferredDate}T${appointment.preferredTime === 'morning' ? '09:00' : appointment.preferredTime === 'afternoon' ? '14:00' : '17:00'}/PT1H`;
}; 