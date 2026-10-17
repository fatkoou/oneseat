import type { EventItem } from '../api/types';
import { formatLongDate, formatTime } from '../lib/dates';
import './EventHeader.css';

export function EventHeader({ event }: { event: EventItem }) {
  return (
    <header className="event-header">
      <p className="event-header__when">
        {formatLongDate(event.startsAt)}, {formatTime(event.startsAt)}
      </p>
      <h1 className="page-title">{event.title}</h1>
      <p className="event-header__place">{event.location}</p>
      {event.description && <p className="event-header__description">{event.description}</p>}
    </header>
  );
}
