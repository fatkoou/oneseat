import type { EventItem } from '../api/types';
import { formatDayNumber, formatMonth } from '../lib/dates';
import './EventCover.css';

const GRADIENTS = [
  ['#5e5ce6', '#bf5af2'],
  ['#ff9f0a', '#ff375f'],
  ['#34c759', '#00c7be'],
  ['#0a84ff', '#64d2ff'],
  ['#ff375f', '#bf5af2'],
  ['#1d1d1f', '#48484a'],
];

// The same event id always gives the same colors.
function pickGradient(id: string): string[] {
  const sum = [...id].reduce((total, char) => total + char.charCodeAt(0), 0);
  return GRADIENTS[sum % GRADIENTS.length];
}

interface EventCoverProps {
  event: EventItem;
  size?: 'card' | 'hero';
}

export function EventCover({ event, size = 'card' }: EventCoverProps) {
  const [from, to] = pickGradient(event.id);

  return (
    <div
      className={`cover cover--${size}`}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      aria-hidden="true"
    >
      <span className="cover__day">{formatDayNumber(event.startsAt)}</span>
      <span className="cover__month">{formatMonth(event.startsAt)}</span>
    </div>
  );
}
