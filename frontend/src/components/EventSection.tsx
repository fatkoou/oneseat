import type { EventItem } from '../api/types';
import { EventCard } from './EventCard';
import './EventSection.css';

interface EventSectionProps {
  title: string;
  events: EventItem[];
}

export function EventSection({ title, events }: EventSectionProps) {
  if (events.length === 0) return null;

  return (
    <section className="event-section">
      <h2 className="event-section__title">{title}</h2>
      <div className="event-grid">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
