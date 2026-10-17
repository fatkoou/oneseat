import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { EMPTY_EVENT_FORM, toCreateEventInput, validateEventForm } from '../admin/eventForm';
import { hasErrors } from '../admin/validation';
import type { EventFormErrors, EventFormValues } from '../admin/eventForm';
import { getErrorMessage } from '../api/client';
import { createEvent } from '../api/events';
import type { EventItem } from '../api/types';
import { Notice } from './Notice';
import { TextAreaField } from './TextAreaField';
import { TextField } from './TextField';
import './EventForm.css';

interface EventFormProps {
  onCreated: (event: EventItem) => void;
}

export function EventForm({ onCreated }: EventFormProps) {
  const [values, setValues] = useState<EventFormValues>(EMPTY_EVENT_FORM);
  const [errors, setErrors] = useState<EventFormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Every input has a `name` that matches a key of EventFormValues.
  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setServerError(null);

    const foundErrors = validateEventForm(values);
    setErrors(foundErrors);
    if (hasErrors(foundErrors)) return;

    setSubmitting(true);
    try {
      const created = await createEvent(toCreateEventInput(values));
      setValues(EMPTY_EVENT_FORM);
      onCreated(created);
    } catch (error) {
      setServerError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="event-form" onSubmit={handleSubmit} noValidate>
      <h2 className="event-form__title">New event</h2>

      <TextField label="Title" name="title" value={values.title} onChange={handleChange} error={errors.title} />
      <TextAreaField
        label="Description (optional)"
        name="description"
        value={values.description}
        onChange={handleChange}
        error={errors.description}
      />
      <TextField
        label="Location"
        name="location"
        value={values.location}
        onChange={handleChange}
        error={errors.location}
      />

      <div className="event-form__when">
        <TextField label="Date" name="date" type="date" value={values.date} onChange={handleChange} error={errors.date} />
        <TextField label="Time" name="time" type="time" value={values.time} onChange={handleChange} error={errors.time} />
      </div>

      {serverError && <Notice kind="error">{serverError}</Notice>}

      <button type="submit" className="btn btn--primary btn--lg" disabled={submitting}>
        {submitting ? 'Creating…' : 'Create event'}
      </button>
    </form>
  );
}
