import { supabase } from '../lib/supabase';
import { sendAppointmentConfirmation } from './notificationService';

export interface Appointment {
  id: string;
  listing_id?: string;
  name: string;
  email: string;
  phone: string;
  preferred_date: string;
  preferred_time: 'morning' | 'afternoon' | 'evening';
  message?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  timestamp: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAppointmentData {
  listing_id?: string;
  name: string;
  email: string;
  phone: string;
  preferred_date: string;
  preferred_time: 'morning' | 'afternoon' | 'evening';
  message?: string;
}

export const appointmentService = {
  // Get all appointments for the current agent
  async getAppointments(): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('preferred_date', { ascending: true });

    if (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }

    return data || [];
  },

  // Create a new appointment
  async createAppointment(appointmentData: CreateAppointmentData): Promise<Appointment> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select()
        .single();

      if (error) {
        console.error('Error creating appointment:', error);
        throw error;
      }

      // Send confirmation email to client
      if (data) {
        try {
          await sendAppointmentConfirmation(
            data.email,
            data.name,
            data.preferred_date,
            data.preferred_time,
            'HomeListingAI Agent', // You can get this from user context
            '+1 (555) 123-4567' // You can get this from user context
          );
          console.log('✅ Appointment confirmation email sent');
        } catch (emailError) {
          console.warn('⚠️ Failed to send appointment confirmation email:', emailError);
          // Don't fail the appointment creation if email fails
        }
      }

      return data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },

  // Update appointment status
  async updateAppointmentStatus(id: string, status: Appointment['status']): Promise<void> {
    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  },

  // Delete an appointment
  async deleteAppointment(id: string): Promise<void> {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  }
}; 