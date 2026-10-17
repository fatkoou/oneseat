import type { Role } from '../api/types';

export interface Session {
  email: string;
  role: Role;
  expiresAt: number; // milliseconds since 1970, like Date.now()
}

interface TokenPayload {
  role: Role;
  exp: number; // seconds since 1970
}

// The role is only used to decide which links to show.
// The server checks the real permissions on every request.
export function createSession(token: string, email: string): Session {
  const payload = decodePayload(token);
  return { email, role: payload.role, expiresAt: payload.exp * 1000 };
}

function decodePayload(token: string): TokenPayload {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(atob(base64)) as TokenPayload;
}
