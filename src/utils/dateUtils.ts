import { addDays, format, parse, setHours, setMinutes, startOfWeek, isWeekend, nextMonday } from 'date-fns';

export const generateTimeSlots = () => {
  const slots: string[] = [];
  for (let hour = 10; hour < 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      // Skip the 17:30 slot
      if (hour === 17 && minute === 30) continue;
      slots.push(format(setMinutes(setHours(new Date(), hour), minute), 'HH:mm'));
    }
  }
  return slots;
};

const getStartOfWorkWeek = (date: Date): Date => {
  if (isWeekend(date)) {
    return nextMonday(date);
  }
  
  const monday = startOfWeek(date, { weekStartsOn: 1 });
  return date < monday ? monday : date;
};

export const generateWeekDays = () => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  
  // Calculate how many days to add to get to Monday
  const daysToMonday = currentDay === 0 ? 1 : currentDay === 1 ? 0 : 1 - currentDay;
  
  const startDate = new Date(today);
  startDate.setDate(today.getDate() + daysToMonday);
  startDate.setHours(0, 0, 0, 0);
  
  const weekDays = [];
  
  for (let i = 0; i < 5; i++) { // Only generate 5 days (Monday to Friday)
    const date = addDays(startDate, i);
    weekDays.push({
      date,
      dayName: format(date, 'EEEE'),
      dayDate: format(date, 'MMM d'),
    });
  }
  
  return weekDays;
};

export const formatTime = (time: string) => {
  return format(parse(time, 'HH:mm', new Date()), 'h:mm a');
};