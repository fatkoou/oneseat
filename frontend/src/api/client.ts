const API_URL = import.meta.env.VITE_API_URL ?? '/api';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function getErrorMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : 'Something went wrong. Please try again.';
}


// The access token lives only in memory (not in localStorage),
// so a script injected into the page cannot read it from storage.
let accessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

// Called when the server rejects our token (it expired or is invalid).
let unauthorizedHandler: () => void = () => {};

export function setUnauthorizedHandler(handler: () => void): void {
  unauthorizedHandler = handler;
}


interface RequestOptions {
  method?: 'GET' | 'POST';
  body?: unknown;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body } = options;

  const headers: Record<string, string> = {};
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, 'Cannot reach the server. Check your connection and try again.');
  }

  if (!response.ok) {
    if (response.status === 401 && accessToken) {
      unauthorizedHandler();
    }
    throw new ApiError(response.status, await readErrorMessage(response));
  }

  return (await response.json()) as T;
}

// NestJS errors look like { statusCode, message: string | string[], error }
async function readErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.json();
    const message = Array.isArray(data.message) ? data.message[0] : data.message;
    if (typeof message === 'string') {
      return message;
    }
  } catch {
    // The body was not JSON, use the fallback message below.
  }
  return 'Something went wrong. Please try again.';
}
