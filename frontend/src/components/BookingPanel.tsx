import { Link, useLocation } from 'react-router';
import type { Seat } from '../api/types';
import { useAuth } from '../auth/AuthContext';
import { MAX_SELECTED_SEATS } from '../hooks/useSeatSelection';
import type { BookingResult } from '../lib/reserveSeats';
import { seatLabel } from '../lib/seats';
import { BookingResultNotice } from './BookingResultNotice';
import './BookingPanel.css';

interface BookingPanelProps {
  selectedSeats: Seat[];
  submitting: boolean;
  result: BookingResult | null;
  onRemove: (seatId: string) => void;
  onReserve: () => void;
}

function getReserveLabel(count: number): string {
  if (count === 0) return 'Reserve';
  return count === 1 ? 'Reserve 1 seat' : `Reserve ${count} seats`;
}

export function BookingPanel({ selectedSeats, submitting, result, onRemove, onReserve }: BookingPanelProps) {
  const { session } = useAuth();
  const location = useLocation();
  const count = selectedSeats.length;

  return (
    <aside className="booking-panel" aria-label="Your booking">
      <h2 className="booking-panel__title">Your seats</h2>

      {count === 0 ? (
        <p className="booking-panel__hint">Pick up to {MAX_SELECTED_SEATS} seats on the map.</p>
      ) : (
        <ul className="booking-panel__seats">
          {selectedSeats.map((seat) => (
            <li key={seat.id}>
              <button
                type="button"
                className="seat-chip"
                aria-label={`Remove ${seatLabel(seat)}`}
                onClick={() => onRemove(seat.id)}
              >
                {seatLabel(seat)} <span aria-hidden="true">×</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {count === MAX_SELECTED_SEATS && (
        <p className="booking-panel__hint">That is the limit for one booking.</p>
      )}

      {result && <BookingResultNotice result={result} />}

      {session ? (
        <button
          type="button"
          className="btn btn--primary btn--lg btn--block"
          disabled={count === 0 || submitting}
          onClick={onReserve}
        >
          {submitting ? 'Reserving…' : getReserveLabel(count)}
        </button>
      ) : (
        <Link to="/sign-in" state={{ from: location.pathname }} className="btn btn--primary btn--lg btn--block">
          Sign in to reserve
        </Link>
      )}
    </aside>
  );
}
