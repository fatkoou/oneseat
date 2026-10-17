import { getEvents } from '../api/events';
import { DiscoverSkeleton } from '../components/DiscoverSkeleton';
import { EmptyState } from '../components/EmptyState';
import { EventBrowser } from '../components/EventBrowser';
import { useAsync } from '../hooks/useAsync';

export function DiscoverPage() {
  const { data: events, error, loading, reload } = useAsync(getEvents);

  return (
    <div className="container page">
      <h1 className="page-title">Events</h1>
      <p className="page-subtitle">Choose an event and pick your seat.</p>

      {loading && !events && <DiscoverSkeleton />}

      {error && (
        <EmptyState title="Couldn't load events" text={error}>
          <button type="button" className="btn btn--secondary" onClick={reload}>
            Try again
          </button>
        </EmptyState>
      )}

      {events && events.length === 0 && (
        <EmptyState title="No events yet" text="New events will show up here as soon as they are added." />
      )}

      {events && events.length > 0 && <EventBrowser events={events} />}
    </div>
  );
}