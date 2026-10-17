import { useCallback } from 'react';
import { Link, useParams } from 'react-router';
import { getEvent } from '../api/events';
import { EmptyState } from '../components/EmptyState';
import { EventHeader } from '../components/EventHeader';
import { Notice } from '../components/Notice';
import { SeatPicker } from '../components/SeatPicker';
import { useAsync } from '../hooks/useAsync';
import { isPast } from '../lib/dates';
import './EventPage.css';

export function EventPage() {
  const { eventId = '' } = useParams();
  const loadEvent = useCallback(() => getEvent(eventId), [eventId]);
  const { data: event, error, reload } = useAsync(loadEvent);

  return (
    <div className="container page">
      <Link to="/" className="event-page__back">
        ‹ All events
      </Link>

      {!event && error && (
        <EmptyState title="Couldn't load this event" text={error}>
          <button type="button" className="btn btn--secondary" onClick={reload}>
            Try again
          </button>
        </EmptyState>
      )}

      {!event && !error && <div className="skeleton event-page__skeleton" aria-busy="true" />}

      {event && (
        <>
          <EventHeader event={event} />
          {isPast(event.startsAt) ? (
            <Notice kind="info">This event has already taken place, so seats can no longer be reserved.</Notice>
          ) : (
            <SeatPicker event={event} />
          )}
        </>
      )}
    </div>
  );
}
