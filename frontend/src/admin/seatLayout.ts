import type { SeatLayoutRequest } from '../api/types';
import { hasErrors } from './validation';

// Same limits as the backend (GenerateSeatsDto).
export const MAX_SECTIONS = 20;
export const MAX_SECTION_NAME_LENGTH = 50;
export const MAX_SEATS_PER_ROW = 200;
export const MAX_SEATS_PER_LAYOUT = 5000;

// Rows are lettered A, B, C ... so the UI allows 26 rows per section.
// (The backend allows more; this keeps the form simple.)
export const MAX_ROWS_PER_SECTION = 26;

// What the inputs hold. Everything is still text at this point.
export interface SectionDraft {
  key: string;
  name: string;
  rows: string;
  seatsPerRow: string;
}

export type SectionField = 'name' | 'rows' | 'seatsPerRow';
export type SectionErrors = Partial<Record<SectionField, string>>;
export type LayoutErrors = Record<string, SectionErrors>; // by section key

export function createSection(name = ''): SectionDraft {
  return { key: crypto.randomUUID(), name, rows: '5', seatsPerRow: '10' };
}

// "12" -> 12, but "", "1.5", "-2" and "abc" -> null
function parseWholeNumber(text: string): number | null {
  return /^\d+$/.test(text.trim()) ? Number(text) : null;
}

// Sections with invalid numbers count as 0, so the total stays usable while typing.
export function countSeats(sections: SectionDraft[]): number {
  return sections.reduce((total, section) => {
    const rows = parseWholeNumber(section.rows);
    const seatsPerRow = parseWholeNumber(section.seatsPerRow);

    return rows !== null && seatsPerRow !== null ? total + rows * seatsPerRow : total;
  }, 0);
}

function validateName(section: SectionDraft, allSections: SectionDraft[]): string | undefined {
  const name = section.name.trim();

  if (name === '') return 'Enter a name.';
  if (name.length > MAX_SECTION_NAME_LENGTH) return `Use at most ${MAX_SECTION_NAME_LENGTH} characters.`;

  const sameName = allSections.filter((other) => other.name.trim().toLowerCase() === name.toLowerCase());
  if (sameName.length > 1) return 'Section names must be different.';

  return undefined;
}

function validateWholeNumber(text: string, max: number): string | undefined {
  const value = parseWholeNumber(text);

  if (value === null || value < 1) return 'Enter a whole number, 1 or more.';
  if (value > max) return `Use at most ${max}.`;
  return undefined;
}

export function validateSections(sections: SectionDraft[]): LayoutErrors {
  const errors: LayoutErrors = {};

  for (const section of sections) {
    errors[section.key] = {
      name: validateName(section, sections),
      rows: validateWholeNumber(section.rows, MAX_ROWS_PER_SECTION),
      seatsPerRow: validateWholeNumber(section.seatsPerRow, MAX_SEATS_PER_ROW),
    };
  }

  return errors;
}

export function isLayoutValid(sections: SectionDraft[]): boolean {
  const fieldsAreValid = Object.values(validateSections(sections)).every((errors) => !hasErrors(errors));

  return fieldsAreValid && countSeats(sections) <= MAX_SEATS_PER_LAYOUT;
}

// A, B, C ...
function rowLabels(count: number): string[] {
  return Array.from({ length: count }, (_, index) => String.fromCharCode(65 + index));
}

// Call this only after isLayoutValid: by then every number is a valid whole number.
export function toSeatLayout(sections: SectionDraft[]): SeatLayoutRequest {
  return {
    sections: sections.map((section) => ({
      name: section.name.trim(),
      rows: rowLabels(Number(section.rows)).map((label) => ({
        label,
        seatCount: Number(section.seatsPerRow),
      })),
    })),
  };
}
