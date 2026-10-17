import type { Seat } from '../api/types';

export interface SeatRow {
  label: string;
  seats: Seat[];
}

export interface SeatSection {
  name: string;
  rows: SeatRow[];
}

// Turns the flat list from the API into section -> row -> seats.
// A Map keeps the order of the list, which the API already sorted.
export function groupSeats(seats: Seat[]): SeatSection[] {
  const sections = new Map<string, Map<string, Seat[]>>();

  for (const seat of seats) {
    const rows = sections.get(seat.section) ?? new Map<string, Seat[]>();
    const rowSeats = rows.get(seat.rowLabel) ?? [];

    rowSeats.push(seat);
    rows.set(seat.rowLabel, rowSeats);
    sections.set(seat.section, rows);
  }

  return [...sections].map(([name, rows]) => ({
    name,
    rows: [...rows].map(([label, rowSeats]) => ({ label, seats: rowSeats })),
  }));
}

// Example: "Floor · A4"
export function formatSeat(section: string, row: string, number: number): string {
  return `${section} · ${row}${number}`;
}

export function seatLabel(seat: Seat): string {
  return formatSeat(seat.section, seat.rowLabel, seat.number);
}
