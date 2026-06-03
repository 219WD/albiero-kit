export const WORLDCUP_TOKEN_KEY = 'albiero_worldcup_token';

export function getWorldCupUserFromToken(token = '') {
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
