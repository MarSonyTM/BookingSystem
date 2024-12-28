import { addDays, format, parse, setHours, setMinutes, startOfWeek, isAfter, isFriday, isWeekend } from 'date-fns';

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
  let monday = startOfWeek(today, { weekStartsOn: 1 }); // Get Monday of current week
  
  // If it's weekend or Friday after 10 AM, show next week's schedule
  if (isWeekend(today) || (isFriday(today) && isAfter(today, getTenAM(today)))) {
    // Add days to get to next week's Monday
    monday = addDays(monday, 7);
  }
  
  const weekDays = [];
  
  // Generate Monday to Friday of the target week
  for (let i = 0; i < 5; i++) {
    const currentDate = addDays(monday, i);
    weekDays.push({
      date: new Date(currentDate),
      dayName: format(currentDate, 'EEEE'),
      dayDate: format(currentDate, 'MMM d'),
    });
  }
  
  // If it's Friday after 10 AM, add current Friday as well
  if (isFriday(today) && isAfter(today, getTenAM(today))) {
    weekDays.unshift({
      date: new Date(today),
      dayName: 'Friday (Today)',
      dayDate: format(today, 'MMM d'),
    });
  }
  
  return weekDays;
};

export const formatTime = (time: string) => {
  return format(parse(time, 'HH:mm', new Date()), 'h:mm a');
};

// Helper function to get 10 AM of a given date
const getTenAM = (date: Date): Date => {
  const tenAM = new Date(date);
  tenAM.setHours(10, 0, 0, 0);
  return tenAM;
};