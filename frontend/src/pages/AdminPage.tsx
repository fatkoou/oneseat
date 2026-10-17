import { useState } from 'react';
import { Link } from 'react-router';
import { getEvents } from '../api/events';
import type { EventItem } from '../api/types';
import { AdminEventList } from '../components/AdminEventList';
import { EmptyState } from '../components/EmptyState';
import { EventForm } from '../components/EventForm';
import { Notice } from '../components/Notice';
import { useAsync } from '../hooks/useAsync';
import './AdminPage.css';

export function AdminPage() {
  const { data: events, error, reload } = useAsync(getEvents);
  const [createdEvent, setCreatedEvent] = useState<EventItem | null>(null);

  function handleCreated(event: EventItem) {
    setCreatedEvent(event);
    reload();
  }

  return (
    <div className="container page">
      <h1 className="page-title">Admin</h1>
      <p className="page-subtitle">Create events and manage their seats.</p>

      {createdEvent && (
        <div className="admin-page__notice">
          <Notice kind="success">
            Created “{createdEvent.title}”. <Link to={`/admin/events/${createdEvent.id}/seats`}>Add seats</Link>
          </Notice>
        </div>
      )}

      <div className="admin-page__layout">
        <EventForm onCreated={handleCreated} />

        <section>
          <h2 className="admin-page__heading">Events</h2>

          {!events && !error && <div className="skeleton admin-page__skeleton" aria-busy="true" />}

          {!events && error && (
            <EmptyState title="Couldn't load events" text={error}>
              <button type="button" className="btn btn--secondary" onClick={reload}>
                Try again
              </button>
            </EmptyState>
          )}

          {events && events.length === 0 && (
            <EmptyState title="No events yet" text="Create the first one with the form." />
          )}

          {events && events.length > 0 && <AdminEventList events={events} />}
        </section>
      </div>
    </div>
  );
}
