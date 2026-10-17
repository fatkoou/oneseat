import { Link } from 'react-router';
import type { EventItem } from '../api/types';
import { formatShortDate, formatTime, isPast } from '../lib/dates';
import { EventCover } from './EventCover';
import './EventCard.css';

export function EventCard({ event }: { event: EventItem }) {
  const className = isPast(event.startsAt) ? 'event-card event-card--past' : 'event-card';

  return (
    <Link to={`/events/${event.id}`} className={className}>
      <EventCover event={event} />
      <div className="event-card__body">
        <p className="event-card__date">
          {formatShortDate(event.startsAt)}, {formatTime(event.startsAt)}
        </p>
        <h3 className="event-card__title">{event.title}</h3>
        <p className="event-card__place">{event.location}</p>
      </div>
    </Link>
  );
}
