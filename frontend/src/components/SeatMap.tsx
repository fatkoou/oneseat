import type { Seat } from '../api/types';
import { groupSeats } from '../lib/seats';
import { SeatButton } from './SeatButton';
import './SeatMap.css';

interface SeatMapProps {
  seats: Seat[];
  selectedIds: string[];
  onToggle: (seatId: string) => void;
}

export function SeatMap({ seats, selectedIds, onToggle }: SeatMapProps) {
  const sections = groupSeats(seats);

  return (
    <div className="seat-map">
      {sections.map((section) => (
        <section key={section.name} className="seat-section">
          <h3 className="seat-section__name">{section.name}</h3>

          {section.rows.map((row) => (
            <div key={row.label} className="seat-row">
              <span className="seat-row__label">{row.label}</span>
              <div className="seat-row__seats">
                {row.seats.map((seat) => (
                  <SeatButton
                    key={seat.id}
                    seat={seat}
                    selected={selectedIds.includes(seat.id)}
                    onToggle={onToggle}
                  />
                ))}
              </div>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
