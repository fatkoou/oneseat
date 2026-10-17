import { request } from './client';

interface LoginResponse {
  access_token: string;
}

export function login(email: string, password: string): Promise<LoginResponse> {
  return request<LoginResponse>('/auth/login', { method: 'POST', body: { email, password } });
}

export function register(email: string, password: string): Promise<unknown> {
  return request('/auth/register', { method: 'POST', body: { email, password } });
}
