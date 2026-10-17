import { request } from './client';
import type { Seat, SeatLayoutRequest } from './types';

export function getSeats(eventId: string): Promise<Seat[]> {
  return request<Seat[]>(`/events/${eventId}/seats`);
}

export function generateSeats(eventId: string, layout: SeatLayoutRequest): Promise<{ created: number }> {
  return request<{ created: number }>(`/events/${eventId}/seats/generate`, { method: 'POST', body: layout });
}
