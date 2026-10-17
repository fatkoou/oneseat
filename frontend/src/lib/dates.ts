const shortDate = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
const longDate = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const time = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
const monthName = new Intl.DateTimeFormat('en-GB', { month: 'short' });

export function formatShortDate(iso: string): string {
  return shortDate.format(new Date(iso));
}

export function formatLongDate(iso: string): string {
  return longDate.format(new Date(iso));
}

export function formatTime(iso: string): string {
  return time.format(new Date(iso));
}

export function formatDayNumber(iso: string): string {
  return String(new Date(iso).getDate());
}

export function formatMonth(iso: string): string {
  return monthName.format(new Date(iso));
}

export function isPast(iso: string): boolean {
  return new Date(iso).getTime() < Date.now();
}
