import { ApiError, getErrorMessage } from '../api/client';
import { reserveSeat } from '../api/reservations';
import type { Seat } from '../api/types';

const HTTP_CONFLICT = 409;

export interface FailedSeat {
  seat: Seat;
  message: string;
  taken: boolean; // someone else got this seat first
}

export interface BookingResult {
  reserved: Seat[];
  failed: FailedSeat[];
}

// One request per seat. A failing seat does not stop the others,
// so the result says exactly what worked and what did not.
export async function reserveSeats(seats: Seat[]): Promise<BookingResult> {
  const outcomes = await Promise.allSettled(seats.map((seat) => reserveSeat(seat.id)));
  const result: BookingResult = { reserved: [], failed: [] };

  outcomes.forEach((outcome, index) => {
    const seat = seats[index];

    if (outcome.status === 'fulfilled') {
      result.reserved.push(seat);
    } else {
      result.failed.push(toFailedSeat(seat, outcome.reason));
    }
  });

  return result;
}

// Seats that should leave the selection: the ones we reserved and the ones
// someone else took. Seats that failed for another reason (for example a
// network error) stay selected, so the person can try again.
export function getFinishedSeatIds(result: BookingResult): string[] {
  const reservedIds = result.reserved.map((seat) => seat.id);
  const takenIds = result.failed.filter((failure) => failure.taken).map((failure) => failure.seat.id);

  return [...reservedIds, ...takenIds];
}

function toFailedSeat(seat: Seat, reason: unknown): FailedSeat {
  if (reason instanceof ApiError) {
    return { seat, 
        message: getErrorMessage(reason),
        taken: reason instanceof ApiError && reason.status === HTTP_CONFLICT };
  }
  return { seat, message: 'Something went wrong. Please try again.', taken: false };
}
