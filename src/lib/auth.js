// Frontend-only mock authentication module
// - Provides login, logout, register, and current user persisted in localStorage
// - Emits auth change events for UI to subscribe

const STORAGE_USERS = 'br_users_v1';
const STORAGE_CURRENT = 'br_current_user_v1';

// No seeded demo accounts by default so testers can create real accounts.
const defaultUsers = [];

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

function readUsers() {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available');
    return [];
  }
  try {
    const raw = localStorage.getItem(STORAGE_USERS);
    if (!raw) {
      // Initialize empty users array if none exists
      writeUsers([]);
      return [];
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading users from localStorage:', e);
    return [];
  }
}

function writeUsers(users) {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available');
    return;
  }
  try {
    localStorage.setItem(STORAGE_USERS, JSON.stringify(users || []));
  } catch (e) {
    console.error('Error writing users to localStorage:', e);
  }
}

// Initialize localStorage on module load
if (isLocalStorageAvailable() && !localStorage.getItem(STORAGE_USERS)) {
  writeUsers(defaultUsers);
}

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
  try {
    const raw = localStorage.getItem(STORAGE_CURRENT);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function login(email, password) {
  // Simulate a server delay
  return new Promise((resolve, reject) => {
    if (!isLocalStorageAvailable()) {
      return reject({ message: 'Storage is not available' });
    }

    setTimeout(() => {
      try {
        const users = readUsers();
        const user = users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase());
        if (!user) return reject({ message: 'User not found' });
        if (user.password !== password) return reject({ message: 'Invalid credentials' });

        const safeUser = { ...user };
        delete safeUser.password;
        localStorage.setItem(STORAGE_CURRENT, JSON.stringify(safeUser));
        notifyAuthChange(safeUser);
        resolve(safeUser);
      } catch (e) {
        console.error('Error during login:', e);
        reject({ message: 'Login failed' });
      }
    }, 600);
  });
}

export function logout() {
  if (!isLocalStorageAvailable()) {
    console.warn('Storage is not available');
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
  return new Promise((resolve, reject) => {
    if (!isLocalStorageAvailable()) {
      return reject({ message: 'Storage is not available' });
    }

    setTimeout(() => {
      try {
        const users = readUsers();
        if (users.find((u) => u.email.toLowerCase() === (form.email || '').toLowerCase())) {
          return reject({ message: 'Email already registered' });
        }

        const id = `u_${Date.now()}`;
        const newUser = {
          id,
          firstName: form.firstName || '',
          lastName: form.lastName || '',
          email: form.email,
          password: form.password,
          role: form.role || 'resident',
          contactNumber: form.contactNumber || '',
          address: form.address || ''
        };

        users.push(newUser);
        writeUsers(users);
        
        const safeUser = { ...newUser };
        delete safeUser.password;
        // Auto-login after register
        localStorage.setItem(STORAGE_CURRENT, JSON.stringify(safeUser));
        notifyAuthChange(safeUser);
        resolve(safeUser);
      } catch (e) {
        console.error('Error during registration:', e);
        reject({ message: 'Registration failed' });
      }
    }, 800);
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