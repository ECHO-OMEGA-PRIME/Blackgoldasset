/* ============================================================
   BGAT WATER INTEL — Common Utilities
   Sidebar nav, toasts, formatters, page bootstrap
   ============================================================ */
(function(window) {
'use strict';

/* ── SVG Icons ── */
var ICONS = {
  dashboard: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  wells: '<svg viewBox="0 0 24 24"><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="4"/></svg>',
  map: '<svg viewBox="0 0 24 24"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>',
  alerts: '<svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  upload: '<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
  query: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  back: '<svg viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>',
  logout: '<svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
  droplet: '<svg viewBox="0 0 24 24"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>',
  activity: '<svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
  barChart: '<svg viewBox="0 0 24 24"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>',
  shield: '<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  trending: '<svg viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
  billing: '<svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>'
};

/* ── Build Sidebar ── */
function buildSidebar(activePage) {
  var navItems = [
    { id: 'dashboard', label: 'Dashboard', href: 'dashboard.html', icon: ICONS.dashboard },
    { id: 'wells', label: 'Wells', href: 'wells.html', icon: ICONS.wells },
    { id: 'map', label: 'Formation Map', href: 'map.html', icon: ICONS.map },
    { id: 'alerts', label: 'Alerts', href: 'alerts.html', icon: ICONS.alerts },
    { divider: true },
    { id: 'upload', label: 'Upload PDF', href: 'upload.html', icon: ICONS.upload },
    { id: 'query', label: 'Data Query', href: 'query.html', icon: ICONS.query },
    { id: 'billing', label: 'Billing', href: 'billing.html', icon: ICONS.billing }
  ];

  var sidebar = document.createElement('aside');
  sidebar.className = 'wi-sidebar';

  var brand = '<div class="wi-sidebar-brand"><a href="index.html">BGAT<span>Water Intelligence</span></a></div>';
  var nav = '<nav class="wi-nav" aria-label="Water Intel navigation">';
  navItems.forEach(function(item) {
    if (item.divider) {
      nav += '<div class="wi-nav-divider"></div>';
    } else {
      var cls = item.id === activePage ? ' active' : '';
      nav += '<a href="' + item.href + '" class="' + cls + '">' + item.icon + item.label + '</a>';
    }
  });
  nav += '</nav>';

  var footer = '<div class="wi-sidebar-footer"><a href="index.html">' + ICONS.back + 'Back to BGAT</a></div>';

  sidebar.innerHTML = brand + nav + footer;
  return sidebar;
}

/* ── Build Auth Overlay ── */
function buildAuthOverlay() {
  var overlay = document.createElement('div');
  overlay.id = 'wiAuthOverlay';
  overlay.className = 'wi-auth-overlay';
  overlay.style.display = 'none';
  // Content set dynamically based on auth state
  return overlay;
}

/* ── Show Under Construction (unauthorized users) ── */
function showUnderConstruction() {
  var overlay = document.getElementById('wiAuthOverlay');
  if (!overlay) return;
  overlay.innerHTML = '<div class="wi-auth-card" style="text-align:center">' +
    '<div style="font-size:3rem;margin-bottom:16px">🚧</div>' +
    '<h2 style="margin-bottom:12px">Page Under Construction</h2>' +
    '<p style="color:var(--white-dim);margin-bottom:24px">This section is currently under development and access is restricted.</p>' +
    '<a href="index.html" class="btn-primary" style="display:inline-block;padding:12px 32px;text-decoration:none;border-radius:4px">← Back to BGAT Homepage</a>' +
    '</div>';
  overlay.style.display = 'flex';
}

/* ── Show Not Signed In (needs to login on main site first) ── */
function showNeedLogin() {
  var overlay = document.getElementById('wiAuthOverlay');
  if (!overlay) return;
  overlay.innerHTML = '<div class="wi-auth-card" style="text-align:center">' +
    '<div style="font-size:3rem;margin-bottom:16px">🔒</div>' +
    '<h2 style="margin-bottom:12px">Sign In Required</h2>' +
    '<p style="color:var(--white-dim);margin-bottom:24px">Please sign in from the BGAT homepage to access Water Intel.</p>' +
    '<a href="index.html" class="btn-primary" style="display:inline-block;padding:12px 32px;text-decoration:none;border-radius:4px">Go to Homepage & Sign In</a>' +
    '</div>';
  overlay.style.display = 'flex';
}

/* ── Build Top Bar ── */
function buildTopBar(title, subtitle) {
  var bar = document.createElement('header');
  bar.className = 'wi-topbar';
  bar.innerHTML = '<div class="wi-topbar-left"><h1>' + title + '</h1>' +
    (subtitle ? '<p>' + subtitle + '</p>' : '') +
    '</div><div class="wi-topbar-right" id="wiTopbarRight"></div>';
  return bar;
}

/* ── Initialize Page ── */
function initPage(opts) {
  var layout = document.createElement('div');
  layout.className = 'wi-layout';

  var sidebar = buildSidebar(opts.page);
  var main = document.createElement('main');
  main.className = 'wi-main';
  var topbar = buildTopBar(opts.title, opts.subtitle);
  var content = document.createElement('div');
  content.className = 'wi-content';
  content.id = 'wiContent';

  main.appendChild(topbar);
  main.appendChild(content);
  layout.appendChild(sidebar);
  layout.appendChild(main);

  var authOverlay = buildAuthOverlay();

  document.body.appendChild(layout);
  document.body.appendChild(authOverlay);

  // Mobile sidebar toggle
  var mobileToggle = document.createElement('button');
  mobileToggle.className = 'wi-mobile-toggle';
  mobileToggle.innerHTML = '&#9776;';
  mobileToggle.setAttribute('aria-label', 'Toggle navigation');
  document.body.appendChild(mobileToggle);

  var mobileOverlay = document.createElement('div');
  mobileOverlay.className = 'wi-sidebar-overlay';
  document.body.appendChild(mobileOverlay);

  mobileToggle.addEventListener('click', function() {
    sidebar.classList.toggle('open');
    mobileOverlay.classList.toggle('open');
  });
  mobileOverlay.addEventListener('click', function() {
    sidebar.classList.remove('open');
    mobileOverlay.classList.remove('open');
  });

  // Init auth — Firebase-based, no second login
  window.wiAuth.init().then(function() {
    var s = window.wiAuth.getState();
    if (s.error === 'not_authenticated') {
      showNeedLogin();
    } else if (s.error === 'unauthorized' || !s.authorized) {
      showUnderConstruction();
    } else if (s.user) {
      updateUserPill(s.user);
    }
  });

  // Listen for auth changes
  window.wiAuth.subscribe(function(s) {
    if (s.user && s.authorized) {
      updateUserPill(s.user);
    }
  });

  return content;
}

function updateUserPill(user) {
  var right = document.getElementById('wiTopbarRight');
  if (!right) return;
  var initial = (user.full_name || user.username || 'U')[0].toUpperCase();
  var name = user.full_name || user.username;
  right.innerHTML = '<div class="wi-user-pill">' +
    '<div class="wi-user-avatar">' + initial + '</div>' +
    '<span class="wi-user-name">' + escapeHtml(name) + '</span>' +
    '</div>' +
    '<button class="btn-outline btn-sm" onclick="wiAuth.logout()">Sign Out</button>';
}

/* ── Toast ── */
function showToast(message, type) {
  type = type || 'info';
  var existing = document.querySelector('.wi-toast');
  if (existing) existing.remove();

  var toast = document.createElement('div');
  toast.className = 'wi-toast wi-toast-' + type;
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(function() {
    toast.classList.add('show');
  });

  setTimeout(function() {
    toast.classList.remove('show');
    setTimeout(function() { toast.remove(); }, 300);
  }, 4000);
}

/* ── Formatters ── */
function formatDate(dateStr) {
  if (!dateStr) return '—';
  var d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatNumber(n, decimals) {
  if (n === null || n === undefined) return '—';
  decimals = decimals !== undefined ? decimals : 1;
  return Number(n).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function escapeHtml(str) {
  var div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

function severityBadge(severity) {
  var cls = severity === 'CRITICAL' ? 'badge-critical' : severity === 'WARNING' ? 'badge-warning' : 'badge-info';
  return '<span class="badge ' + cls + '">' + escapeHtml(severity) + '</span>';
}

function statusBadge(status) {
  var cls = status === 'active' ? 'badge-success' : 'badge-info';
  return '<span class="badge ' + cls + '">' + escapeHtml(status) + '</span>';
}

/* ── Skeleton ── */
function skeleton(height) {
  return '<div class="skeleton" style="height:' + (height || 40) + 'px"></div>';
}

function skeletonRows(count, height) {
  var html = '';
  for (var i = 0; i < count; i++) {
    html += '<div class="skeleton" style="height:' + (height || 40) + 'px;margin-bottom:8px"></div>';
  }
  return html;
}

/* ── Expose ── */
window.bgat = window.bgat || {};
window.bgat.common = {
  ICONS: ICONS,
  initPage: initPage,
  showToast: showToast,
  formatDate: formatDate,
  formatNumber: formatNumber,
  escapeHtml: escapeHtml,
  severityBadge: severityBadge,
  statusBadge: statusBadge,
  skeleton: skeleton,
  skeletonRows: skeletonRows
};

})(window);
