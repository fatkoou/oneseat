import { useId } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import './TextField.css';

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function TextAreaField({ label, error, ...textareaProps }: TextAreaFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const baseClass = 'field__input field__input--area';

  return (
    <div className="field">
      <label htmlFor={id} className="field__label">
        {label}
      </label>
      <textarea
        id={id}
        className={error ? `${baseClass} field__input--error` : baseClass}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...textareaProps}
      />
      {error && (
        <p id={errorId} className="field__error">
          {error}
        </p>
      )}
    </div>
  );
}
