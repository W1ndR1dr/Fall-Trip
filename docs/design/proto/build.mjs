// Builds index.html: five screens x (light, dark) from the app's real content.
// Run: node build.mjs
import fs from 'fs';
import { days, sun, weather, DEPART, menu, colorReport } from '/home/user/Fall-Trip/src/js/content/trip.js';
import { hunt } from '/home/user/Fall-Trip/src/js/content/kids.js';
import { daily, moments } from '/home/user/Fall-Trip/src/js/content/devotions.js';
import { passages } from '/home/user/Fall-Trip/src/js/content/scripture.js';
import { conditions } from '/home/user/Fall-Trip/src/js/content/conditions.js';
import { topoSVG, splinePath, loadTopo } from './lib/topo.mjs';
import { artFor } from './lib/art.mjs';

const ROOT = new URL('.', import.meta.url).pathname;
const PH = ROOT + 'node_modules/@phosphor-icons/core/assets/';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ---------- icons (Phosphor, inlined) ----------
const iconCache = {};
function icon(name, cls = '', weight = 'regular') {
  const key = name + weight;
  if (!iconCache[key]) {
    const file = weight === 'regular' ? `${PH}regular/${name}.svg` : `${PH}${weight}/${name}-${weight}.svg`;
    iconCache[key] = fs.readFileSync(file, 'utf8').replace('<svg ', '<svg class="i CLS" aria-hidden="true" ');
  }
  return iconCache[key].replace('CLS', cls);
}

// ---------- time helpers ----------
const PT = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', hour: 'numeric', minute: '2-digit' });
function hm(iso) {
  const p = PT.formatToParts(new Date(iso));
  const g = (t) => (p.find((x) => x.type === t) || {}).value || '';
  return { t: `${g('hour')}:${g('minute')}`, ap: g('dayPeriod').toLowerCase() };
}
const KIDS = ['Kid 1', 'Kid 2', 'Kid 3']; // names are entered on-device; these are the app's placeholders

// ---------- chrome ----------
function statusBar(time, { bars = 4, wifi = true } = {}) {
  const b = [4, 6.5, 9, 11.5].map((h, i) => `<rect x="${i * 4.5}" y="${11.5 - h}" width="3" height="${h}" rx="0.8" fill="currentColor" opacity="${i < bars ? 1 : 0.28}"/>`).join('');
  const w = wifi ? `<svg width="15.5" height="11" viewBox="0 0 15.5 11"><path d="M7.75 2.2c2.2 0 4.2.85 5.7 2.25l1.1-1.12A9.6 9.6 0 0 0 7.75.6 9.6 9.6 0 0 0 .95 3.33l1.1 1.12A8.1 8.1 0 0 1 7.75 2.2Zm0 3.2c1.33 0 2.54.5 3.46 1.33l1.1-1.12a6.5 6.5 0 0 0-9.12 0l1.1 1.12A5 5 0 0 1 7.75 5.4Zm0 3.2c.46 0 .88.16 1.2.44L7.75 10.3 6.55 9.04c.32-.28.74-.44 1.2-.44Z" fill="currentColor"/></svg>` : '';
  return `<div class="status"><span class="time">${time}</span><span class="glyphs">
    <svg width="17" height="12" viewBox="0 0 17 12">${b}</svg>${w}
    <svg width="27" height="13" viewBox="0 0 27 13"><rect x=".5" y=".5" width="23" height="12" rx="3.6" fill="none" stroke="currentColor" opacity=".38"/><rect x="2" y="2" width="17.5" height="9" rx="2.2" fill="currentColor"/><path d="M25 4.4v4.2c.8-.3 1.4-1.1 1.4-2.1s-.6-1.8-1.4-2.1Z" fill="currentColor" opacity=".45"/></svg>
  </span></div>`;
}

const TABS = [['Today', 'sun-horizon'], ['Plan', 'calendar-dots'], ['Activities', 'compass'], ['Kids', 'leaf'], ['Devotions', 'book-open-text']];
function tabBar(active) {
  return `<nav class="tabbar" aria-label="Sections">${TABS.map(([l, ic]) => {
    const on = l === active;
    return `<a class="tab ${on ? 'on' : ''}" ${on ? 'aria-current="page"' : ''}>${on ? '<span class="pill"></span>' : ''}${icon(ic, 's24', on ? 'fill' : 'regular')}<span>${l}</span></a>`;
  }).join('')}</nav><div class="home-ind"></div>`;
}

function screen(id, theme, { sky = '', body, tab, time, status = {}, overlay = '' }) {
  return `<div class="screen ${theme}" id="${id}-${theme}" data-frame="${id}-${theme}">
    <div class="sky" style="background:${sky}"></div>
    <div class="content">${body}</div>
    ${overlay}
    ${statusBar(time, status)}
    ${tabBar(tab)}
    <div class="grain"></div>
  </div>`;
}

// Leaf mark for the wordmark (a small aspen leaf, drawn to match the hunt art)
const leafMark = `<svg viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="lm" x1="0" y1="1" x2=".5" y2="0"><stop offset="0" stop-color="#F08A2E"/><stop offset="1" stop-color="#FFC857"/></linearGradient></defs><path d="M12 2.6c4.9 3.3 7.2 7 6.6 10.6-.5 3.1-3.2 5.1-6.6 5.1s-6.1-2-6.6-5.1C4.8 9.6 7.1 5.9 12 2.6Z" fill="url(#lm)"/><path d="M12 6v12.3M12 9.6l-2.7 2.1M12 9.6l2.7 2.1M12 12.8l-3.4 2.3M12 12.8l3.4 2.3" stroke="#FFF1C9" stroke-width=".9" stroke-linecap="round" opacity=".8" fill="none"/><path d="M12 18.3c0 1.3-.3 2.3-1 3.1" stroke="#C9731F" stroke-width="1.3" fill="none" stroke-linecap="round"/></svg>`;

// ==========================================================================
// 1. TODAY — before (Sun Sep 27, 9:41 am)
// ==========================================================================
const NOW_BEFORE = new Date('2026-09-27T09:41:00-07:00');
function countdown() {
  const ms = new Date(DEPART) - NOW_BEFORE;
  return { d: Math.floor(ms / 864e5), h: Math.floor((ms % 864e5) / 36e5), m: Math.floor((ms % 36e5) / 6e4) };
}

// North-up <-> east-up helpers for the route map (route.json is east-up).
const ROUTE_FRI = ['bayarea', 'oakdale', 'groveland', 'craneflat', 'olmsted', 'tenaya', 'tuolumne', 'tioga', 'leevining'];
function friRoutePts() {
  const T = loadTopo('route');
  const pts = ROUTE_FRI.map((k) => T.stops[k]);
  // US-395 south from Lee Vining: June Lake Junction and the CA-203 turnoff,
  // projected from lat/lon with the file's bounds (east-up: y = east->west).
  const proj = (lat, lon) => { const b = T.bounds; return [((b.north - lat) / (b.north - b.south)) * T.width, ((b.east - lon) / (b.east - b.west)) * T.height]; };
  pts.push(proj(37.807, -119.071), proj(37.655, -118.935), T.stops.mammoth);
  return pts;
}

function routeStage(theme) {
  const T = loadTopo('route');
  const view = [0, 52, 420, 377];
  const W = 390, H = 350, s = W / view[2];
  const P = (k) => { const [x, y] = T.stops[k]; return [(x - view[0]) * s, (y - view[1]) * s]; };
  const d = splinePath(friRoutePts(), 0.5);
  const dark = theme === 'dark';
  const overlay = `
    <defs>
      <filter id="rglow-${theme}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3.2"/></filter>
      <linearGradient id="rgrad-${theme}" x1="0" y1="1" x2="0" y2="0" gradientUnits="objectBoundingBox">
        <stop offset="0" stop-color="${dark ? '#FF7A3A' : '#C2410C'}"/><stop offset="1" stop-color="${dark ? '#FFD27A' : '#C0620A'}"/></linearGradient>
    </defs>
    <path d="${d}" fill="none" stroke="${dark ? 'rgba(10,6,3,.85)' : 'rgba(255,255,255,.95)'}" stroke-width="${dark ? 6.5 : 7}" stroke-linecap="round" stroke-linejoin="round"/>
    ${dark ? `<path d="${d}" fill="none" stroke="#FF9A40" stroke-width="6" stroke-linecap="round" opacity=".55" filter="url(#rglow-${theme})"/>` : ''}
    <path d="${d}" fill="none" stroke="url(#rgrad-${theme})" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
  const svg = topoSVG({ name: 'route', theme, view, width: W, height: H, id: 'rt' + theme, overlay });

  // HTML labels (crisp, same type system as the UI)
  const fri = days[0].items;
  const at = (title) => hm(fri.find((i) => i.title.startsWith(title)).t);
  const dot = (k, big) => { const [x, y] = P(k); return `<i class="sdot ${big ? 'big' : ''}" style="left:${x.toFixed(1)}px;top:${y.toFixed(1)}px"></i>`; };
  const lab = (k, html, side = 'r', dy = 0) => { const [x, y] = P(k); return `<div class="slab ${side}" style="${side === 'r' ? `left:${(x + 10).toFixed(1)}px` : `right:${(W - x + 10).toFixed(1)}px`};top:${(y - 8 + dy).toFixed(1)}px">${html}</div>`; };
  const mammoth = at('Mammoth'), tioga = at('Tioga Pass'), lv = at('Lee Vining'), ten = at('Tenaya'), olm = at('Olmsted');
  const [mlx, mly] = P('monolake');
  const labels = `
    ${['tuolumne', 'craneflat'].map((k) => dot(k)).join('')}
    ${dot('tenaya')}${dot('olmsted')}${dot('leevining')}${dot('tioga', true)}${dot('mammoth', true)}
    ${lab('mammoth', `<b>Mammoth Lakes</b><span>${mammoth.t} ${mammoth.ap}</span>`, 'r', -2)}
    ${lab('leevining', `<b>Lee Vining</b><span>${lv.t} ${lv.ap}</span>`, 'l')}
    ${lab('tioga', `<b>Tioga Pass</b><span><em>9,945 ft</em> · ${tioga.t} ${tioga.ap}</span>`, 'r', 2)}
    ${lab('tenaya', `<b>Tenaya Lake</b><span>${ten.t} ${ten.ap}</span>`, 'l', -8)}
    ${lab('olmsted', `<b>Olmsted Point</b><span>${olm.t} ${olm.ap}</span>`, 'r', 2)}
    <div class="wlab" style="left:${(mlx - 44).toFixed(1)}px;top:${(mly - 16).toFixed(1)}px">Mono Lake</div>`;
  return { svg, labels };
}

function todayBefore(theme) {
  const { d, h, m } = countdown();
  const { svg, labels } = routeStage(theme);
  const tiles = [
    ['calendar-dots', 'Plan', 'Hour by hour'],
    ['compass', 'Activities', 'Optional ideas'],
    ['leaf', 'Leaf hunt', `${hunt.filter((x) => !x.bonus).length} things to find`],
    ['book-open-text', 'Devotions', 'Five minutes each'],
    ['tree', 'Color report', 'Where it’s peaking'],
    ['backpack', 'Packing', 'For 20° mornings'],
    ['list-checks', 'Before you go', 'Roads and weather'],
  ];
  const body = `
    <div class="topbar"><div class="wordmark">${leafMark}Fall Trip</div><div class="gear glass">${icon('gear-six', 's22')}</div></div>
    <section class="count" aria-label="Countdown">
      <div class="eyebrow">Eastern Sierra · Oct 9–11</div>
      <div class="figure" role="timer" aria-label="${d} days, ${h} hours, ${m} minutes until we leave">
        <div class="big">${d}</div>
        <div class="stack"><div class="days">days</div><div class="hm"><b>${h}</b> hr <b>${m}</b> min</div></div>
      </div>
      <div class="until">until we leave, <b>Friday at noon</b></div>
    </section>
    <section class="stage" aria-label="The drive">
      <div class="mapwrap">${svg}<div class="labels">${labels}</div></div>
      <div class="head"><h2>The drive</h2><span>Friday · about 8 hours</span></div>
      <div class="chapter glass">
        <div class="k"><span class="eyebrow acc">Friday · noon to 8 pm</span><span class="ticks">${Array.from({ length: 8 }, (_, i) => `<i class="${i === 0 ? 'on' : ''}"></i>`).join('')}</span></div>
        <h3>Bay Area to Mammoth Lakes</h3>
        <p>Orchards and goats in the valley, Tioga’s granite in golden hour, then over the pass.</p>
        <span class="go">${icon('arrow-down', 's18', 'bold')}</span>
      </div>
    </section>
    <nav class="rail" aria-label="Sections">${tiles.map(([ic, t, s]) => `<a class="tile card"><span class="ic">${icon(ic, 's18', 'bold')}</span><span><b>${t}</b><span>${s}</span></span></a>`).join('')}</nav>`;
  const sky = theme === 'dark'
    ? 'radial-gradient(70% 34% at 18% 26%, rgba(255,128,44,.26), transparent 72%), radial-gradient(60% 30% at 92% 4%, rgba(255,170,90,.10), transparent 70%), linear-gradient(180deg, #1A0F08 0%, #0E0A07 62%)'
    : 'radial-gradient(70% 32% at 16% 26%, rgba(255,186,110,.36), transparent 72%), linear-gradient(180deg, #F2E4D3 0%, #FAF6F0 58%)';
  return screen('today-before', theme, { sky, body, tab: 'Today', time: '9:41' });
}

// ==========================================================================
// 2. TODAY — during (Sat Oct 10, 9:30 am)
// ==========================================================================
const NOW_DURING = new Date('2026-10-10T09:30:00-07:00');
function sunArc(theme, s) {
  const W = 326, H = 80, h0 = 5, h1 = 21.5;
  const toH = (str, pm) => { const [a, b] = str.split(':').map(Number); return (pm && a < 12 ? a + 12 : a) + b / 60; };
  const rise = toH(s.sunrise), set = toH(s.sunset, true), dark = toH(s.dark, true);
  const gam = toH(s.goldenAM.split('–')[1]), gpm = toH(s.goldenPM.split('–')[0], true);
  const now = 9.5, hy = 58, A = 48;
  const X = (hh) => ((hh - h0) / (h1 - h0)) * W;
  const Y = (hh) => { const v = Math.sin((Math.PI * (hh - rise)) / (set - rise)); return hy - (v > 0 ? A * v : 22 * v); };
  const seg = (a, b) => { let d = ''; for (let t = a; t <= b + 1e-6; t += 0.05) d += (d ? 'L' : 'M') + X(t).toFixed(1) + ' ' + Y(t).toFixed(1); return d; };
  const dk = theme === 'dark';
  const C = { night: dk ? '#A9B1FF' : '#4A50C4', gold: dk ? '#FFC062' : '#C9700E', ember: dk ? '#FF7F4A' : '#C2410C', day: dk ? 'rgba(255,226,196,.38)' : 'rgba(70,40,15,.30)' };
  const sx = X(now), sy = Y(now);
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true">
    <defs>
      <radialGradient id="sun-${theme}"><stop offset="0" stop-color="${dk ? '#FFE3A8' : '#FFD27A'}"/><stop offset=".35" stop-color="${dk ? '#FFB44F' : '#F29A2E'}" stop-opacity=".55"/><stop offset="1" stop-color="#FFB44F" stop-opacity="0"/></radialGradient>
      <linearGradient id="dayfill-${theme}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${dk ? 'rgba(255,180,90,.16)' : 'rgba(242,154,46,.16)'}"/><stop offset="1" stop-color="${dk ? 'rgba(255,180,90,0)' : 'rgba(242,154,46,0)'}"/></linearGradient>
      <clipPath id="past-${theme}"><rect x="0" y="0" width="${sx}" height="${H}"/></clipPath>
    </defs>
    <path d="${seg(rise, set)}L${X(set)} ${hy}L${X(rise)} ${hy}Z" fill="url(#dayfill-${theme})"/>
    <line x1="0" x2="${W}" y1="${hy}" y2="${hy}" stroke="${dk ? 'rgba(255,226,196,.16)' : 'rgba(70,40,15,.16)'}"/>
    <path d="${seg(h0, rise)}" stroke="${C.night}" stroke-width="1.6" fill="none" stroke-dasharray="1.5 3.5" stroke-linecap="round" opacity=".7"/>
    <path d="${seg(dark, h1)}" stroke="${C.night}" stroke-width="1.6" fill="none" stroke-dasharray="1.5 3.5" stroke-linecap="round" opacity=".7"/>
    <path d="${seg(set, dark)}" stroke="${C.ember}" stroke-width="1.8" fill="none" stroke-dasharray="1.5 3.5" stroke-linecap="round"/>
    <path d="${seg(gam, gpm)}" stroke="${C.day}" stroke-width="1.6" fill="none"/>
    <path d="${seg(rise, gam)}" stroke="${C.gold}" stroke-width="3.2" fill="none" stroke-linecap="round"/>
    <path d="${seg(gpm, set)}" stroke="${C.ember}" stroke-width="3.2" fill="none" stroke-linecap="round"/>
    <path d="${seg(rise, now)}" stroke="${C.gold}" stroke-width="1.8" fill="none" opacity=".9" clip-path="url(#past-${theme})"/>
    <line x1="${sx}" x2="${sx}" y1="${sy + 9}" y2="${hy}" stroke="${C.gold}" stroke-width="1" stroke-dasharray="2 2.5" opacity=".7"/>
    <circle cx="${sx}" cy="${sy}" r="17" fill="url(#sun-${theme})"/>
    <circle cx="${sx}" cy="${sy}" r="5.5" fill="${dk ? '#FFE0A0' : '#F7A93A'}" stroke="${dk ? '#FFF4DD' : '#FFFFFF'}" stroke-width="1.5"/>
    <text x="${sx + 12}" y="${sy + 4}" class="arcnow">Now</text>
    ${[rise, set, dark].map((t) => `<circle cx="${X(t)}" cy="${Y(t)}" r="2.6" fill="var(--bg-2)" stroke="${t === dark ? C.night : t === set ? C.ember : C.gold}" stroke-width="1.6"/>`).join('')}
  </svg>`;
}

function todayDuring(theme) {
  const sat = days.find((d) => d.id === 'sat');
  const s = sun.sat;
  const items = sat.items;
  const idx = items.findIndex((i) => new Date(i.t) > NOW_DURING);
  const cur = items[idx - 1], next = items.slice(idx, idx + 2);
  const t0 = hm(cur.t);
  const dv = daily.find((d) => d.id === 'sat');
  const lundy = menu.find((m) => m.id === 'lundy');
  // Leave-by = next start (11:00) minus its drive ("~10 min").
  const leaveBy = '10:50';
  const elapsed = (NOW_DURING - new Date(cur.t)) / 6e4, total = 95;
  const w = weather.places.find((p) => p.name === 'Lee Vining');
  const tiogaOpen = /Open/.test(conditions.tioga);
  const body = `
    <header class="dayhead">
      <div><div class="eyebrow acc">Saturday, Oct 10 · Day 2 of 3</div><h1 class="large-title">${esc(sat.title)}</h1></div>
      <div class="gear glass" style="margin-top:2px">${icon('gear-six', 's22')}</div>
    </header>
    <div class="condline pad" aria-label="Conditions"><span>${icon('thermometer-simple')}<b class="num">${w.hi}° / ${w.lo}°</b> normal</span><span>${icon('road-horizon')}Tioga Rd <b class="ok">${tiogaOpen ? 'open' : 'check'}</b></span><span>${icon('moon-stars')}<b>New Moon</b></span></div>
    <article class="nowcard card">
      <div class="nowrow"><span class="live"><i></i>Now</span><span class="foot num">Since ${t0.t}</span></div>
      <div class="nowtitle"><div><h2>${esc(cur.title)}</h2>
      <p class="foot" style="color:var(--text-2)">${esc(lundy.walk.replace('~', '').replace(' RT', ''))} · No restrooms at trailhead</p></div><span class="map-mini lg" aria-label="Open in Maps">${icon('navigation-arrow', 's18', 'fill')}</span></div>
      <div class="progress"><div class="bar"><i style="width:${Math.round((elapsed / total) * 100)}%"></i></div>
        <div class="lbl"><span>${t0.t}</span><span><b>Leave by ${leaveBy}</b> for Conway Summit</span></div></div>
      <a class="dev-link"><span class="ic">${icon('book-open-text', 's18', 'bold')}</span><span><span class="t">${esc(dv.title)}</span><span class="d">Devotion here · ${KIDS[1]} reads</span></span><span class="chev">${icon('caret-right', 's16', 'bold')}</span></a>
    </article>
    <div class="sect"><h3>Next</h3><a>Saturday plan ${icon('caret-right', 's16', 'bold')}</a></div>
    <div class="nextlist card">${next.map((n) => {
      const x = hm(n.t);
      const [title, kick] = n.title.split(': ');
      return `<div class="nx"><span class="tm num">${x.t}<small>${x.ap}</small></span><span><span class="tt">${esc(title)}</span><span class="dd">${icon('car-simple')}${esc((n.drive || '').replace('~', ''))} drive${kick ? ` · ${esc(kick[0].toUpperCase() + kick.slice(1))}` : ''}</span></span>${n.maps ? `<span class="map-mini">${icon('navigation-arrow', 's16', 'fill')}</span>` : '<span></span>'}</div>`;
    }).join('')}</div>
    <div class="suncard card">
      <div class="sunhead"><span class="eyebrow">Sun</span><span class="foot">Sunset in <b>8 hr 55 min</b></span></div>
      ${sunArc(theme, s)}
      <div class="sunleg">
        <div><span><i style="background:var(--accent)"></i>Sunrise</span><b class="num">${s.sunrise}<small>am</small></b></div>
        <div><span><i style="background:var(--accent-2)"></i>Golden</span><b class="num">${s.goldenPM.split('–')[0]}<small>pm</small></b></div>
        <div><span><i style="background:var(--accent-2)"></i>Sunset</span><b class="num">${s.sunset}<small>pm</small></b></div>
        <div><span><i style="background:var(--night)"></i>Dark</span><b class="num">${s.dark}<small>pm</small></b></div>
      </div>
    </div>`;
  const sky = theme === 'dark'
    ? 'radial-gradient(80% 36% at 85% 0%, rgba(255,176,80,.20), transparent 70%), linear-gradient(180deg, #1A120A 0%, #0E0A07 50%)'
    : 'radial-gradient(80% 34% at 85% 0%, rgba(255,205,130,.42), transparent 70%), linear-gradient(180deg, #F3E9DC 0%, #FAF6F0 50%)';
  return screen('today-during', theme, { sky, body, tab: 'Today', time: '9:30', status: { bars: 1, wifi: false } });
}

// ==========================================================================
// 3. PLAN — Saturday (auto-scrolled to "now", 9:30 am)
// ==========================================================================
function planSat(theme) {
  const sat = days.find((d) => d.id === 'sat');
  const items = sat.items;
  const nowIdx = items.findIndex((i) => new Date(i.t) > NOW_DURING) - 1;
  const past = items.slice(0, nowIdx);
  const shown = items.slice(nowIdx, 7);
  const notes = {
    // First sentences of each item's `text` (full text opens on tap).
    'Lundy beaver ponds': 'The first pond is about 0.25 mi in; beaver dams and chewed aspen stumps within about 1 mile.',
    'Conway Summit overlook: cocoa stop': 'The classic view of aspens sweeping down toward Mono Lake. Pour the cocoa.',
    'Lunch in Lee Vining': 'Basin Café (Sat 7–8:45) or a picnic from Mono Market.',
    'South Tufa, Mono Lake': 'A flat, 1-mile walk among tufa towers. $3 per adult; kids free.',
  };
  const leg = (it) => it.drive ? `<div class="leg"><span>${esc(it.drive.replace('~', '').replace(/ from .*/, ''))}</span><i class="car">${icon('car-simple', '', 'fill')}</i></div>` : '<div class="leg gap"></div>';
  const row = (it, i) => {
    const x = hm(it.t);
    const now = i === 0;
    const [title, kick] = it.title.includes(': ') ? it.title.split(': ') : [it.title, ''];
    const cls = ['ti', it.anchor ? 'fixed' : '', now ? 'now' : ''].join(' ');
    const when = `<div class="when"><b class="num">${x.t}</b><small>${x.ap}${it.stay && !now ? `<br>${esc(it.stay)}` : ''}</small></div><span class="node"></span>`;
    if (now) {
      const dv = daily.find((d) => d.id === 'sat');
      return `<div class="${cls}">${when}<div class="nowbox">
        <div class="row-t"><div class="tags"><span class="tag now">Now</span><span class="tag fx">Fixed</span></div><span class="foot num">${esc(it.stay)}</span></div>
        <h4>${esc(title)}</h4>
        <p>${esc(notes[it.title])}</p>
        <div class="btns"><a class="btn primary">${icon('navigation-arrow', '', 'fill')}Maps</a><a class="btn">${icon('book-open-text')}Devotion</a><a class="btn icon-only" aria-label="More">${icon('dots-three', '', 'bold')}</a></div>
      </div></div>`;
    }
    if (it.kind === 'choice') {
      return `${leg(it)}<div class="${cls}">${when}<div>
        <h4>Choose: festival or quiet time</h4>
        <div class="choice">
          <div class="opt"><span class="q">Energy left?</span><b>Leaves in the Loop festival</b></div>
          <div class="opt"><span class="q">Running on fumes?</span><b>Quiet time at home</b></div>
          <span class="orb">or</span>
        </div>
      </div></div>`;
    }
    return `${leg(it)}<div class="${cls}">${when}<div>
      ${it.maps ? `<span class="mapbtn fl" aria-label="Open in Maps">${icon('navigation-arrow', 's16', 'fill')}</span>` : ''}${kick ? `<span class="kick">${esc(kick[0].toUpperCase() + kick.slice(1))}</span>` : ''}<h4>${esc(title)}</h4>
      <p>${esc(notes[it.title] || it.text)}</p></div></div>`;
  };
  const earlier = `<div class="earlier"><span class="ok-dot">${icon('check', 's16', 'bold')}</span><span><b>${past.length} earlier</b> · ${past.map((p) => hm(p.t).t).join(' and ')}</span>${icon('caret-down', 's16', 'bold')}</div>`;
  const nav = `<header class="navbar">
      <div class="row1"><span class="side"><span class="navttl">Plan</span></span><div class="seg" role="group" aria-label="Day"><span>Fri 9</span><span class="on">Sat 10</span><span>Sun 11</span></div><span class="side r"><span class="gear glass sm">${icon('dots-three', 's18', 'bold')}</span></span></div>
    </header>`;
  const body = `<div style="height:60px"></div>${earlier}<div class="tl">${shown.map(row).join('')}</div>`;
  const sky = theme === 'dark' ? 'radial-gradient(90% 30% at 50% 0%, rgba(255,150,60,.10), transparent 70%)' : 'linear-gradient(180deg, #F4EBDF 0%, #FAF6F0 40%)';
  return screen('plan-sat', theme, { sky, body, tab: 'Plan', time: '9:30', status: { bars: 1, wifi: false }, overlay: nav });
}

// ==========================================================================
// 4. KIDS — leaf hunt
// ==========================================================================
const FOUND = { 0: ['aspen', 'cottonwood', 'willow', 'cone', 'granite', 'dam', 'eyes'], 1: ['aspen', 'cone', 'granite', 'heart'], 2: [] };
function kidsHunt(theme) {
  const who = 0;
  const found = new Set(FOUND[who]);
  const core = hunt.filter((h) => !h.bonus);
  const nCore = core.filter((h) => found.has(h.id)).length;
  const nBonus = hunt.filter((h) => h.bonus && found.has(h.id)).length;
  const counts = [0, 1, 2].map((k) => core.filter((h) => FOUND[k].includes(h.id)).length);
  const pip = (on) => `<svg viewBox="0 0 13 17" aria-hidden="true"><path d="M6.5 1C10 3.6 11.7 6.5 11.2 9.3c-.4 2.4-2.3 3.9-4.7 3.9S2.2 11.7 1.8 9.3C1.3 6.5 3 3.6 6.5 1Z" fill="${on ? 'var(--accent-mark)' : 'none'}" stroke="${on ? 'var(--accent-mark)' : 'var(--text-3)'}" stroke-width="1.1" opacity="${on ? 1 : 0.6}"/><path d="M6.5 13.2v2.6" stroke="${on ? 'var(--accent-mark)' : 'var(--text-3)'}" stroke-width="1.1" stroke-linecap="round" opacity="${on ? 1 : 0.6}"/></svg>`;
  // Short tile labels for 6- and 7-year-olds; the full name and hint open on tap.
  const shortName = { aspen: 'Aspen leaf', cottonwood: 'Cottonwood leaf', willow: 'Willow leaf', birch: 'Birch leaf', red: 'A red leaf', big: 'The biggest leaf', heart: 'Heart-shaped leaf', cone: 'A pinecone', granite: 'Granite sparkle', dam: 'Beaver dam', tufa: 'Tufa tower', eyes: 'Aspen “eyes”', track: 'Animal track', obsidian: 'Obsidian' };
  const tiles = hunt.map((h) => {
    const on = found.has(h.id);
    return `<button class="spec-tile ${on ? 'found' : ''}" aria-pressed="${on}">
      ${h.bonus ? '<span class="bonus">Bonus</span>' : ''}${on ? `<span class="ck">${icon('check', 's16', 'bold')}</span>` : ''}
      <svg class="art" viewBox="0 0 96 96" aria-hidden="true">${artFor(h.id, theme)}</svg>
      <b>${esc(shortName[h.id] || h.name)}</b></button>`;
  }).join('');
  const body = `
    <div class="topbar" style="padding-left:10px"><a class="backbtn glass">${icon('caret-left', 's18', 'bold')}Kids</a><span class="gear glass">${icon('lightbulb', 's22')}</span></div>
    <header class="kids-head"><h1 class="large-title">Leaf hunt</h1><p class="body">Tap a picture when you find it.</p></header>
    <div class="kidseg" role="tablist" aria-label="Whose list">${KIDS.map((k, i) => `<div class="kid ${i === who ? 'on' : ''}" role="tab" aria-selected="${i === who}"><span class="av" style="background:var(--kid-${i + 1})">${i + 1}</span><span><b>${k}</b><span>${counts[i]} found</span></span></div>`).join('')}</div>
    <div class="huntprog card" role="progressbar" aria-valuemin="0" aria-valuemax="${core.length}" aria-valuenow="${nCore}" aria-label="${KIDS[who]} found ${nCore} of ${core.length}"><span class="n num">${nCore}</span><span class="lab">of ${core.length} found<span>+${nBonus} bonus</span></span><span class="pips" aria-hidden="true">${core.map((h, i) => pip(i < nCore)).join('')}</span></div>
    <div class="grid">${tiles}</div>`;
  const sky = theme === 'dark' ? 'radial-gradient(80% 30% at 20% 0%, rgba(255,170,60,.13), transparent 70%)' : 'radial-gradient(80% 30% at 20% 0%, rgba(255,200,120,.30), transparent 70%), linear-gradient(180deg, #F5EBDD, #FAF6F0 40%)';
  return screen('kids-hunt', theme, { sky, body, tab: 'Kids', time: '9:30', status: { bars: 1, wifi: false } });
}

// ==========================================================================
// 5. DEVOTION — Saturday
// ==========================================================================
function devotionSat(theme) {
  const dv = daily.find((d) => d.id === 'sat');
  const ref = dv.read[0];
  const p = passages[ref];
  // Verse numbers: v.12 begins "The earth brought forth" (ESV) / "The land produced" (NIV).
  const text = p.esv.replace('The earth brought forth', '<sup>12</sup>The earth brought forth');
  const order = [...daily, ...moments].map((d) => d.id);
  const i = order.indexOf(dv.id);
  const reader = KIDS[i % 3], prayer = KIDS[(i + 1) % 3];
  const body = `
    <div class="topbar" style="padding-left:10px"><a class="backbtn glass">${icon('caret-left', 's18', 'bold')}Devotions</a>
      <span style="display:flex;gap:8px"><span class="gear glass">${icon('text-aa', 's22')}</span><span class="gear glass">${icon('check', 's22', 'bold')}</span></span></div>
    <header class="dev-head"><div class="eyebrow acc">Saturday · In the first aspen grove</div><h1>${esc(dv.title)}</h1></header>
    <div class="turns"><span class="turn cur"><span class="av" style="background:var(--kid-2)">2</span><span><b>${reader}</b> reads</span></span><span class="turn"><span class="av" style="background:var(--kid-3)">3</span><span><b>${prayer}</b> prays</span></span><span class="swap" aria-label="Switch turns">${icon('arrows-clockwise', 's18')}</span></div>
    <div class="steps" role="tablist" aria-label="Parts"><span class="done">Look</span><span class="on">Read</span><span>Wonder</span><span>Pray</span><span>Do</span></div>
    <div class="donerow"><span class="ok-dot">${icon('check', 's16', 'bold')}</span><span><b>Look</b><span>${esc(dv.look.split('. ')[0].replace(/ \(.*\)/, ''))}.</span></span>${icon('caret-down', 's16', 'bold')}</div>
    <div class="passage card">
      <div class="phead"><h3>${icon('book-open-text', 's16', 'bold')}Read</h3><div class="seg sm" role="group" aria-label="Translation"><span class="on">ESV</span><span>NIV</span></div></div>
      <blockquote><sup>11</sup>${text}</blockquote>
      <div class="ref"><b>${esc(ref)} <span>· ESV</span></b><a class="yv">Open in YouVersion ${icon('arrow-up-right', 's16', 'bold')}</a></div>
      <p class="copy">ESV® Bible © 2001 by Crossway. Used by permission. All rights reserved.</p>
    </div>`;
  const sky = theme === 'dark' ? 'radial-gradient(90% 34% at 50% 0%, rgba(255,150,60,.12), transparent 70%)' : 'radial-gradient(90% 34% at 50% 0%, rgba(255,205,140,.32), transparent 70%), linear-gradient(180deg,#F5EBDF,#FAF6F0 40%)';
  return screen('devotion-sat', theme, { sky, body, tab: 'Devotions', time: '9:30', status: { bars: 1, wifi: false } });
}

// ==========================================================================
const SCREENS = [['today-before', todayBefore, 'Today · before the trip (Sun Sep 27, 9:41)'], ['today-during', todayDuring, 'Today · during (Sat Oct 10, 9:30)'], ['plan-sat', planSat, 'Plan · Saturday'], ['kids-hunt', kidsHunt, 'Kids · Leaf hunt'], ['devotion-sat', devotionSat, 'Devotions · Saturday']];
const only = process.argv[2];
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>Golden Hour — Fall Trip prototype</title>
<link rel="stylesheet" href="styles.css"><link rel="stylesheet" href="extra.css">
<script>
  // index.html#frame=<id>-<theme> shows one frame alone at 390x844 (used for screenshots).
  const solo = location.hash.match(/frame=([a-z-]+)/);
  if (solo) { document.documentElement.classList.add('solo'); addEventListener('DOMContentLoaded', () => document.body.replaceChildren(document.querySelector('[data-frame="' + solo[1] + '"]'))); }
</script></head>
<body class="board"><h1>Golden Hour</h1><p class="lede">Dark-first cinematic warmth for the Fall Trip PWA. Light arrives as amber and ember, like a sun low on the horizon; light mode is the crisp early-morning version. Five screens, light and dark, built from the app’s real content and real Sierra topography.</p>
${['light', 'dark'].map((th) => `<div class="row">${SCREENS.filter(([id]) => !only || id === only).map(([id, fn, cap]) => `<div class="frame"><div class="cap">${cap} · ${th}</div>${fn(th)}</div>`).join('')}</div>`).join('')}
</body></html>`;
fs.writeFileSync(ROOT + 'index.html', html);
console.log('wrote index.html', (html.length / 1e6).toFixed(2) + 'MB');
