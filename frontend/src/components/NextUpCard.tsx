import { Link } from 'react-router';
import type { EventItem } from '../api/types';
import { formatLongDate, formatTime } from '../lib/dates';
import { EventCover } from './EventCover';
import './NextUpCard.css';

export function NextUpCard({ event }: { event: EventItem }) {
  return (
    <section className="next-up" aria-labelledby="next-up-title">
      <div className="next-up__text">
        <p className="next-up__label">Next up</p>
        <h2 id="next-up-title" className="next-up__title">
          {event.title}
        </h2>
        <p className="next-up__when">
          {formatLongDate(event.startsAt)}, {formatTime(event.startsAt)}
        </p>
        <p className="next-up__place">{event.location}</p>
        <Link to={`/events/${event.id}`} className="btn btn--primary btn--lg next-up__action">
          Choose seats
        </Link>
      </div>
      <EventCover event={event} size="hero" />
    </section>
  );
}
