// Frontend-only mock request store
// - Persists to localStorage 'br_requests_v1'
// - Emits notifications on status changes

const STORAGE_REQUESTS = 'br_requests_v1';
const STORAGE_NOTIFS = 'br_notifs_v1';

function readRequests() {
  try {
    const raw = localStorage.getItem(STORAGE_REQUESTS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function writeRequests(data) {
  localStorage.setItem(STORAGE_REQUESTS, JSON.stringify(data));
}

function readNotifs() {
  try {
    const raw = localStorage.getItem(STORAGE_NOTIFS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function writeNotifs(n) {
  localStorage.setItem(STORAGE_NOTIFS, JSON.stringify(n));
}

let notifsSubscribers = [];
let requestsSubscribers = [];

function notifyNotifsChange() {
  const n = readNotifs();
  notifsSubscribers.forEach((cb) => cb(n));
}

function notifyRequestsChange() {
  const r = readRequests();
  requestsSubscribers.forEach((cb) => cb(r));
}

export function onNotifications(cb) {
  notifsSubscribers.push(cb);
  return () => { notifsSubscribers = notifsSubscribers.filter(c=>c!==cb); };
}

export function onRequests(cb) {
  requestsSubscribers.push(cb);
  return () => { requestsSubscribers = requestsSubscribers.filter(c=>c!==cb); };
}

function makeId() {
  return `r_${Date.now()}_${Math.floor(Math.random()*9000)+1000}`;
}

// Seed sample requests if empty (only once)
if (!localStorage.getItem(STORAGE_REQUESTS)) {
  const now = new Date().toISOString();
  const seed = [
    {
      id: makeId(),
      userId: 'resident01',
      title: 'Barangay Clearance Request',
      description: 'Need barangay clearance for employment',
      status: 'submitted',
      type: 'clearance',
      createdAt: now,
      updatedAt: now,
      logs: [ { ts: now, actor: 'system', message: 'Request submitted' } ]
    }
  ];
  writeRequests(seed);
}

export function getAllRequests() {
  return readRequests();
}

export function getRequestsByUserId(userId) {
  return readRequests().filter((r) => r.userId === userId);
}

export function getRequestById(id) {
  return readRequests().find((r) => r.id === id) || null;
}

export function createRequest(payload, user) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const requests = readRequests();
      const now = new Date().toISOString();
      const req = {
        id: makeId(),
        userId: user.id,
        title: payload.title,
        description: payload.description,
        type: payload.type || 'general',
        priority: payload.priority || 'medium',
        status: 'submitted',
        createdAt: now,
        updatedAt: now,
        handler: null,
        logs: [{ ts: now, actor: user.email, message: 'Submitted' }]
      };

      requests.unshift(req);
      writeRequests(requests);
      // notification for staff
      const n = readNotifs();
      n.unshift({ id: `n_${Date.now()}`, userId: null, message: `New request: ${req.title}`, ts: now, read: false });
      writeNotifs(n);
      notifyNotifsChange();
      notifyRequestsChange();
      resolve(req);
    }, 700);
  });
}

export function updateRequestStatus(id, status, actor) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const requests = readRequests();
      const idx = requests.findIndex((r) => r.id === id);
      if (idx === -1) return reject({ message: 'Request not found' });
      requests[idx].status = status;
      requests[idx].updatedAt = new Date().toISOString();
      requests[idx].logs.push({ ts: new Date().toISOString(), actor: actor || 'system', message: `Status changed to ${status}` });
      writeRequests(requests);

      // notify owner
      const ownerId = requests[idx].userId;
      const n = readNotifs();
      n.unshift({ id: `n_${Date.now()}`, userId: ownerId, message: `Your request "${requests[idx].title}" is now ${status}`, ts: new Date().toISOString(), read: false });
      writeNotifs(n);
      notifyNotifsChange();
      notifyRequestsChange();
      resolve(requests[idx]);
    }, 500);
  });
}

export function assignHandler(id, staffId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const requests = readRequests();
      const idx = requests.findIndex((r) => r.id === id);
      if (idx === -1) return reject({ message: 'Request not found' });
      requests[idx].handler = staffId;
      requests[idx].logs.push({ ts: new Date().toISOString(), actor: staffId, message: `Assigned to ${staffId}` });
      requests[idx].updatedAt = new Date().toISOString();
      writeRequests(requests);
      notifyRequestsChange();
      resolve(requests[idx]);
    }, 400);
  });
}

export function addLog(id, actor, message) {
  const requests = readRequests();
  const idx = requests.findIndex(r => r.id === id);
  if (idx === -1) return null;
  const log = { ts: new Date().toISOString(), actor, message };
  requests[idx].logs.push(log);
  requests[idx].updatedAt = new Date().toISOString();
  writeRequests(requests);
  notifyRequestsChange();
  return log;
}

export function getNotifications(userId) {
  const all = readNotifs();
  // userId === null means global notifications (staff)
  return all.filter(n => n.userId === null || n.userId === userId);
}

export function markNotificationRead(id) {
  const n = readNotifs();
  const idx = n.findIndex(x=>x.id===id);
  if (idx !== -1) { n[idx].read = true; writeNotifs(n); notifyNotifsChange(); }
}

  export default {
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
