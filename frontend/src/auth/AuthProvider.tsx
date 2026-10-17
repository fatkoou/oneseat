import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import * as authApi from '../api/auth';
import { setAccessToken, setUnauthorizedHandler } from '../api/client';
import { AuthContext } from './AuthContext';
import { createSession } from './session';
import type { Session } from './session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  const endSession = useCallback((expired: boolean) => {
    setAccessToken(null);
    setSession(null);
    setSessionExpired(expired);
  }, []);

  async function signIn(email: string, password: string) {
    const { access_token } = await authApi.login(email, password);
    setAccessToken(access_token);
    setSession(createSession(access_token, email));
    setSessionExpired(false);
  }

  async function register(email: string, password: string) {
    await authApi.register(email, password);
    await signIn(email, password);
  }

  function signOut() {
    endSession(false);
  }

  // The server said our token is no longer valid.
  useEffect(() => {
    setUnauthorizedHandler(() => endSession(true));
  }, [endSession]);

  // Sign out by ourselves when the token runs out.
  useEffect(() => {
    if (!session) return;

    const timeLeft = Math.max(session.expiresAt - Date.now(), 0);
    const timer = setTimeout(() => endSession(true), timeLeft);
    return () => clearTimeout(timer);
  }, [session, endSession]);

  return (
    <AuthContext.Provider value={{ session, sessionExpired, signIn, register, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
