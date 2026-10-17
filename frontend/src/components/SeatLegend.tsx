import './SeatLegend.css';

export function SeatLegend() {
  return (
    <ul className="seat-legend">
      <li>
        <span className="seat-legend__swatch seat-legend__swatch--available" aria-hidden="true" />
        Available
      </li>
      <li>
        <span className="seat-legend__swatch seat-legend__swatch--selected" aria-hidden="true" />
        Selected
      </li>
      <li>
        <span className="seat-legend__swatch seat-legend__swatch--reserved" aria-hidden="true" />
        Reserved
      </li>
    </ul>
  );
}
