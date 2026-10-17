import { Link } from 'react-router';
import type { BookingResult } from '../lib/reserveSeats';
import { seatLabel } from '../lib/seats';
import { Notice } from './Notice';

export function BookingResultNotice({ result }: { result: BookingResult }) {
  return (
    <>
      {result.reserved.length > 0 && (
        <Notice kind="success">
          Reserved: {result.reserved.map(seatLabel).join(', ')}. <Link to="/reservations">View my reservations</Link>
        </Notice>
      )}

      {result.failed.map(({ seat, message }) => (
        <Notice key={seat.id} kind="error">
          {seatLabel(seat)}: {message}
        </Notice>
      ))}
    </>
  );
}
