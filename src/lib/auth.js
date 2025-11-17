// Frontend-only mock authentication module
// - Provides login, logout, register, and current user persisted in localStorage
// - Emits auth change events for UI to subscribe

import { API_BASE, apiFetch } from './api';

// Only keep the current-user storage (token + user). Mock user lists removed.
const STORAGE_CURRENT = 'br_current_user_v1';

function isLocalStorageAvailable() {
  try {
    const test = '__test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

// Removed local mock user store - backend API is required for auth operations.

let authSubscribers = [];

function notifyAuthChange(user) {
  authSubscribers.forEach((cb) => cb(user));
}

export function onAuthChange(cb) {
  authSubscribers.push(cb);
  return () => {
    authSubscribers = authSubscribers.filter((c) => c !== cb);
  };
}

export function getCurrentUser() {
  // If API configured, we rely on localStorage as a client-side cache
  try {
    const raw = localStorage.getItem(STORAGE_CURRENT);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function login(email, password) {
  // Server-backed login. Attempt call and map some errors to a user-friendly message.
  return apiFetch('/auth/login', {
    method: 'POST',
    body: { email, password },
  }).then((response) => {
    // API returns { token, user }
    const userWithToken = response.user ? { ...response.user, token: response.token } : response;
    try { localStorage.setItem(STORAGE_CURRENT, JSON.stringify(userWithToken)); } catch (e) {}
    notifyAuthChange(userWithToken);
    return userWithToken;
  }).catch((err) => {
    // If the API helper indicates missing API base, surface a user-friendly message
    const msg = (err && err.message) ? err.message : '';
    const bodyMsg = err && err.body && err.body.message ? err.body.message : '';

    if (msg.includes('API base') || bodyMsg === 'No account found' || bodyMsg === 'User not found') {
      const e = new Error('User not found');
      e.status = err && err.status;
      throw e;
    }

    // Otherwise rethrow original error so callers can display the backend message
    throw err;
  });
}

export function logout() {
  if (API_BASE) {
    // best-effort call to server logout, ignore failures
    apiFetch('/auth/logout', { method: 'POST' }).catch(() => {});
  }
  if (!isLocalStorageAvailable()) {
    console.warn('Storage is not available');
    notifyAuthChange(null);
    return;
  }
  try {
    localStorage.removeItem(STORAGE_CURRENT);
    notifyAuthChange(null);
  } catch (e) {
    console.error('Error during logout:', e);
  }
}

export function register(form) {
  if (!API_BASE) return Promise.reject(new Error('API not configured'));
  return apiFetch('/auth/register', { method: 'POST', body: form }).then((response) => {
    // API returns { token, user }
    const userWithToken = response.user ? { ...response.user, token: response.token } : response;
    try { localStorage.setItem(STORAGE_CURRENT, JSON.stringify(userWithToken)); } catch (e) {}
    notifyAuthChange(userWithToken);
    return userWithToken;
  });
}

export function requireRole(role) {
  const user = getCurrentUser();
  return user && user.role === role;
}

const auth = {
  getCurrentUser,
  login,
  logout,
  register,
  onAuthChange,
  requireRole,
};

export default auth;