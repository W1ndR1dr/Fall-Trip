// Fall Trip: tiny hash router, tab bar, theme, and service worker wiring.
import * as store from './store.js';
import { $, toast } from './ui.js';
import { doodles as icons, decorate } from './hand.js';
import { home } from './views/home.js';
import { plan, packView, beforeView, routeView } from './views/plan.js';
import { explore, colorView, foodView, activityView } from './views/explore.js';
import { kidsHome, huntView, leavesView, tracksView, rocksView, skyView, gamesView, drawView, photosView, cozyView } from './views/kids.js';
import { faithHome, devotionView, verseGame, journalView, lookbackView } from './views/faith.js';
import { settingsView, aboutView, installView } from './views/more.js';

const TABS = [
  { href: '#/', label: 'Today', icon: 'today', match: /^\/$/ },
  { href: '#/plan', label: 'Plan', icon: 'plan', match: /^\/(plan|pack|before|route)/ },
  { href: '#/explore', label: 'Explore', icon: 'explore', match: /^\/(explore|color|food|do)/ },
  { href: '#/kids', label: 'Kids', icon: 'kids', match: /^\/kids/ },
  { href: '#/faith', label: 'Devotions', icon: 'book', match: /^\/faith/ },
];

const ROUTES = [
  [/^\/$/, home],
  [/^\/plan(?:\/(\w+))?$/, plan],
  [/^\/route\/([\w-]+)$/, routeView],
  [/^\/pack$/, packView],
  [/^\/before$/, beforeView],
  [/^\/explore(?:\/(\w+))?$/, explore],
  [/^\/do\/([\w-]+)$/, activityView],
  [/^\/color$/, colorView],
  [/^\/food$/, foodView],
  [/^\/kids$/, kidsHome],
  [/^\/kids\/hunt$/, huntView],
  [/^\/kids\/leaves$/, leavesView],
  [/^\/kids\/tracks$/, tracksView],
  [/^\/kids\/rocks$/, rocksView],
  [/^\/kids\/sky$/, skyView],
  [/^\/kids\/games$/, gamesView],
  [/^\/kids\/draw$/, drawView],
  [/^\/kids\/photos$/, photosView],
  [/^\/kids\/cozy$/, cozyView],
  [/^\/faith$/, faithHome],
  [/^\/faith\/verse$/, verseGame],
  [/^\/faith\/journal$/, journalView],
  [/^\/faith\/lookback$/, lookbackView],
  [/^\/faith\/([\w-]+)$/, devotionView],
  [/^\/settings$/, settingsView],
  [/^\/about$/, aboutView],
  [/^\/install$/, installView],
];

let cleanup = null;
let lastPath = null;
const scrollMemory = new Map();

function renderTabs(path) {
  const nav = $('#tabs');
  nav.innerHTML = `<div class="tabs-inner">${TABS.map(
    (t) =>
      `<a href="${t.href}" ${t.match.test(path) ? 'aria-current="page"' : ''}>${icons[t.icon]}<span>${t.label}</span></a>`
  ).join('')}</div>`;
}

function route() {
  const path = (location.hash.replace(/^#/, '') || '/').split('?')[0];
  const main = $('#main');
  if (cleanup) {
    try { cleanup(); } catch (e) {}
    cleanup = null;
  }
  let view = null, params = [];
  for (const [re, fn] of ROUTES) {
    const m = path.match(re);
    if (m) { view = fn; params = m.slice(1); break; }
  }
  if (!view) { view = home; params = []; }
  const out = view(...params);
  main.innerHTML = out.html;
  document.title = out.title ? `${out.title} · Fall Trip` : 'Fall Trip';
  renderTabs(path);
  decorate(main);
  if (out.mount) cleanup = out.mount(main) || null;
  const y = scrollMemory.get(path) || 0;
  const same = path === lastPath; // re-render in place (e.g., ESV/NIV toggle)
  lastPath = path;
  window.scrollTo(0, out.keepScroll || same ? y : 0);
  main.focus({ preventScroll: true });
}

window.addEventListener('scroll', () => {
  const path = (location.hash.replace(/^#/, '') || '/').split('?')[0];
  scrollMemory.set(path, window.scrollY);
}, { passive: true });

// ---- Theme: auto (follows iPhone), or forced light/dark from Settings.
export function applyTheme() {
  const t = store.get('theme', 'auto');
  const root = document.documentElement;
  if (t === 'light' || t === 'dark') root.dataset.theme = t;
  else delete root.dataset.theme;
}
applyTheme();

// ---- Offline pill
function updateOnline() {
  const pill = $('#offline-pill');
  if (!pill) return;
  pill.hidden = navigator.onLine;
  if (!navigator.onLine) setTimeout(() => (pill.hidden = true), 4000);
}
window.addEventListener('online', updateOnline);
window.addEventListener('offline', updateOnline);

// ---- Service worker: precache everything; offer a reload when updated.
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('./sw.js');
      const prompt = (w) => {
        toast('A fresh version is ready. Tap to update.', 8000);
        const t = $('#toast');
        t.style.pointerEvents = 'auto';
        t.onclick = () => { w.postMessage('skipWaiting'); };
      };
      if (reg.waiting && navigator.serviceWorker.controller) prompt(reg.waiting);
      reg.addEventListener('updatefound', () => {
        const w = reg.installing;
        w && w.addEventListener('statechange', () => {
          if (w.state === 'installed' && navigator.serviceWorker.controller) prompt(w);
          if (w.state === 'installed' && !navigator.serviceWorker.controller) toast('Saved for offline. Works with no signal now.');
        });
      });
      // Reload only when an update replaces an existing worker, not on the
      // first install (where clients.claim() also fires controllerchange).
      const hadController = !!navigator.serviceWorker.controller;
      let reloaded = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (hadController && !reloaded) { reloaded = true; location.reload(); }
      });
    } catch (e) {
      console.warn('SW registration failed', e);
    }
  });
}

window.addEventListener('hashchange', route);
route();
updateOnline();
