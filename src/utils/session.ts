const SESSION_TOKEN_KEY = 'djema_session_token';

/**
 * Returns the session token from localStorage, generating one if absent.
 * The token identifies a guest requester across page loads.
 */
export function getSessionToken(): string {
  const stored = localStorage.getItem(SESSION_TOKEN_KEY);
  if (stored) return stored;
  const token =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
  localStorage.setItem(SESSION_TOKEN_KEY, token);
  return token;
}

export function clearSessionToken(): void {
  localStorage.removeItem(SESSION_TOKEN_KEY);
}
