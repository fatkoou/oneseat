import { useState } from 'react';
import './CancelButton.css';

interface CancelButtonProps {
  // Must not throw: the page that owns the data handles errors itself.
  onConfirm: () => Promise<void>;
}

export function CancelButton({ onConfirm }: CancelButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleConfirm() {
    setBusy(true);
    await onConfirm();
    setBusy(false);
    setConfirming(false);
  }

  if (!confirming) {
    return (
      <button type="button" className="btn btn--ghost btn--sm" onClick={() => setConfirming(true)}>
        Cancel
      </button>
    );
  }

  return (
    <span className="cancel-button">
      <button type="button" className="btn btn--danger btn--sm" disabled={busy} onClick={handleConfirm}>
        {busy ? 'Cancelling…' : 'Yes, cancel'}
      </button>
      <button type="button" className="btn btn--secondary btn--sm" disabled={busy} onClick={() => setConfirming(false)}>
        Keep
      </button>
    </span>
  );
}
