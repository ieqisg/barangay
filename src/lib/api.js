// Lightweight API helper. If REACT_APP_API_URL is set, client will use
// remote endpoints. Otherwise the app continues to use localStorage fallbacks.

const API_BASE = process.env.REACT_APP_API_URL || '';

async function apiFetch(path, options = {}) {
  if (!API_BASE) throw new Error('API base URL not configured');
  const url = `${API_BASE.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  
  // Get JWT token from localStorage if available
  let token = '';
  try {
    const currentUser = localStorage.getItem('br_current_user_v1');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      token = userData.token || '';
    }
  } catch (e) {
    // Ignore parsing errors
  }

  const init = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...(options.headers || {}),
    },
    credentials: 'include', // allow cookies if the backend uses them
    ...options,
  };
  if (init.body && typeof init.body !== 'string') init.body = JSON.stringify(init.body);

  const res = await fetch(url, init);
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }
  if (!res.ok) {
    const err = (data && data.message) ? new Error(data.message) : new Error(res.statusText || 'API error');
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}

export { API_BASE, apiFetch };
