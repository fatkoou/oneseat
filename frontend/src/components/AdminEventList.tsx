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
          <Link to={`/events/${event.id}`} className="btn btn--secondary btn--sm">
            View
          </Link>
        </li>
      ))}
    </ul>
  );
}
