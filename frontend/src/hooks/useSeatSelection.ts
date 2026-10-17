import { useCallback, useState } from 'react';

// A UI rule only. The API itself does not limit how many seats one person can reserve.
export const MAX_SELECTED_SEATS = 6;

export function useSeatSelection() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Selects the seat, or deselects it if it is already selected.
  const toggle = useCallback((seatId: string) => {
    setSelectedIds((current) => {
      if (current.includes(seatId)) return current.filter((id) => id !== seatId);
      if (current.length >= MAX_SELECTED_SEATS) return current;
      return [...current, seatId];
    });
  }, []);

  const removeSeats = useCallback((seatIds: string[]) => {
    setSelectedIds((current) => current.filter((id) => !seatIds.includes(id)));
  }, []);

  return { selectedIds, toggle, removeSeats };
}
