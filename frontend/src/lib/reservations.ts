import type { ReservationDetails } from '../api/types';
import { isPast } from './dates';
import { formatSeat } from './seats';

// All the seats one person holds for one event.
export interface EventBooking {
  event: ReservationDetails['event'];
  reservations: ReservationDetails[];
}

export interface Bookings {
  upcoming: EventBooking[];
  past: EventBooking[];
}

export function reservationSeatLabel(reservation: ReservationDetails): string {
  const { section, row, number } = reservation.seat;
  return formatSeat(section, row, number);
}

function compareSeats(a: ReservationDetails, b: ReservationDetails): number {
  // numeric: true puts "A2" before "A10"
  return reservationSeatLabel(a).localeCompare(reservationSeatLabel(b), 'en', { numeric: true });
}

function groupByEvent(reservations: ReservationDetails[]): EventBooking[] {
  const groups = new Map<string, EventBooking>();

  for (const reservation of reservations) {
    const group = groups.get(reservation.event.id) ?? { event: reservation.event, reservations: [] };
    group.reservations.push(reservation);
    groups.set(reservation.event.id, group);
  }

  return [...groups.values()].map((group) => ({
    ...group,
    reservations: group.reservations.sort(compareSeats),
  }));
}

function startTime(booking: EventBooking): number {
  return new Date(booking.event.startsAt).getTime();
}

// Cancelled reservations are left out: for the person they are gone.
// Upcoming: soonest first. Past: most recent first.
export function splitBookings(reservations: ReservationDetails[]): Bookings {
  const bookings = groupByEvent(reservations.filter((reservation) => reservation.status === 'confirmed'));

  return {
    upcoming: bookings
      .filter((booking) => !isPast(booking.event.startsAt))
      .sort((a, b) => startTime(a) - startTime(b)),
    past: bookings
      .filter((booking) => isPast(booking.event.startsAt))
      .sort((a, b) => startTime(b) - startTime(a)),
  };
}
