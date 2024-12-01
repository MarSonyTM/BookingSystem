import { Booking } from '../types/booking';

// In-memory cache with expiration
const cache = new Map<string, { data: any; expires: number }>();
const DEFAULT_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const cacheSet = (key: string, data: any, duration = DEFAULT_CACHE_DURATION) => {
  cache.set(key, {
    data,
    expires: Date.now() + duration,
  });
};

export const cacheGet = (key: string) => {
  const item = cache.get(key);
  if (!item) return null;
  
  if (Date.now() > item.expires) {
    cache.delete(key);
    return null;
  }
  
  return item.data;
};

// Cache specific booking data
export const cacheBookings = (bookings: Booking[]) => {
  cacheSet('bookings', bookings);
};

export const getCachedBookings = (): Booking[] | null => {
  return cacheGet('bookings');
};