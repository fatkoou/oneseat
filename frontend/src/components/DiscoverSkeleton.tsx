import './DiscoverSkeleton.css';
import './EventSection.css';

export function DiscoverSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading events">
      <div className="skeleton discover-skeleton__hero" />
      <div className="event-grid discover-skeleton__grid">
        {[1, 2, 3].map((number) => (
          <div key={number} className="skeleton discover-skeleton__card" />
        ))}
      </div>
    </div>
  );
}
