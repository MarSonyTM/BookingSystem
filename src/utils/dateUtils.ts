import { addDays, format, parse, setHours, setMinutes, startOfWeek } from 'date-fns';

export const generateTimeSlots = () => {
  const slots: string[] = [];
  for (let hour = 10; hour <= 17; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      // Skip slots after 17:30
      if (hour === 17 && minute === 30) continue;
      slots.push(format(setMinutes(setHours(new Date(), hour), minute), 'HH:mm'));
    }
  }
  return slots;
};

export const generateWeekDays = () => {
  const today = new Date();
  const monday = startOfWeek(today, { weekStartsOn: 1 }); // Get Monday of current week
  const weekDays = [];
  
  // Generate Monday to Friday of current week
  for (let i = 0; i < 5; i++) {
    const currentDate = addDays(monday, i);
    weekDays.push({
      date: new Date(currentDate),
      dayName: format(currentDate, 'EEEE'),
      dayDate: format(currentDate, 'MMM d'),
    });
  }
  
  return weekDays;
};

export const formatTime = (time: string) => {
  return format(parse(time, 'HH:mm', new Date()), 'h:mm a');
};