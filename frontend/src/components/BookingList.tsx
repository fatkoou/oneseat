import { Link } from 'react-router';
import type { ReservationDetails } from '../api/types';
import { splitBookings } from '../lib/reservations';
import { BookingSection } from './BookingSection';
import { EmptyState } from './EmptyState';

interface BookingListProps {
  reservations: ReservationDetails[];
  onCancel: (reservation: ReservationDetails) => Promise<void>;
}

export function BookingList({ reservations, onCancel }: BookingListProps) {
  const { upcoming, past } = splitBookings(reservations);

  if (upcoming.length === 0 && past.length === 0) {
    return (
      <EmptyState title="No reservations yet" text="Seats you reserve will show up here.">
        <Link to="/" className="btn btn--primary">
          Browse events
        </Link>
      </EmptyState>
    );
  }

  return (
    <>
      <BookingSection title="Upcoming" bookings={upcoming} onCancel={onCancel} />
      <BookingSection title="Past" bookings={past} />
    </>
  );
}
