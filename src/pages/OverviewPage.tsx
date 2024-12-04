import React, { useState, useEffect } from 'react';
import { Activity, Calendar, Clock, Users } from 'lucide-react';
import { format, startOfWeek, endOfWeek, isWithinInterval, isBefore, isSameDay, addMinutes } from 'date-fns';
import StatsCard from '../components/overview/StatsCard';
import QuickActions from '../components/overview/QuickActions';
import HealthTips from '../components/overview/HealthTips';
import OpeningHours from '../components/overview/OpeningHours';
import { useBookings } from '../hooks/useBookings';
import { getNextAvailableSlot } from '../utils/timeUtils';
import { generateTimeSlots } from '../utils/dateUtils';

export default function OverviewPage() {
  const { bookings } = useBookings();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextSlot, setNextSlot] = useState<{
    date: string;
    time: string;
    full: string;
    trend: number;
  } | null>(null);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // Also update next available slot when time changes
      const slot = getNextAvailableSlot(bookings);
      setNextSlot(slot);
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Update next available slot when bookings change
  useEffect(() => {
    const slot = getNextAvailableSlot(bookings);
    setNextSlot(slot);
  }, [bookings, currentTime]);

  // Calculate weekly bookings
  const weekStart = startOfWeek(currentTime, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentTime, { weekStartsOn: 1 });
  
  const weeklyBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.date);
    return isWithinInterval(bookingDate, { start: weekStart, end: weekEnd });
  });

  // Calculate today's bookings
  const todayBookings = bookings.filter(b => 
    new Date(b.date).toDateString() === currentTime.toDateString()
  );

  // Calculate available slots for the remaining week
  const calculateAvailableSlots = () => {
    const now = new Date();
    const timeSlots = generateTimeSlots();
    const slotsPerDay = timeSlots.length; // 15 slots per day (10:00 to 17:30, every 30 min)
    let totalAvailableSlots = 0;

    // For today, only count future slots (with 30 min buffer)
    if (isSameDay(now, currentTime)) {
      const todaySlots = timeSlots.filter(time => {
        const [hours, minutes] = time.split(':');
        const slotTime = new Date(now);
        slotTime.setHours(parseInt(hours), parseInt(minutes));
        return !isBefore(addMinutes(slotTime, -30), now);
      });
      totalAvailableSlots += todaySlots.length;
    }

    // Calculate remaining weekdays after today
    const today = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const remainingWeekdays = today <= 5 ? 5 - today : 0;

    // Add slots for remaining weekdays
    totalAvailableSlots += remainingWeekdays * slotsPerDay;

    // Subtract booked slots
    const futureBookings = weeklyBookings.filter(booking => 
      !isBefore(new Date(booking.date), addMinutes(now, -30))
    );

    return totalAvailableSlots - futureBookings.length;
  };

  const availableSlots = calculateAvailableSlots();
  const totalSlotsThisWeek = 15 * 5; // Used only for percentage calculation

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
          trend={nextSlot ? { value: nextSlot.trend, isPositive: true } : undefined}
        />
        <StatsCard
          title="Today's Bookings"
          value={`${todayBookings.length} sessions`}
          icon={Activity}
          description="Appointments today"
        />
        <StatsCard
          title="Opening Hours"
          value={format(currentTime, 'EEEE') === 'Saturday' || format(currentTime, 'EEEE') === 'Sunday' 
            ? 'Closed Today'
            : '10AM - 5:30PM'}
          icon={Clock}
          description={format(currentTime, 'EEEE')}
        />
        <StatsCard
          title="Weekly Slots"
          value={`${availableSlots} available`}
          icon={Users}
          description="This week's capacity"
          trend={{ 
            value: Math.round((availableSlots / totalSlotsThisWeek) * 100), 
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