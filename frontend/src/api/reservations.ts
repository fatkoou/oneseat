import { request } from './client';
import type { ReservationDetails, ReservationSummary } from './types';

export function reserveSeat(seatId: string): Promise<ReservationSummary> {
  return request<ReservationSummary>('/reservations', { method: 'POST', body: { seatId } });
}

export function getMyReservations(): Promise<ReservationDetails[]> {
  return request<ReservationDetails[]>('/reservations/me');
}

export async function cancelReservation(reservationId: string): Promise<void> {
  await request(`/reservations/${reservationId}/cancel`, { method: 'POST' });
}
