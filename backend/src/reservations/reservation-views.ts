import { Reservation } from './reservation.entity';

export function toSummary(reservation: Reservation) {
  return {
    id: reservation.id,
    seatId: reservation.seatId,
    status: reservation.status,
    createdAt: reservation.createdAt,
  };
}

export function toDetails(reservation: Reservation) {
  return {
    id: reservation.id,
    status: reservation.status,
    createdAt: reservation.createdAt,
    seat: {
      section: reservation.seat.section,
      row: reservation.seat.rowLabel,
      number: reservation.seat.number,
    },
    event: {
      id: reservation.seat.event.id,
      title: reservation.seat.event.title,
      startsAt: reservation.seat.event.startsAt,
    },
  };
}
