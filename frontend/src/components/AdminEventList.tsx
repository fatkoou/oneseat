import { Link } from 'react-router';
import type { EventItem } from '../api/types';
import { formatShortDate, formatTime } from '../lib/dates';
import './AdminEventList.css';

export function AdminEventList({ events }: { events: EventItem[] }) {
  return (
    <ul className="admin-events">
      {events.map((event) => (
        <li key={event.id} className="admin-events__item">
          <div>
            <p className="admin-events__title">{event.title}</p>
            <p className="admin-events__meta">
              {formatShortDate(event.startsAt)}, {formatTime(event.startsAt)} · {event.location}
            </p>
          </div>
          <div className="admin-events__actions">
            <Link to={`/admin/events/${event.id}/seats`} className="btn btn--secondary btn--sm">
              Seats
            </Link>
            <Link to={`/events/${event.id}`} className="btn btn--ghost btn--sm">
              View
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
