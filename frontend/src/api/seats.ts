import { request } from './client';
import type { Seat } from './types';

export function getSeats(eventId: string): Promise<Seat[]> {
  return request<Seat[]>(`/events/${eventId}/seats`);
}
