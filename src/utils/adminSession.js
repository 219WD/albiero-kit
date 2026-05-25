export const ADMIN_TOKEN_KEY = 'albiero_emailmkt_admin_token';

export function getAdminFromToken(token = '') {
  const [payload] = String(token).split('.');
  if (!payload) return null;

  try {
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
    return JSON.parse(window.atob(padded));
  } catch {
    return null;
  }
}

export function getStoredAdmin() {
  return getAdminFromToken(localStorage.getItem(ADMIN_TOKEN_KEY) || '');
}
