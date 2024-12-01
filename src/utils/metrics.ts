import { Booking } from '../types/booking';

// Track user activity and system metrics
class MetricsCollector {
  private static instance: MetricsCollector;
  private metrics: Map<string, number>;
  private readonly FLUSH_INTERVAL = 60000; // 1 minute

  private constructor() {
    this.metrics = new Map();
    setInterval(() => this.flush(), this.FLUSH_INTERVAL);
  }

  static getInstance(): MetricsCollector {
    if (!MetricsCollector.instance) {
      MetricsCollector.instance = new MetricsCollector();
    }
    return MetricsCollector.instance;
  }

  increment(metric: string, value = 1) {
    const current = this.metrics.get(metric) || 0;
    this.metrics.set(metric, current + value);
  }

  private flush() {
    if (this.metrics.size === 0) return;

    const metricsData = Object.fromEntries(this.metrics);
    console.log('Metrics:', metricsData);
    
    // In a real application, send metrics to a monitoring service
    // await sendMetrics(metricsData);
    
    this.metrics.clear();
  }
}

export const metrics = MetricsCollector.getInstance();

// Track booking patterns
export const analyzeBookingPatterns = (bookings: Booking[]) => {
  const patterns = {
    peakHours: new Map<number, number>(),
    popularDays: new Map<string, number>(),
    averageBookingTime: 0,
  };

  bookings.forEach(booking => {
    const hour = booking.date.getHours();
    const day = booking.date.toLocaleDateString('en-US', { weekday: 'long' });
    
    patterns.peakHours.set(hour, (patterns.peakHours.get(hour) || 0) + 1);
    patterns.popularDays.set(day, (patterns.popularDays.get(day) || 0) + 1);
  });

  return patterns;
};