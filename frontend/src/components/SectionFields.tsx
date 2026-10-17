import { MAX_ROWS_PER_SECTION, MAX_SEATS_PER_ROW } from '../admin/seatLayout';
import type { SectionDraft, SectionErrors, SectionField } from '../admin/seatLayout';
import { TextField } from './TextField';
import './SectionFields.css';

interface SectionFieldsProps {
  section: SectionDraft;
  errors: SectionErrors;
  canRemove: boolean;
  onChange: (field: SectionField, value: string) => void;
  onRemove: () => void;
}

export function SectionFields({ section, errors, canRemove, onChange, onRemove }: SectionFieldsProps) {
  return (
    <div className="section-fields">
      <TextField
        label="Section name"
        placeholder="Floor"
        value={section.name}
        error={errors.name}
        onChange={(event) => onChange('name', event.target.value)}
      />
      <TextField
        label="Rows"
        type="number"
        inputMode="numeric"
        min={1}
        max={MAX_ROWS_PER_SECTION}
        value={section.rows}
        error={errors.rows}
        onChange={(event) => onChange('rows', event.target.value)}
      />
      <TextField
        label="Seats per row"
        type="number"
        inputMode="numeric"
        min={1}
        max={MAX_SEATS_PER_ROW}
        value={section.seatsPerRow}
        error={errors.seatsPerRow}
        onChange={(event) => onChange('seatsPerRow', event.target.value)}
      />
      <button
        type="button"
        className="btn btn--ghost btn--sm section-fields__remove"
        disabled={!canRemove}
        onClick={onRemove}
      >
        Remove
      </button>
    </div>
  );
}
