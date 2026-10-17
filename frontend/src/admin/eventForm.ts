import type { CreateEventInput } from '../api/types';

// Same limits as the backend (CreateEventDto).
export const MAX_TITLE_LENGTH = 200;
export const MAX_LOCATION_LENGTH = 200;
export const MAX_DESCRIPTION_LENGTH = 2000;

export interface EventFormValues {
  title: string;
  description: string;
  location: string;
  date: string; // "2026-11-05", from <input type="date">
  time: string; // "20:30", from <input type="time">
}

export type EventFormErrors = Partial<Record<keyof EventFormValues, string>>;

export const EMPTY_EVENT_FORM: EventFormValues = {
  title: '',
  description: '',
  location: '',
  date: '',
  time: '',
};

export function hasErrors(errors: Record<string, string | undefined>): boolean {
  return Object.values(errors).some((message) => message !== undefined);
}

function validateRequiredText(value: string, label: string, maxLength: number): string | undefined {
  const length = value.trim().length;

  if (length === 0) return `Enter ${label}.`;
  if (length > maxLength) return `Use at most ${maxLength} characters.`;
  return undefined;
}

// "2026-11-05" + "20:30" is read as local time, like in the seed script.
function getStartDate(values: EventFormValues): Date {
  return new Date(`${values.date}T${values.time}`);
}

export function validateEventForm(values: EventFormValues): EventFormErrors {
  const errors: EventFormErrors = {
    title: validateRequiredText(values.title, 'a title', MAX_TITLE_LENGTH),
    location: validateRequiredText(values.location, 'a location', MAX_LOCATION_LENGTH),
    description:
      values.description.trim().length > MAX_DESCRIPTION_LENGTH
        ? `Use at most ${MAX_DESCRIPTION_LENGTH} characters.`
        : undefined,
    date: values.date === '' ? 'Pick a date.' : undefined,
    time: values.time === '' ? 'Pick a time.' : undefined,
  };

  if (!errors.date && !errors.time && getStartDate(values) <= new Date()) {
    errors.date = 'Pick a date and time in the future.';
  }

  return errors;
}

export function toCreateEventInput(values: EventFormValues): CreateEventInput {
  return {
    title: values.title.trim(),
    // an empty description is left out, so the server stores "no description"
    description: values.description.trim() || undefined,
    location: values.location.trim(),
    startsAt: getStartDate(values).toISOString(),
  };
}
