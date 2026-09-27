// Small UI helpers shared by all views.
import * as store from './store.js';

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export function esc(s = '') {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Apple Maps link: opens the Maps app on iPhone/iPad.
export function mapsUrl({ q, ll, daddr }) {
  const p = new URLSearchParams();
  if (q) p.set('q', q);
  if (ll) p.set('ll', ll);
  if (daddr) p.set('daddr', daddr);
  return 'https://maps.apple.com/?' + p.toString();
}

// Family members. Names are entered on-device only; defaults are generic.
const DEFAULT_KIDS = ['Explorer 1', 'Explorer 2', 'Explorer 3'];
export function kids() {
  const saved = store.get('kids', null);
  return Array.isArray(saved) && saved.length === 3
    ? saved.map((n, i) => (n && n.trim()) || DEFAULT_KIDS[i])
    : DEFAULT_KIDS.slice();
}
export function hasNames() {
  const saved = store.get('kids', null);
  return Array.isArray(saved) && saved.some((n) => n && n.trim());
}

export function toast(msg, ms = 2600) {
  let t = $('#toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.setAttribute('role', 'status');
    t.setAttribute('aria-live', 'polite');
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove('show'), ms);
}

// A soft "ding" made with WebAudio (no audio files, works offline).
let actx;
export function chime(notes = [659, 784, 988]) {
  if (store.get('sound', true) === false) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const now = actx.currentTime;
    notes.forEach((f, i) => {
      const o = actx.createOscillator();
      const g = actx.createGain();
      o.type = 'triangle';
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, now + i * 0.09);
      g.gain.exponentialRampToValueAtTime(0.18, now + i * 0.09 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.09 + 0.5);
      o.connect(g).connect(actx.destination);
      o.start(now + i * 0.09);
      o.stop(now + i * 0.09 + 0.55);
    });
  } catch (e) {}
}

export function haptic() {
  try {
    navigator.vibrate && navigator.vibrate(12);
  } catch (e) {}
}

// Trip clock. Times are Pacific; the phone will be in Pacific time.
export function now() {
  const o = store.get('debugNow', null); // lets us preview "Today" mode
  return o ? new Date(o) : new Date();
}
