import * as store from '../store.js';
import { esc, kids, mapsUrl } from '../ui.js';
import { icons } from '../art.js';
import { passages } from '../content/scripture.js';
import { daily, moments, bonus } from '../content/devotions.js';

export function head(title, back = '#/', kicker = '') {
  return `<header class="page-head">${back ? `<a class="back" href="${back}" aria-label="Back">${icons.back}</a>` : ''}
  <div>${kicker ? `<div class="kicker">${esc(kicker)}</div>` : ''}<h1>${esc(title)}</h1></div></header>`;
}

export const page = (inner, cls = '') => `<div class="page ${cls}">${inner}</div>`;

export function mapsBtn(maps, label = 'Open in Maps') {
  if (!maps) return '';
  return `<a class="btn small" href="${mapsUrl(maps)}" target="_blank" rel="noopener">${icons.map}<span>${label}</span></a>`;
}

// ---- Scripture ----
export const translation = () => (store.get('translation', 'ESV') === 'NIV' ? 'NIV' : 'ESV');

export function passageHTML(ref) {
  const p = passages[ref];
  if (!p) return '';
  const tr = translation();
  const text = tr === 'NIV' ? p.niv : p.esv;
  const url = tr === 'NIV' ? p.nivUrl : p.esvUrl;
  return `<blockquote class="verse" data-ref="${esc(ref)}">${esc(text)}
  <span class="ref">${esc(ref)} (${tr}) · <a href="${url}" target="_blank" rel="noopener">Open in Bible app</a></span></blockquote>`;
}

export function translationToggle() {
  const tr = translation();
  return `<div class="seg" role="group" aria-label="Bible translation">
    <button type="button" data-tr="ESV" aria-pressed="${tr === 'ESV'}">ESV</button>
    <button type="button" data-tr="NIV" aria-pressed="${tr === 'NIV'}">NIV</button></div>`;
}

export function wireTranslation(root, rerender) {
  root.querySelectorAll('[data-tr]').forEach((b) =>
    b.addEventListener('click', () => {
      store.set('translation', b.dataset.tr);
      rerender();
    })
  );
}

// ---- Devotions: find + whose turn ----
export const allDevotions = () => [...daily, ...moments, ...bonus];
export const findDevotion = (id) => allDevotions().find((d) => d.id === id);

// Readers rotate among the kids in devotion order; "Swap" nudges one.
export function turns(id) {
  const order = [...daily, ...moments].map((d) => d.id);
  const i = Math.max(0, order.indexOf(id));
  const k = kids();
  const nudge = store.get('turn:' + id, 0);
  return { reader: k[(i + nudge) % 3], prayer: k[(i + nudge + 1) % 3] };
}

// Parent labels for the journal (editable, stored on-device).
export function family() {
  const p = store.get('parents', ['Mom', 'Dad']);
  return [...kids(), ...(Array.isArray(p) && p.length === 2 ? p : ['Mom', 'Dad'])];
}

const PT_TIME = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', hour: 'numeric', minute: '2-digit' });
export const fmtTime = (iso) => {
  const parts = PT_TIME.formatToParts(new Date(iso));
  const get = (t) => (parts.find((p) => p.type === t) || {}).value || '';
  return `${get('hour')}:${get('minute')}<small> ${get('dayPeriod').toLowerCase()}</small>`;
};

// Pacific-time day id for the trip (fri/sat/sun) or null.
export function tripDay(now) {
  const pt = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
  const y = pt.getFullYear(), mo = pt.getMonth() + 1, d = pt.getDate();
  if (y === 2026 && mo === 10 && d >= 9 && d <= 11) return ['fri', 'sat', 'sun'][d - 9];
  return null;
}
