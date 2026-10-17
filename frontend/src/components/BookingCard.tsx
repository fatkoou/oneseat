import { Link } from 'react-router';
import type { ReservationDetails } from '../api/types';
import { formatShortDate, formatTime } from '../lib/dates';
import { reservationSeatLabel } from '../lib/reservations';
import type { EventBooking } from '../lib/reservations';
import { CancelButton } from './CancelButton';
import './BookingCard.css';

interface BookingCardProps {
  booking: EventBooking;
  // Left out for past events: no handler, no cancel button.
  onCancel?: (reservation: ReservationDetails) => Promise<void>;
}

export function BookingCard({ booking, onCancel }: BookingCardProps) {
  const { event, reservations } = booking;
  const className = onCancel ? 'booking-card' : 'booking-card booking-card--past';

  return (
    <article className={className}>
      <header>
        <p className="booking-card__date">
          {formatShortDate(event.startsAt)}, {formatTime(event.startsAt)}
        </p>
        <h3 className="booking-card__title">
          <Link to={`/events/${event.id}`}>{event.title}</Link>
        </h3>
      </header>

      <ul className="booking-card__seats">
        {reservations.map((reservation) => (
          <li key={reservation.id} className="booking-card__seat">
            <span>{reservationSeatLabel(reservation)}</span>
            {onCancel && <CancelButton onConfirm={() => onCancel(reservation)} />}
          </li>
        ))}
      </ul>
    </article>
  );
}
