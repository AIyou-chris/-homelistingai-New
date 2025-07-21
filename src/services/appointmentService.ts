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

// Send appointment confirmation emails
const sendAppointmentConfirmation = async (appointmentData: AppointmentData, listingData?: any) => {
  try {
    // Get agent email from listing
    let agentEmail = 'cdipotter@me.com'; // Default fallback
    let agentData = null;
    
    if (listingData?.agent_id) {
      // Get agent profile to find their email
      const { data: agentProfile } = await supabase
        .from('agent_profiles')
        .select('*')
        .eq('user_id', listingData.agent_id)
        .single();
      
      if (agentProfile?.email) {
        agentEmail = agentProfile.email;
        agentData = agentProfile;
      }
    }

    // Send confirmation emails
    const response = await fetch('https://gezqfksuazkfabhhpaqp.supabase.co/functions/v1/appointment-confirmation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlenFma3N1YXprZmFiaGhwYXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMzU4NzIsImV4cCI6MjA2MTcxMTg3Mn0.DaLGsPHzz42ArvA0v8szH9R-bNkqYPeQkt3BSqCiy5o',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlenFma3N1YXprZmFiaGhwYXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMzU4NzIsImV4cCI6MjA2MTcxMTg3Mn0.DaLGsPHzz42ArvA0v8szH9R-bNkqYPeQkt3BSqCiy5o'
      },
      body: JSON.stringify({
        appointmentData: {
          ...appointmentData,
          timestamp: new Date().toISOString()
        },
        agentEmail,
        listingData,
        agentData
      })
    });

    if (response.ok) {
      console.log('Appointment confirmation emails sent successfully');
    } else {
      console.error('Failed to send appointment confirmation:', await response.text());
    }
  } catch (error) {
    console.error('Error sending appointment confirmation:', error);
    // Don't fail the appointment creation if email fails
  }
};

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

  // Send confirmation emails
  if (appointmentData.listingId) {
    // Get listing data for the confirmation
    const { data: listingData } = await supabase
      .from('listings')
      .select('*')
      .eq('id', appointmentData.listingId)
      .single();
    
    await sendAppointmentConfirmation(appointmentData, listingData);
  } else {
    await sendAppointmentConfirmation(appointmentData);
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



// Calendar integration (placeholder for integration)
export const addToCalendar = async (appointment: Appointment): Promise<string> => {
  // TODO: Integrate with Google Calendar, Outlook, etc.
  console.log('Adding appointment to calendar:', appointment);
  
  // Mock calendar integration
  await new Promise(resolve => setTimeout(resolve, 500));
  return `https://calendar.google.com/event?action=TEMPLATE&text=Property+Viewing&dates=${appointment.preferredDate}T${appointment.preferredTime === 'morning' ? '09:00' : appointment.preferredTime === 'afternoon' ? '14:00' : '17:00'}/PT1H`;
}; 