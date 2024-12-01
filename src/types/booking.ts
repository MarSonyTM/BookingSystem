export type ServiceType = 'physio' | 'massage';

export interface Booking {
  id: string;
  date: Date;
  userId: string;
  serviceType: ServiceType;
}

export interface TimeSlot {
  time: string;
  isBooked: boolean;
  serviceType: ServiceType;
  booking?: Booking;
}

export interface WeeklySchedule {
  id: string;
  startDate: Date;
  slots: {
    [date: string]: {
      [time: string]: {
        serviceType: ServiceType;
      };
    };
  };
}