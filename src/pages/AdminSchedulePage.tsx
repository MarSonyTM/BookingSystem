import React, { useState } from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { Calendar, Clock, Save, Activity } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { generateTimeSlots } from '../utils/dateUtils';

export default function AdminSchedulePage() {
  const { weeklySchedule, setWeeklySchedule } = useAdmin();
  const [selectedWeek, setSelectedWeek] = useState(startOfWeek(new Date()));
  const timeSlots = generateTimeSlots();

  const days = Array.from({ length: 5 }).map((_, index) => {
    const date = addDays(selectedWeek, index);
    return {
      date,
      dayName: format(date, 'EEEE'),
      dayDate: format(date, 'MMM d'),
    };
  });

  const handleServiceChange = (date: Date, time: string, service: 'physio' | 'massage' | null) => {
    const newSchedule = [...weeklySchedule];
    const dayIndex = newSchedule.findIndex(
      (day) => day.date.toDateString() === date.toDateString()
    );

    if (dayIndex === -1) {
      newSchedule.push({
        date,
        slots: timeSlots.map((slot) => ({
          time: slot,
          service: slot === time ? service : null,
        })),
      });
    } else {
      const slotIndex = newSchedule[dayIndex].slots.findIndex(
        (slot) => slot.time === time
      );
      if (slotIndex !== -1) {
        newSchedule[dayIndex].slots[slotIndex].service = service;
      }
    }

    setWeeklySchedule(newSchedule);
  };

  const getSlotService = (date: Date, time: string) => {
    const day = weeklySchedule.find(
      (d) => d.date.toDateString() === date.toDateString()
    );
    return day?.slots.find((slot) => slot.time === time)?.service || null;
  };

  const handleSave = () => {
    alert('Schedule saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div className="absolute inset-0 bg-grid-gray-900/[0.02] dark:bg-grid-white/[0.02] bg-[size:24px_24px] sm:bg-[size:32px_32px]" />
      
      <div className="relative">
        <header className="sticky top-0 z-10 backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 shadow-sm border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/10">
                <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                  Schedule Management
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                  Set available services for each time slot
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6">
          <div className="space-y-4">
            {days.map((day) => (
              <div
                key={day.dayDate}
                className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50 transition-all hover:shadow-lg"
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                    <Calendar className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {day.dayName} - {day.dayDate}
                  </h2>
                </div>

                <div className="space-y-3">
                  {timeSlots.map((time) => (
                    <div
                      key={time}
                      className="flex items-center justify-between p-3 bg-gray-50/50 dark:bg-gray-700/50 rounded-xl border border-gray-200/50 dark:border-gray-600/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/50 dark:bg-gray-600/50 rounded-lg">
                          <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          {time}
                        </span>
                      </div>
                      <select
                        value={getSlotService(day.date, time) || ''}
                        onChange={(e) =>
                          handleServiceChange(
                            day.date,
                            time,
                            (e.target.value || null) as 'physio' | 'massage' | null
                          )
                        }
                        className="px-4 py-2 rounded-lg border border-gray-300/50 dark:border-gray-600/50 bg-white/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 transition-all"
                      >
                        <option value="">Not available</option>
                        <option value="physio">Physiotherapy</option>
                        <option value="massage">Massage</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>

        <button
          onClick={handleSave}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition-all hover:shadow-xl"
        >
          <Save className="w-5 h-5" />
          <span className="font-medium">Save Schedule</span>
        </button>
      </div>
    </div>
  );
} 