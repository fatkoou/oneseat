import type { Location } from 'react-router';

export interface RedirectState {
  from?: string;
}

export function getRedirectPath(location: Location): string {
  const state = location.state as RedirectState | null;
  return state?.from ?? '/';
}
