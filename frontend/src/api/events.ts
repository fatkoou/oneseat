import { request } from './client';
import type { CreateEventInput, EventItem } from './types';

export function getEvents(): Promise<EventItem[]> {
  return request<EventItem[]>('/events');
}

export function getEvent(id: string): Promise<EventItem> {
  return request<EventItem>(`/events/${id}`);
}

export function createEvent(input: CreateEventInput): Promise<EventItem> {
  return request<EventItem>('/events', { method: 'POST', body: input });
}
