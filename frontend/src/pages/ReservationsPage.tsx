import { useState } from 'react';
import { cancelReservation, getMyReservations } from '../api/reservations';
import type { ReservationDetails } from '../api/types';
import { getErrorMessage } from '../api/client';
import { BookingList } from '../components/BookingList';
import { EmptyState } from '../components/EmptyState';
import { Notice } from '../components/Notice';
import { useAsync } from '../hooks/useAsync';
import { reservationSeatLabel } from '../lib/reservations';
import './ReservationsPage.css';

interface PageNotice {
  kind: 'success' | 'error';
  text: string;
}

export function ReservationsPage() {
  const { data: reservations, error, reload } = useAsync(getMyReservations);
  const [notice, setNotice] = useState<PageNotice | null>(null);

  async function handleCancel(reservation: ReservationDetails) {
    setNotice(null);

    try {
      await cancelReservation(reservation.id);
      setNotice({
        kind: 'success',
        text: `Cancelled ${reservationSeatLabel(reservation)} for ${reservation.event.title}.`,
      });
    } catch (err) {
      setNotice({ kind: 'error', text: getErrorMessage(err) });
    }

    // Reload in both cases, so the list always matches the server.
    reload();
  }

  return (
    <div className="container page">
      <h1 className="page-title">My reservations</h1>
      <p className="page-subtitle">Your seats for upcoming and past events.</p>

      {notice && (
        <div className="reservations-page__notice">
          <Notice kind={notice.kind}>{notice.text}</Notice>
        </div>
      )}

      {!reservations && !error && <div className="skeleton reservations-page__skeleton" aria-busy="true" />}

      {!reservations && error && (
        <EmptyState title="Couldn't load your reservations" text={error}>
          <button type="button" className="btn btn--secondary" onClick={reload}>
            Try again
          </button>
        </EmptyState>
      )}

      {reservations && <BookingList reservations={reservations} onCancel={handleCancel} />}
    </div>
  );
}
