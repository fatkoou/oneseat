import { useCallback } from 'react';
import { Link, useParams } from 'react-router';
import { getEvent } from '../api/events';
import { getSeats } from '../api/seats';
import type { Seat } from '../api/types';
import { EmptyState } from '../components/EmptyState';
import { EventHeader } from '../components/EventHeader';
import { SeatLayoutForm } from '../components/SeatLayoutForm';
import { useAsync } from '../hooks/useAsync';
import './AdminSeatsPage.css';

function describeSeats(seats: Seat[]): string {
  if (seats.length === 0) return 'No seats yet.';

  const reserved = seats.filter((seat) => seat.reserved).length;
  return `${seats.length} seats, ${reserved} reserved`;
}

export function AdminSeatsPage() {
  const { eventId = '' } = useParams();
  const loadEvent = useCallback(() => getEvent(eventId), [eventId]);
  const loadSeats = useCallback(() => getSeats(eventId), [eventId]);
  const { data: event, error, reload: reloadEvent } = useAsync(loadEvent);
  const { data: seats, error: seatsError, reload: reloadSeats } = useAsync(loadSeats);

  return (
    <div className="container page">
      <Link to="/admin" className="admin-seats__back">
        ‹ Admin
      </Link>

      {!event && error && (
        <EmptyState title="Couldn't load this event" text={error}>
          <button type="button" className="btn btn--secondary" onClick={reloadEvent}>
            Try again
          </button>
        </EmptyState>
      )}

      {!event && !error && <div className="skeleton admin-seats__skeleton" aria-busy="true" />}

      {event && (
        <>
          <EventHeader event={event} />

          <div className="admin-seats__layout">
            <section className="admin-seats__current">
              <h2 className="admin-seats__label">Current seats</h2>
              <p className="admin-seats__count">{seats ? describeSeats(seats) : (seatsError ?? 'Loading…')}</p>
            </section>

            <SeatLayoutForm eventId={event.id} onGenerated={reloadSeats} />
          </div>
        </>
      )}
    </div>
  );
}
