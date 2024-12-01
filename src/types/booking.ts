export type ServiceType = 'physio' | 'massage';

export interface Booking {
  id: string;
  date: Date;
  service: ServiceType;
  clientName: string;
  clientEmail: string;
}

export interface TimeSlot {
  time: string;
  isBooked: boolean;
  booking?: Booking;
}