import * as store from '../store.js';
import { esc, kids, mapsUrl } from '../ui.js';
import { doodles } from '../hand.js';
import { passages } from '../content/scripture.js';
import { daily, moments, bonus } from '../content/devotions.js';

export const icons = doodles;
export const art = (name, alt = '', cls = 'art') => `<img class="${cls}" src="img/art/${name}.webp" alt="${esc(alt)}" loading="lazy" decoding="async">`;

// Page header: optional back link, small eyebrow, title, and lede.
export function head(title, { back = '', eyebrow = '', lede = '' } = {}) {
  return `${back ? `<nav class="topbar"><a class="back" href="${back}">${doodles.back}<span>Back</span></a></nav>` : ''}
  <header class="page-head">${eyebrow ? `<span class="eyebrow">${esc(eyebrow)}</span>` : ''}<h1>${esc(title)}</h1>${lede ? `<p class="lede">${esc(lede)}</p>` : ''}</header>`;
}

export const page = (inner, cls = '') => `<div class="page ${cls}">${inner}</div>`;
export const card = (inner, cls = '') => `<div class="card ${cls}">${inner}</div>`;
export const sectionTitle = (t, note = '') => `<div class="section-title"><h2>${esc(t)}</h2>${note ? `<span class="note">${esc(note)}</span>` : ''}</div>`;

export function mapsBtn(maps, label = 'Open in Maps', cls = 'btn small secondary') {
  if (!maps) return '';
  return `<a class="${cls}" href="${mapsUrl(maps)}" target="_blank" rel="noopener">${doodles.map}<span>${label}</span></a>`;
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
  <span class="ref"><span>${esc(ref)} · ${tr}</span><a href="${url}" target="_blank" rel="noopener">Open in Bible app</a></span></blockquote>`;
}

export function translationToggle() {
  const tr = translation();
  return `<div class="segmented" role="group" aria-label="Bible translation">
    <button type="button" data-tr="ESV" aria-pressed="${tr === 'ESV'}">ESV</button>
    <button type="button" data-tr="NIV" aria-pressed="${tr === 'NIV'}">NIV</button></div>`;
}

export function wireTranslation(root, rerender) {
  root.querySelectorAll('[data-tr]').forEach((b) =>
    b.addEventListener('click', () => { store.set('translation', b.dataset.tr); rerender(); })
  );
}

// ---- Devotions: find + whose turn ----
export const allDevotions = () => [...daily, ...moments, ...bonus];
export const findDevotion = (id) => allDevotions().find((d) => d.id === id);

export function turns(id) {
  const order = [...daily, ...moments].map((d) => d.id);
  const i = Math.max(0, order.indexOf(id));
  const k = kids();
  const nudge = store.get('turn:' + id, 0);
  return { reader: k[(i + nudge) % 3], prayer: k[(i + nudge + 1) % 3] };
}

export function family() {
  const p = store.get('parents', ['Mom', 'Dad']);
  return [...kids(), ...(Array.isArray(p) && p.length === 2 ? p : ['Mom', 'Dad'])];
}

const PT_TIME = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', hour: 'numeric', minute: '2-digit' });
export const fmtTime = (iso) => {
  const parts = PT_TIME.formatToParts(new Date(iso));
  const get = (t) => (parts.find((p) => p.type === t) || {}).value || '';
  return `${get('hour')}:${get('minute')}<small>${get('dayPeriod').toLowerCase()}</small>`;
};

export function tripDay(now) {
  const pt = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
  const y = pt.getFullYear(), mo = pt.getMonth() + 1, d = pt.getDate();
  if (y === 2026 && mo === 10 && d >= 9 && d <= 11) return ['fri', 'sat', 'sun'][d - 9];
  return null;
}

export const rerender = () => window.dispatchEvent(new HashChangeEvent('hashchange'));
