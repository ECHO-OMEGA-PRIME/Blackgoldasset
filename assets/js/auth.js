/* ============================================================
   BGAT WATER INTEL — Auth Manager
   Uses Firebase Auth from main site (shared session)
   Only authorized emails can access Water Intel pages
   ============================================================ */
(function(window) {
'use strict';

var FB_CONFIG = {
  apiKey: "AIzaSyCuTHwqo6HPjR0oSlCnWBkRslXTZg41VWY",
  authDomain: "echo-prime-ai.firebaseapp.com",
  projectId: "echo-prime-ai",
  storageBucket: "echo-prime-ai.firebasestorage.app",
  messagingSenderId: "249995513427",
  appId: "1:249995513427:web:0d16c5c1f7b19a5eb140a6"
};

var AUTHORIZED_EMAILS = [
  'bmcii1976@gmail.com',
  'jonathan@blackgoldasset.com'
];

var state = {
  user: null,
  loading: true,
  error: null,
  authorized: false
};

var listeners = [];

function notify() {
  var s = getState();
  listeners.forEach(function(cb) { cb(s); });
}

function getState() {
  return { user: state.user, loading: state.loading, error: state.error, authorized: state.authorized };
}

function subscribe(cb) {
  listeners.push(cb);
  cb(getState());
  return function() {
    listeners = listeners.filter(function(l) { return l !== cb; });
  };
}

function isAuthorized(email) {
  if (!email) return false;
  return AUTHORIZED_EMAILS.indexOf(email.toLowerCase()) !== -1;
}

function loadScript(src) {
  return new Promise(function(resolve, reject) {
    var s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

async function init() {
  try {
    if (typeof firebase === 'undefined') {
      await loadScript('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
      await loadScript('https://www.gstatic.com/firebasejs/10.8.0/firebase-auth-compat.js');
    }
    if (!firebase.apps.length) {
      firebase.initializeApp(FB_CONFIG);
    }
    return new Promise(function(resolve) {
      var resolved = false;
      // Timeout: if Firebase doesn't resolve in 8 seconds, mark as not_authenticated
      var timeout = setTimeout(function() {
        if (!resolved) {
          resolved = true;
          state.loading = false;
          state.error = 'not_authenticated';
          notify();
          resolve();
        }
      }, 8000);
      firebase.auth().onAuthStateChanged(function(user) {
        if (resolved) return;
        resolved = true;
        clearTimeout(timeout);
        if (user) {
          var email = (user.email || '').toLowerCase();
          if (isAuthorized(email)) {
            state.user = {
              uid: user.uid,
              email: email,
              full_name: user.displayName || email,
              username: user.displayName || email
            };
            state.authorized = true;
            state.error = null;
            // Store Firebase ID token for API calls
            user.getIdToken().then(function(token) {
              localStorage.setItem('bgat_token', token);
            }).catch(function() {});
          } else {
            state.user = null;
            state.authorized = false;
            state.error = 'unauthorized';
          }
        } else {
          state.user = null;
          state.authorized = false;
          state.error = 'not_authenticated';
        }
        state.loading = false;
        notify();
        resolve();
      });
    });
  } catch(e) {
    state.loading = false;
    state.error = 'Firebase failed to load';
    notify();
  }
}

function logout() {
  localStorage.removeItem('bgat_token');
  if (typeof firebase !== 'undefined' && firebase.auth) {
    firebase.auth().signOut();
  }
  state.user = null;
  state.authorized = false;
  state.error = null;
  notify();
  window.location.href = 'index.html';
}

function onUnauthorized() {
  state.user = null;
  state.authorized = false;
  notify();
}

function requireAuth() {
  return state.authorized;
}

function showLoginOverlay() {
  var overlay = document.getElementById('wiAuthOverlay');
  if (overlay) overlay.style.display = 'flex';
}

function hideLoginOverlay() {
  var overlay = document.getElementById('wiAuthOverlay');
  if (overlay) overlay.style.display = 'none';
}

window.wiAuth = {
  init: init,
  login: function() { return Promise.resolve(); },
  logout: logout,
  subscribe: subscribe,
  getState: getState,
  requireAuth: requireAuth,
  showLoginOverlay: showLoginOverlay,
  hideLoginOverlay: hideLoginOverlay,
  onUnauthorized: onUnauthorized,
  fetchMe: function() { return Promise.resolve(state.user); }
};

})(window);
