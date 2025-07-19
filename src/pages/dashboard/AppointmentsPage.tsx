import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface Appointment {
  id: number;
  name: string;
  date: string; // YYYY-MM-DD
  note: string;
}

const appointments: Appointment[] = [
  // Empty array for real agents - no demo data
];

const AppointmentsPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const selectedDateStr = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="w-full space-y-6">
      {/* Data Cards - Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="text-2xl font-bold text-rose-500">0</div>
          <div className="text-sm text-gray-500 mt-1">Total Appointments</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <div className="text-2xl font-bold text-rose-500">0</div>
          <div className="text-sm text-gray-500 mt-1">Upcoming</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <div className="text-2xl font-bold text-rose-500">0</div>
          <div className="text-sm text-gray-500 mt-1">Completed</div>
        </div>
      </div>

      {/* Demo Appointments List */}
      <div className="bg-white rounded-xl shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Appointments</h2>
        </div>
        <div className="p-6">
          {appointments.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>No appointments yet.</p>
              <p className="text-sm mt-2">Click on a date in the calendar below to schedule an appointment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map(apt => (
                <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{apt.name}</div>
                    <div className="text-sm text-gray-500 mt-1">{apt.date}</div>
                    <div className="text-sm text-gray-400 mt-1">{apt.note}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-rose-500 hover:text-rose-600 text-sm font-medium">View</button>
                    <button className="text-gray-400 hover:text-gray-600 text-sm">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Calendar - Full Width */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Calendar</h2>
          <p className="text-sm text-gray-500">Selected: {selectedDateStr}</p>
        </div>
        <div className="flex justify-center">
          <div className="calendar-scroll-wrapper">
            <Calendar
              onChange={date => setSelectedDate(date as Date)}
              value={selectedDate}
              className="border-0 shadow-none w-full max-w-4xl rounded-xl"
              tileClassName={({ date, view }) =>
                date.toDateString() === selectedDate.toDateString() && view === 'month'
                  ? 'bg-rose-200 text-white rounded-full font-bold' : ''
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPage; 