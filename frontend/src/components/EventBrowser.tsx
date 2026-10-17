import { useState } from 'react';
import type { EventItem } from '../api/types';
import { isPast } from '../lib/dates';
import { EmptyState } from './EmptyState';
import { EventSection } from './EventSection';
import { NextUpCard } from './NextUpCard';
import './EventBrowser.css';

function matchesQuery(event: EventItem, query: string): boolean {
  const text = `${event.title} ${event.location}`.toLowerCase();
  return text.includes(query.trim().toLowerCase());
}

export function EventBrowser({ events }: { events: EventItem[] }) {
  const [query, setQuery] = useState('');

  const matching = events.filter((event) => matchesQuery(event, query));
  const upcoming = matching.filter((event) => !isPast(event.startsAt));
  const past = matching.filter((event) => isPast(event.startsAt));

  // The big "Next up" card is only for the normal view, not for search results.
  const searching = query.trim() !== '';
  const nextUp = searching ? undefined : upcoming[0];
  const comingUp = nextUp ? upcoming.slice(1) : upcoming;

  return (
    <>
      <div className="event-browser__toolbar">
        <input
          type="search"
          className="event-browser__search"
          placeholder="Search events or places"
          aria-label="Search events or places"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {matching.length === 0 && (
        <EmptyState title="No matching events" text={`Nothing found for “${query.trim()}”.`}>
          <button type="button" className="btn btn--secondary" onClick={() => setQuery('')}>
            Clear search
          </button>
        </EmptyState>
      )}

      {nextUp && <NextUpCard event={nextUp} />}
      <EventSection title="Coming up" events={comingUp} />
      <EventSection title="Past events" events={past} />
    </>
  );
}
