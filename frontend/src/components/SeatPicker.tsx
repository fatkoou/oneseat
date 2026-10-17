import { useCallback, useState } from 'react';
import { getSeats } from '../api/seats';
import type { EventItem } from '../api/types';
import { useAsync } from '../hooks/useAsync';
import { useSeatSelection } from '../hooks/useSeatSelection';
import { getFinishedSeatIds, reserveSeats } from '../lib/reserveSeats';
import type { BookingResult } from '../lib/reserveSeats';
import { BookingPanel } from './BookingPanel';
import { EmptyState } from './EmptyState';
import { SeatLegend } from './SeatLegend';
import { SeatMap } from './SeatMap';
import './SeatPicker.css';

export function SeatPicker({ event }: { event: EventItem }) {
  const loadSeats = useCallback(() => getSeats(event.id), [event.id]);
  const { data: seats, error, reload } = useAsync(loadSeats);
  const { selectedIds, toggle, removeSeats } = useSeatSelection();
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<BookingResult | null>(null);

  if (!seats) {
    if (!error) return <div className="skeleton seat-picker__skeleton" aria-busy="true" />;

    return (
      <EmptyState title="Couldn't load the seats" text={error}>
        <button type="button" className="btn btn--secondary" onClick={reload}>
          Try again
        </button>
      </EmptyState>
    );
  }

  if (seats.length === 0) {
    return (
      <EmptyState
        title="No seat plan yet"
        text="The seat plan for this event has not been published. Please check back later."
      />
    );
  }

  const selectedSeats = seats.filter((seat) => selectedIds.includes(seat.id));

  // A new selection starts a new booking, so the old result goes away.
  function handleToggle(seatId: string) {
    setResult(null);
    toggle(seatId);
  }

  async function handleReserve() {
    setSubmitting(true);
    const outcome = await reserveSeats(selectedSeats);

    setResult(outcome);
    removeSeats(getFinishedSeatIds(outcome));
    reload(); // fresh seat list, so the new reservations show up as reserved
    setSubmitting(false);
  }

  return (
    <div className="seat-picker">
      <div>
        <SeatLegend />
        <SeatMap seats={seats} selectedIds={selectedIds} onToggle={handleToggle} />
      </div>

      <BookingPanel
        selectedSeats={selectedSeats}
        submitting={submitting}
        result={result}
        onRemove={handleToggle}
        onReserve={handleReserve}
      />
    </div>
  );
}
