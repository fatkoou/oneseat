import type { Seat } from '../api/types';
import { seatLabel } from '../lib/seats';
import './SeatButton.css';

interface SeatButtonProps {
  seat: Seat;
  selected: boolean;
  onToggle: (seatId: string) => void;
}

function getClassName(seat: Seat, selected: boolean): string {
  if (seat.reserved) return 'seat seat--reserved';
  if (selected) return 'seat seat--selected';
  return 'seat';
}

export function SeatButton({ seat, selected, onToggle }: SeatButtonProps) {
  const label = seat.reserved ? `${seatLabel(seat)} (reserved)` : seatLabel(seat);

  return (
    <button
      type="button"
      className={getClassName(seat, selected)}
      aria-label={label}
      aria-pressed={selected}
      title={label}
      disabled={seat.reserved}
      onClick={() => onToggle(seat.id)}
    >
      {seat.number}
    </button>
  );
}
