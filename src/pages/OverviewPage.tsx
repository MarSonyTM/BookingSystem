import React, { useState, useEffect } from 'react';
import { Activity, Calendar, Clock, Users } from 'lucide-react';
import { format } from 'date-fns';
import StatsCard from '../components/overview/StatsCard';
import QuickActions from '../components/overview/QuickActions';
import HealthTips from '../components/overview/HealthTips';
import OpeningHours from '../components/overview/OpeningHours';
import { useBookings } from '../hooks/useBookings';
import { getNextAvailableSlot } from '../utils/timeUtils';

export default function OverviewPage() {
  const { bookings } = useBookings();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextSlot, setNextSlot] = useState<{
    date: string;
    time: string;
    full: string;
  } | null>(null);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Update next available slot when bookings change
  useEffect(() => {
    const slot = getNextAvailableSlot(bookings);
    setNextSlot(slot);
  }, [bookings, currentTime]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Current Date/Time Display */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          {format(currentTime, 'EEEE, MMMM d')}
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Current Time: {format(currentTime, 'HH:mm')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Next Available"
          value={nextSlot ? `${nextSlot.date}, ${nextSlot.time}` : 'No slots available'}
          icon={Calendar}
          description="Book your session now"
          trend={nextSlot ? { value: 100, isPositive: true } : undefined}
        />
        <StatsCard
          title="Today's Bookings"
          value={`${bookings.filter(b => 
            new Date(b.date).toDateString() === currentTime.toDateString()
          ).length} sessions`}
          icon={Activity}
          description="Appointments today"
        />
        <StatsCard
          title="Opening Hours"
          value={format(currentTime, 'EEEE') === 'Saturday' || format(currentTime, 'EEEE') === 'Sunday' 
            ? 'Closed Today'
            : '9AM - 6PM'}
          icon={Clock}
          description={format(currentTime, 'EEEE')}
        />
        <StatsCard
          title="Weekly Slots"
          value={`${14 - bookings.length} available`}
          icon={Users}
          description="This week's capacity"
          trend={{ 
            value: Math.round((14 - bookings.length) / 14 * 100), 
            isPositive: true 
          }}
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <QuickActions />
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <HealthTips />
        <OpeningHours />
      </div>
    </main>
  );
} 