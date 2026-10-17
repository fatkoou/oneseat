export interface EventItem {
  id: string;
  title: string;
  description: string | null;
  startsAt: string; // ISO date string, e.g. "2026-10-23T19:00:00.000Z"
  location: string;
  createdAt: string;
}

export type Role = 'admin' | 'user';

export interface Seat {
  id: string;
  section: string;
  rowLabel: string;
  number: number;
  reserved: boolean;
}

export interface ReservationSummary {
  id: string;
  seatId: string;
  status: ReservationStatus;
  createdAt: string;
}

export type ReservationStatus = 'confirmed' | 'cancelled';

export interface ReservationDetails {
  id: string;
  status: ReservationStatus;
  createdAt: string;
  seat: { section: string; row: string; number: number };
  event: { id: string; title: string; startsAt: string };
}

export interface CreateEventInput {
  title: string;
  description?: string;
  location: string;
  startsAt: string;
}

export interface SeatLayoutRequest {
  sections: {
    name: string;
    rows: { label: string; seatCount: number }[];
  }[];
}





