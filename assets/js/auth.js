/* ============================================================
   BGAT WATER INTEL — Auth Manager
   Uses backend JWT auth (POST /api/v1/auth/token)
   ============================================================ */
(function(window) {
'use strict';

var api = window.bgat && window.bgat.api;

var state = {
  user: null,
  loading: true,
  error: null
};

var listeners = [];

function notify() {
  var s = getState();
  listeners.forEach(function(cb) { cb(s); });
}

function getState() {
  return { user: state.user, loading: state.loading, error: state.error };
}

function subscribe(cb) {
  listeners.push(cb);
  cb(getState());
  return function() {
    listeners = listeners.filter(function(l) { return l !== cb; });
  };
}

async function fetchMe() {
  try {
    state.user = await api.apiFetch('/api/v1/auth/me');
    state.error = null;
  } catch(e) {
    state.user = null;
    localStorage.removeItem('bgat_token');
  } finally {
    state.loading = false;
    notify();
  }
}

async function init() {
  var token = localStorage.getItem('bgat_token');
  if (token) {
    await fetchMe();
  } else {
    state.loading = false;
    notify();
  }
}

async function login(username, password) {
  state.error = null;
  try {
    var form = new URLSearchParams();
    form.append('username', username);
    form.append('password', password);

    var res = await fetch(api.API_BASE + '/api/v1/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form
    });

    if (!res.ok) {
      var body;
      try { body = await res.json(); } catch(e) { body = { detail: 'Login failed' }; }
      throw new Error(body.detail || 'Login failed');
    }

    var data = await res.json();
    localStorage.setItem('bgat_token', data.access_token);
    await fetchMe();
  } catch(err) {
    state.error = err.message;
    state.loading = false;
    notify();
    throw err;
  }
}

function logout() {
  localStorage.removeItem('bgat_token');
  state.user = null;
  state.error = null;
  notify();
  window.location.href = 'index.html';
}

function onUnauthorized() {
  state.user = null;
  notify();
}

function requireAuth() {
  if (!localStorage.getItem('bgat_token')) {
    showLoginOverlay();
    return false;
  }
  return true;
}

function showLoginOverlay() {
  var overlay = document.getElementById('wiAuthOverlay');
  if (overlay) overlay.style.display = 'flex';
}

function hideLoginOverlay() {
  var overlay = document.getElementById('wiAuthOverlay');
  if (overlay) overlay.style.display = 'none';
}

// Expose globally
window.wiAuth = {
  init: init,
  login: login,
  logout: logout,
  subscribe: subscribe,
  getState: getState,
  requireAuth: requireAuth,
  showLoginOverlay: showLoginOverlay,
  hideLoginOverlay: hideLoginOverlay,
  onUnauthorized: onUnauthorized,
  fetchMe: fetchMe
};

})(window);
