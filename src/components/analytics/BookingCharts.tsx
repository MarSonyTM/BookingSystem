import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Booking } from '../../types/booking';
import { format, startOfWeek, addDays } from 'date-fns';

interface BookingChartsProps {
  bookings: Booking[];
}

export default function BookingCharts({ bookings }: BookingChartsProps) {
  // Group bookings by user and week
  const userBookings = bookings.reduce((acc, booking) => {
    const weekStart = startOfWeek(booking.date, { weekStartsOn: 1 });
    const weekKey = format(weekStart, 'MMM d');
    
    if (!acc[weekKey]) {
      acc[weekKey] = {};
    }
    
    if (!acc[weekKey][booking.userId]) {
      acc[weekKey][booking.userId] = 0;
    }
    
    acc[weekKey][booking.userId]++;
    return acc;
  }, {} as Record<string, Record<string, number>>);

  // Transform data for the chart
  const chartData = Object.entries(userBookings).map(([week, users]) => {
    return {
      week,
      ...Object.entries(users).reduce((acc, [userId, count]) => {
        acc[`User ${userId.slice(0, 4)}`] = count;
        return acc;
      }, {} as Record<string, number>),
    };
  });

  // Get unique users for the legend
  const uniqueUsers = Array.from(
    new Set(bookings.map(b => `User ${b.userId.slice(0, 4)}`))
  );

  // Generate colors for each user
  const colors = [
    '#818CF8', // Indigo
    '#C084FC', // Purple
    '#34D399', // Emerald
    '#F472B6', // Pink
    '#60A5FA', // Blue
    '#FBBF24', // Amber
  ];

  return (
    <div className="mt-6">
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Weekly User Activity
        </h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis 
                dataKey="week" 
                stroke="#6B7280"
                tick={{ fill: '#6B7280' }}
              />
              <YAxis 
                stroke="#6B7280"
                tick={{ fill: '#6B7280' }}
                label={{ 
                  value: 'Number of Bookings',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fill: '#6B7280' }
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '0.5rem',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                cursor={{ fill: 'rgba(107, 114, 128, 0.1)' }}
              />
              <Legend 
                wrapperStyle={{
                  paddingTop: '20px'
                }}
              />
              {uniqueUsers.map((user, index) => (
                <Bar
                  key={user}
                  dataKey={user}
                  fill={colors[index % colors.length]}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={50}
                  stackId="stack"
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}