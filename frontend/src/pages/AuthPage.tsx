import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate, useLocation } from 'react-router';
import { ApiError } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import { getRedirectPath } from '../auth/redirect';
import { MAX_PASSWORD_LENGTH, validateCredentials } from '../auth/validation';
import type { CredentialErrors } from '../auth/validation';
import { Notice } from '../components/Notice';
import { TextField } from '../components/TextField';
import './AuthPage.css';

type AuthMode = 'sign-in' | 'register';

const TEXT = {
  'sign-in': {
    title: 'Sign in',
    submit: 'Sign in',
    switchQuestion: 'New to OneSeat?',
    switchLabel: 'Create an account',
    switchTo: '/register',
    passwordAutoComplete: 'current-password',
  },
  register: {
    title: 'Create your account',
    submit: 'Create account',
    switchQuestion: 'Already have an account?',
    switchLabel: 'Sign in',
    switchTo: '/sign-in',
    passwordAutoComplete: 'new-password',
  },
} as const;

export function AuthPage({ mode }: { mode: AuthMode }) {
  const { session, sessionExpired, signIn, register } = useAuth();
  const location = useLocation();
  const text = TEXT[mode];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<CredentialErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Signed in (just now or earlier): leave this page.
  if (session) {
    return <Navigate to={getRedirectPath(location)} replace />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const validationErrors = validateCredentials(email, password, mode === 'register');
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    setServerError(null);
    try {
      const submit = mode === 'register' ? register : signIn;
      await submit(email.trim(), password);
    } catch (error) {
      setServerError(error instanceof ApiError ? error.message : 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <div className="container auth">
      <div className="card auth__card">
        <h1 className="auth__title">{text.title}</h1>

        {sessionExpired && <Notice kind="info">Your session has expired. Please sign in again.</Notice>}
        {serverError && <Notice kind="error">{serverError}</Notice>}

        <form className="auth__form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={errors.email}
          />
          <TextField
            label="Password"
            type="password"
            autoComplete={text.passwordAutoComplete}
            maxLength={MAX_PASSWORD_LENGTH}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={errors.password}
          />
          <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={submitting}>
            {submitting ? 'Please wait…' : text.submit}
          </button>
        </form>

        <p className="auth__switch">
          {text.switchQuestion} <Link to={text.switchTo}>{text.switchLabel}</Link>
        </p>
      </div>
    </div>
  );
}
