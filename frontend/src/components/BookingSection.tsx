import type { ReservationDetails } from '../api/types';
import type { EventBooking } from '../lib/reservations';
import { BookingCard } from './BookingCard';
import './BookingSection.css';

interface BookingSectionProps {
  title: string;
  bookings: EventBooking[];
  onCancel?: (reservation: ReservationDetails) => Promise<void>;
}

export function BookingSection({ title, bookings, onCancel }: BookingSectionProps) {
  if (bookings.length === 0) return null;

  return (
    <section className="booking-section">
      <h2 className="booking-section__title">{title}</h2>
      <div className="booking-section__list">
        {bookings.map((booking) => (
          <BookingCard key={booking.event.id} booking={booking} onCancel={onCancel} />
        ))}
      </div>
    </section>
  );
}
