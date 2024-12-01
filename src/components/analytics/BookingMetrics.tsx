import React from 'react';
import { Clock, Calendar, Users, TrendingUp } from 'lucide-react';
import { Booking } from '../../types/booking';
import { differenceInMinutes } from 'date-fns';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

function MetricCard({ title, value, icon, description, trend }: MetricCardProps) {
  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/20">
          {icon}
        </div>
        {trend && (
          <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      <h3 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{title}</p>
      <p className="mt-3 text-xs text-gray-500 dark:text-gray-500">{description}</p>
    </div>
  );
}

interface BookingMetricsProps {
  bookings: Booking[];
}

export default function BookingMetrics({ bookings }: BookingMetricsProps) {
  // Calculate average booking speed (time between slot opening and booking)
  const averageBookingSpeed = bookings.reduce((acc, booking) => {
    const bookingTime = new Date(booking.date);
    const slotOpenTime = new Date(bookingTime);
    slotOpenTime.setHours(0, 0, 0, 0); // Assuming slots open at midnight
    return acc + differenceInMinutes(bookingTime, slotOpenTime);
  }, 0) / (bookings.length || 1);

  // Calculate unique users
  const uniqueUsers = new Set(bookings.map(b => b.userId)).size;

  // Calculate cancellation rate
  const canceledBookings = bookings.filter(b => b.canceled).length;
  const cancellationRate = (canceledBookings / (bookings.length || 1)) * 100;

  // Calculate booking utilization
  const totalSlots = 14 * 5; // 14 slots per day * 5 days
  const utilization = (bookings.length / totalSlots) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Average Booking Speed"
        value={`${Math.round(averageBookingSpeed / 60)}h`}
        icon={<Clock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />}
        description="Average time between slot opening and booking"
        trend={{ value: 15, isPositive: true }}
      />
      <MetricCard
        title="Unique Users"
        value={uniqueUsers}
        icon={<Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />}
        description="Number of different users making bookings"
        trend={{ value: 8, isPositive: true }}
      />
      <MetricCard
        title="Cancellation Rate"
        value={`${Math.round(cancellationRate)}%`}
        icon={<Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />}
        description="Percentage of bookings that were cancelled"
        trend={{ value: 5, isPositive: false }}
      />
      <MetricCard
        title="Slot Utilization"
        value={`${Math.round(utilization)}%`}
        icon={<TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />}
        description="Percentage of total available slots booked"
        trend={{ value: 12, isPositive: true }}
      />
    </div>
  );
}