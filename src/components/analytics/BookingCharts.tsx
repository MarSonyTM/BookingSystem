import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { Booking } from '../../types/booking';
import { format, startOfWeek, addDays } from 'date-fns';

interface BookingChartsProps {
  bookings: Booking[];
}

export default function BookingCharts({ bookings }: BookingChartsProps) {
  // Prepare data for daily bookings chart
  const startDate = startOfWeek(new Date());
  const dailyData = Array.from({ length: 5 }, (_, i) => {
    const date = addDays(startDate, i);
    const dayBookings = bookings.filter(
      b => b.date.toDateString() === date.toDateString()
    );
    
    return {
      name: format(date, 'EEE'),
      physio: dayBookings.filter(b => b.serviceType === 'physio').length,
      massage: dayBookings.filter(b => b.serviceType === 'massage').length,
    };
  });

  // Prepare data for hourly distribution
  const hourlyData = Array.from({ length: 8 }, (_, i) => {
    const hour = i + 10; // Starting from 10 AM
    const hourBookings = bookings.filter(b => new Date(b.date).getHours() === hour);
    
    return {
      name: `${hour}:00`,
      bookings: hourBookings.length,
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Daily Bookings by Service Type
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '0.5rem',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Legend />
              <Bar dataKey="physio" fill="#818CF8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="massage" fill="#C084FC" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Hourly Booking Distribution
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '0.5rem',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Line
                type="monotone"
                dataKey="bookings"
                stroke="#818CF8"
                strokeWidth={2}
                dot={{ fill: '#818CF8', strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}