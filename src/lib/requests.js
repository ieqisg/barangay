// Requests store - server-backed only (no localStorage mocks)
import { API_BASE, apiFetch } from './api';

if (!API_BASE) {
  // Fail-fast: require backend API for requests store
  console.warn('API not configured: requests store requires REACT_APP_API_URL');
}

let notifsSubscribers = [];
let requestsSubscribers = [];

async function notifyNotifsChange() {
  if (!API_BASE) return;
  try {
    const n = await apiFetch('/notifications');
    notifsSubscribers.forEach((cb) => cb(n));
  } catch (e) {
    console.warn('notifyNotifsChange failed', e);
  }
}

async function notifyRequestsChange() {
  if (!API_BASE) return;
  try {
    const r = await apiFetch('/requests');
    requestsSubscribers.forEach((cb) => cb(r));
  } catch (e) {
    console.warn('notifyRequestsChange failed', e);
  }
}

export function onNotifications(cb) {
  notifsSubscribers.push(cb);
  return () => { notifsSubscribers = notifsSubscribers.filter(c=>c!==cb); };
}

export function onRequests(cb) {
  requestsSubscribers.push(cb);
  return () => { requestsSubscribers = requestsSubscribers.filter(c=>c!==cb); };
}

// Note: Removed built-in sample request seeding so the app starts with an empty
// store. Requests are now created only via the UI (or test scripts) and
// persisted in localStorage under the key defined by STORAGE_REQUESTS.

export function getAllRequests() {
  if (!API_BASE) return Promise.reject(new Error('API not configured'));
  return apiFetch('/requests');
}

export function getRequestsByUserId(userId) {
  if (!API_BASE) return Promise.reject(new Error('API not configured'));
  return apiFetch(`/requests?userId=${encodeURIComponent(userId)}`);
}

export function getRequestById(id) {
  if (!API_BASE) return Promise.reject(new Error('API not configured'));
  return apiFetch(`/requests/${id}`);
}

export function createRequest(payload, user) {
  if (!API_BASE) return Promise.reject(new Error('API not configured'));
  return apiFetch('/requests', { method: 'POST', body: { ...payload, authorId: user.id } }).then(async (res) => {
    // notify subscribers
    await notifyNotifsChange();
    await notifyRequestsChange();
    return res;
  });
}

export function updateRequestStatus(id, status, actor) {
  if (!API_BASE) return Promise.reject(new Error('API not configured'));
  return apiFetch(`/requests/${id}/status`, { method: 'PUT', body: { status, actor } }).then(async (res) => {
    await notifyNotifsChange();
    await notifyRequestsChange();
    return res;
  });
}

export function assignHandler(id, staffId) {
  if (!API_BASE) return Promise.reject(new Error('API not configured'));
  return apiFetch(`/requests/${id}/assign`, { method: 'PUT', body: { staffId } }).then(async (res) => {
    await notifyRequestsChange();
    return res;
  });
}

export function addLog(id, actor, message) {
  if (!API_BASE) return Promise.reject(new Error('API not configured'));
  return apiFetch(`/requests/${id}/logs`, { method: 'POST', body: { actor, message } }).then(async (res) => {
    await notifyRequestsChange();
    return res;
  });
}

export function getNotifications(userId) {
  if (!API_BASE) return Promise.reject(new Error('API not configured'));
  return apiFetch(`/notifications?userId=${encodeURIComponent(userId)}`);
}

export function markNotificationRead(id) {
  if (!API_BASE) return Promise.reject(new Error('API not configured'));
  return apiFetch(`/notifications/${id}/read`, { method: 'PUT' }).then(async (res) => {
    await notifyNotifsChange();
    return res;
  });
}

const requestsModule = {
  createRequest,
  getRequestsByUserId,
  getAllRequests,
  getRequestById,
  updateRequestStatus,
  assignHandler,
  addLog,
  getNotifications,
  markNotificationRead,
  onNotifications,
  onRequests,
};

export default requestsModule;
