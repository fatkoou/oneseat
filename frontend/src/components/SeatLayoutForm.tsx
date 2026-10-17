import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  MAX_SEATS_PER_LAYOUT,
  MAX_SECTIONS,
  countSeats,
  createSection,
  isLayoutValid,
  toSeatLayout,
  validateSections,
} from '../admin/seatLayout';
import type { SectionDraft, SectionField } from '../admin/seatLayout';
import { getErrorMessage } from '../api/client';
import { generateSeats } from '../api/seats';
import { Notice } from './Notice';
import { SectionFields } from './SectionFields';
import './SeatLayoutForm.css';

interface SeatLayoutFormProps {
  eventId: string;
  onGenerated: () => void;
}

interface FormResult {
  kind: 'success' | 'error';
  text: string;
}

export function SeatLayoutForm({ eventId, onGenerated }: SeatLayoutFormProps) {
  const [sections, setSections] = useState<SectionDraft[]>(() => [createSection('Floor')]);
  const [attempted, setAttempted] = useState(false);
  const [result, setResult] = useState<FormResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const total = countSeats(sections);
  const tooMany = total > MAX_SEATS_PER_LAYOUT;
  // Errors only show after the first submit attempt, and stay up to date while typing.
  const errors = attempted ? validateSections(sections) : {};

  function changeSection(key: string, field: SectionField, value: string) {
    setSections((current) =>
      current.map((section) => (section.key === key ? { ...section, [field]: value } : section)),
    );
  }

  function addSection() {
    setSections((current) => [...current, createSection()]);
  }

  function removeSection(key: string) {
    setSections((current) => current.filter((section) => section.key !== key));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setResult(null);
    setAttempted(true);

    if (!isLayoutValid(sections)) return;

    setSubmitting(true);
    try {
      const { created } = await generateSeats(eventId, toSeatLayout(sections));
      setResult({ kind: 'success', text: `Created ${created} seats.` });
      onGenerated();
    } catch (error) {
      setResult({ kind: 'error', text: getErrorMessage(error) });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="seat-layout" onSubmit={handleSubmit} noValidate>
      <h2 className="seat-layout__title">Add seats</h2>
      <p className="seat-layout__hint">Rows are lettered A, B, C… and seats are numbered from 1.</p>

      <div className="seat-layout__sections">
        {sections.map((section) => (
          <SectionFields
            key={section.key}
            section={section}
            errors={errors[section.key] ?? {}}
            canRemove={sections.length > 1}
            onChange={(field, value) => changeSection(section.key, field, value)}
            onRemove={() => removeSection(section.key)}
          />
        ))}
      </div>

      <button
        type="button"
        className="btn btn--secondary seat-layout__add"
        disabled={sections.length >= MAX_SECTIONS}
        onClick={addSection}
      >
        Add section
      </button>

      <p className={tooMany ? 'seat-layout__summary seat-layout__summary--error' : 'seat-layout__summary'}>
        {total} {total === 1 ? 'seat' : 'seats'} in {sections.length} {sections.length === 1 ? 'section' : 'sections'}
        {tooMany && ` · the limit is ${MAX_SEATS_PER_LAYOUT} per request`}
      </p>

      {result && <Notice kind={result.kind}>{result.text}</Notice>}

      <button type="submit" className="btn btn--primary btn--lg seat-layout__submit" disabled={submitting || tooMany}>
        {submitting ? 'Generating…' : 'Generate seats'}
      </button>
    </form>
  );
}
