// Builds index.html: 5 screens x (light, dark) from the real trip content.
import { readFileSync, writeFileSync } from 'node:fs';
import { days, sun, weather, DEPART } from '/home/user/Fall-Trip/src/js/content/trip.js';
import { hunt } from '/home/user/Fall-Trip/src/js/content/kids.js';
import { daily } from '/home/user/Fall-Trip/src/js/content/devotions.js';
import { passages } from '/home/user/Fall-Trip/src/js/content/scripture.js';
import { conditions } from '/home/user/Fall-Trip/src/js/content/conditions.js';
import { buildArt } from './art.mjs';

const ROOT = new URL('.', import.meta.url).pathname;
const route = JSON.parse(readFileSync('/home/user/Fall-Trip/public/img/topo/route.json', 'utf8'));
const east = JSON.parse(readFileSync('/home/user/Fall-Trip/public/img/topo/eastside.json', 'utf8'));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const f = (n) => (Math.round(n * 10) / 10).toString();

// ------------------------------------------------------------------ icons
const icoCache = new Map();
function icon(name, weight = 'regular', cls = '') {
  const key = name + weight;
  if (!icoCache.has(key)) {
    const file = `${ROOT}node_modules/@phosphor-icons/core/assets/${weight}/${name}${weight === 'regular' ? '' : '-' + weight}.svg`;
    icoCache.set(key, readFileSync(file, 'utf8').replace(/<svg[^>]*>/, '').replace('</svg>', ''));
  }
  return `<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"${cls ? ` class="${cls}"` : ''}>${icoCache.get(key)}</svg>`;
}
const chev = `<svg class="chev" viewBox="0 0 14 14"><path d="M5 2.5L9.5 7L5 11.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

// ------------------------------------------------------------------ chrome
function statusBar(time, { bars = 4, wifi = true } = {}) {
  const b = [0, 1, 2, 3].map((i) => `<rect x="${i * 5}" y="${8 - i * 2.6}" width="3.2" height="${4 + i * 2.6}" rx="1" fill="currentColor" opacity="${i < bars ? 1 : 0.28}"/>`).join('');
  const w = wifi ? `<svg width="17" height="12" viewBox="0 0 17 12"><path d="M8.5 2.3c2.4 0 4.6.9 6.3 2.5l1.1-1.1A10.5 10.5 0 0 0 8.5.7 10.5 10.5 0 0 0 1.1 3.7l1.1 1.1a8.9 8.9 0 0 1 6.3-2.5Zm0 3.2c1.5 0 2.9.6 4 1.6l1.1-1.1a7.4 7.4 0 0 0-10.2 0l1.1 1.1c1.1-1 2.5-1.6 4-1.6Zm0 3.2c.7 0 1.3.3 1.8.7L8.5 11 6.7 9.4c.5-.4 1.1-.7 1.8-.7Z" fill="currentColor"/></svg>` : '';
  return `<div class="sb"><span class="t">${time}</span><span class="r"><svg width="18" height="12" viewBox="0 0 18 12">${b}</svg>${w}
    <svg width="27" height="13" viewBox="0 0 27 13"><rect x=".5" y=".5" width="23" height="12" rx="3.8" fill="none" stroke="currentColor" opacity=".35"/><rect x="2" y="2" width="${bars < 2 ? 13 : 18}" height="9" rx="2.4" fill="currentColor"/><path d="M25 4.5v4c.8-.3 1.4-1.1 1.4-2s-.6-1.7-1.4-2Z" fill="currentColor" opacity=".4"/></svg></span></div>`;
}
const TABS = [['Today', 'sun-horizon'], ['Plan', 'calendar-dots'], ['Activities', 'compass'], ['Kids', 'person-arms-spread'], ['Devotions', 'book-open-text']];
const tabBar = (on) => `<nav class="tabbar">${TABS.map(([l, i]) => `<span class="tab${l === on ? ' on' : ''}">${icon(i, l === on ? 'fill' : 'regular')}${l}</span>`).join('')}</nav><div class="home-ind"></div>`;

// ------------------------------------------------------------------ topography
const isIdxRoute = (lv) => lv > 0 && (lv - 100) % 600 === 0;
const isIdxEast = (lv) => (lv - 1900) % 300 === 0;
const topoRoute = `<g id="topo-route">${route.layers.filter((l) => l.level > 0).map((l) => `<path class="lv${isIdxRoute(l.level) ? ' i' : ''}" d="${l.d}"/>`).join('')}</g>`;
const shoreRoute = `<g id="shore-route"><path class="lv0" d="${route.layers.find((l) => l.level === 0).d}"/></g>`;
const topoEast = `<g id="topo-east">${east.layers.filter((l) => l.level > 1900).map((l) => `<path class="lv${isIdxEast(l.level) ? ' i' : ''}" d="${l.d}"/>`).join('')}</g>`;
// Mono Lake: inside the 1900 m surface, outside the 1960 m surface (lake is ~1,945 m)
const monoEast = `<g id="mono-east"><path d="${east.layers.find((l) => l.level === 1900).d}" style="fill:var(--water)"/><path d="${east.layers.find((l) => l.level === 1960).d}" style="fill:var(--map-bg)"/></g>`;
// eastside -> route coordinates (both are linear east-up projections of lat/lon)
const E2R = 'translate(22.1 27.97) scale(0.5104 0.5108)';

// Catmull-Rom path through points
function curve(pts, t = 0.5) {
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + ((p2[0] - p0[0]) * t) / 3, p1[1] + ((p2[1] - p0[1]) * t) / 3];
    const c2 = [p2[0] - ((p3[0] - p1[0]) * t) / 3, p2[1] - ((p3[1] - p1[1]) * t) / 3];
    d += `C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d;
}
const RS = route.stops, ES = east.stops;
const friRoute = curve(['bayarea', 'oakdale', 'groveland', 'craneflat', 'olmsted', 'tuolumne', 'tioga', 'leevining', 'mammoth'].map((k) => RS[k]));

// ------------------------------------------------------------------ content helpers
const PT = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', hour: 'numeric', minute: '2-digit' });
const tm = (iso) => { const [h, rest] = PT.format(new Date(iso)).split(':'); const [m, ap] = rest.split(' '); return { hm: `${h}:${m}`, ap: ap.toLowerCase() }; };
const sat = days.find((d) => d.id === 'sat');
const it = (hhmm) => sat.items.find((i) => i.t.includes(`T${hhmm}`));
const dvSat = daily.find((d) => d.id === 'sat');
const kids = ['Kid 1', 'Kid 2', 'Kid 3'];
// whose turn: same rule as the app (order of daily+moments, rotating through 3 kids)
const reader = kids[1 % 3], prayer = kids[2 % 3];

// ================================================================== SCREEN 1
let UID = 0;
function todayBefore() {
  const n = ++UID;
  // Sun Sep 27, 9:41 am -> Fri Oct 9, 12:00 pm
  const now = new Date('2026-09-27T09:41:00-07:00');
  const ms = new Date(DEPART) - now;
  const d = Math.floor(ms / 864e5), h = Math.floor((ms % 864e5) / 36e5), m = Math.floor((ms % 36e5) / 6e4);
  // map: route.json crop, scale 1.19
  const s = 1.19, x0 = 0, y0 = -22.6, W = 390, H = 520;
  const vb = `${x0} ${y0} ${W / s} ${H / s}`;
  const P = (k) => RS[k];
  const lab = (k, text, dx, dy, cls = '', anchor = 'start') => `<text class="maplabel ${cls}" x="${f(P(k)[0] + dx)}" y="${f(P(k)[1] + dy)}" text-anchor="${anchor}" style="font-size:${cls.includes('dest') ? 13 / s : cls.includes('sm') ? 10 / s : 11 / s}px;stroke-width:${3.2 / s}px">${text}</text>`;
  const dot = (k, r = 3.2, major = false) => `<circle cx="${P(k)[0]}" cy="${P(k)[1]}" r="${r / s}" fill="${major ? 'var(--ember)' : 'var(--route-case)'}" stroke="${major ? 'var(--route-case)' : 'var(--ember)'}" stroke-width="${(major ? 2.2 : 1.8) / s}"/>`;
  const satDot = (k) => `<circle cx="${P(k)[0]}" cy="${P(k)[1]}" r="${2.6 / s}" fill="var(--gold)" stroke="var(--route-case)" stroke-width="${1.4 / s}"/>`;
  const map = `<svg class="map" viewBox="${vb}" preserveAspectRatio="xMidYMin slice">
    <rect x="${x0 - 10}" y="${y0 - 10}" width="${W / s + 20}" height="${H / s + 20}" fill="var(--map-bg)"/>
    <defs><clipPath id="heroclip${n}"><rect x="3" y="3" width="400" height="600"/></clipPath>
      <radialGradient id="sunlight${n}" cx="0.92" cy="0.12" r="0.9"><stop offset="0" stop-color="var(--sunlight)" stop-opacity="var(--sunlight-a)"/><stop offset="1" stop-color="var(--sunlight)" stop-opacity="0"/></radialGradient></defs>
    <g clip-path="url(#heroclip${n})"><g transform="${E2R}"><use href="#mono-east"/></g>
    <use href="#topo-route"/></g>
    <rect x="${x0 - 10}" y="${y0 - 10}" width="${W / s + 20}" height="${H / s + 20}" fill="url(#sunlight${n})" style="mix-blend-mode:var(--sunlight-blend)"/>
    <path d="${friRoute}" fill="none" stroke="var(--route-case)" stroke-width="${6 / s}" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>
    <path d="${friRoute}" fill="none" stroke="var(--ember)" stroke-width="${2.6 / s}" stroke-linecap="round" stroke-linejoin="round"/>
    ${dot('olmsted')}${dot('tuolumne')}${dot('tioga')}${dot('leevining')}${dot('mammoth', 4.6, true)}
    ${lab('olmsted', 'Olmsted Point', -7, 4, '', 'end')}
    ${lab('tuolumne', 'Tuolumne Meadows', 7, 4)}
    <text class="maplabel" x="${f(P('tioga')[0] + 7)}" y="${f(P('tioga')[1] - 1)}" style="font-size:${11 / s}px;stroke-width:${3.2 / s}px">Tioga Pass<tspan class="maplabel sm" x="${f(P('tioga')[0] + 7)}" dy="${12 / s}" style="font-size:${10 / s}px;stroke-width:${3 / s}px">9,945 ft</tspan></text>
    ${lab('leevining', 'Lee Vining', 7, 4)}
    ${lab('mammoth', 'Mammoth Lakes', -16, 19, 'dest', 'start')}
    <text class="maplabel water" x="${f(RS.monolake[0] - 6)}" y="${f(RS.monolake[1] + 6)}" text-anchor="middle" style="font-size:${12.5 / s}px">Mono Lake</text>
  </svg>`;
  const ticks = Array.from({ length: 15 }, (_, i) => `<i class="${i === 0 ? 'today' : i >= 12 ? 'trip' : ''}"></i>`).join('');
  const Q = [
    ['Plan', 'calendar-dots', 'var(--tint)'], ['Activities', 'compass', 'var(--tint)'], ['Leaf hunt', 'leaf', 'var(--gold-ink)'], ['Devotions', 'book-open-text', 'var(--ember)'],
    ['Color report', 'tree', 'var(--gold-ink)'], ['Packing', 'backpack', 'var(--tint)'], ['Before you go', 'list-checks', 'var(--tint)', 11], ['Night sky', 'moon-stars', 'var(--ink-2)'],
  ];
  return `${statusBar('9:41')}
  <div class="hero">${map}<div class="veil"></div>
    <div class="hero-head"><div><div class="eyebrow">Sunday, September 27</div><h1 class="large">Fall Trip</h1><p class="sub">Eastern Sierra · October 9–11</p></div>
      <span class="glassbtn" style="margin-top:2px">${icon('gear-six')}</span></div>
    <span class="btn sm follow" style="background:var(--glass);-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);box-shadow:inset 0 0 0 .5px var(--glass-line),var(--shadow-1);color:var(--ink)">${icon('path', 'bold')}Follow the route</span>
    <div class="countdown">
      <div class="cd-top"><div class="cd-num"><b>${d}</b><em>days</em></div><div class="cd-hm">${h}<small>hr</small>${m}<small>min</small></div></div>
      <p class="cd-cap">until we leave, <b>Friday, Oct 9 at noon</b></p>
      <div class="days">${ticks}</div><div class="days-l"><span>Today</span><span style="color:var(--gold-ink)">Oct 9–11</span></div>
    </div>
  </div>
  <div class="quick">${Q.map(([l, ic, c, badge]) => `<span class="q"><span class="ic" style="color:${c}">${icon(ic, 'duotone')}${badge ? `<span class="badge">${badge}</span>` : ''}</span><b>${l}</b></span>`).join('')}</div>
  ${tabBar('Today')}`;
}

// ================================================================== SCREEN 2
function sunArc() {
  const n = ++UID;
  const W = 330, H = 52, hz = 40, t0 = 5, t1 = 21;
  const X = (t) => ((t - t0) / (t1 - t0)) * W;
  const rise = 7, set = 18 + 25 / 60, now = 9.5, dark = 19 + 52 / 60;
  const Y = (t) => hz - 33 * Math.sin((Math.PI * (t - rise)) / (set - rise));
  const pts = []; for (let t = t0; t <= t1 + 0.001; t += 0.1) pts.push([X(t), Math.min(hz + 9, Y(t))]);
  const line = (a, b) => 'M' + pts.filter(([x]) => x >= X(a) - 0.01 && x <= X(b) + 0.01).map(([x, y]) => `${f(x)} ${f(y)}`).join('L');
  const day = pts.filter(([x]) => x >= X(rise) && x <= X(set));
  const area = `M${f(X(rise))} ${hz}L` + day.map(([x, y]) => `${f(x)} ${f(y)}`).join('L') + `L${f(X(set))} ${hz}Z`;
  return `<svg class="arc" viewBox="0 0 ${W} ${H}" width="100%">
    <defs><linearGradient id="sunfill${n}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--gold)" stop-opacity=".22"/><stop offset="1" stop-color="var(--gold)" stop-opacity="0"/></linearGradient>
    <clipPath id="sunpast${n}"><rect x="0" y="0" width="${X(now)}" height="${H}"/></clipPath></defs>
    <path d="${area}" fill="url(#sunfill${n})" clip-path="url(#sunpast${n})"/>
    <path d="M0 ${hz}H${W}" stroke="var(--line-2)" stroke-width="1"/>
    <path d="${line(t0, t1)}" fill="none" stroke="var(--ink-3)" stroke-width="1.4" stroke-dasharray="1.5 3.5" stroke-linecap="round"/>
    <path d="${line(rise, now)}" fill="none" stroke="var(--gold-ui)" stroke-width="2.2" stroke-linecap="round"/>
    <path d="${line(set - 35 / 60, set)}" fill="none" stroke="var(--gold)" stroke-width="4" stroke-linecap="round" opacity=".55"/>
    <path d="${line(rise, rise + 34 / 60)}" fill="none" stroke="var(--gold)" stroke-width="4" stroke-linecap="round" opacity=".55"/>
    <circle cx="${f(X(dark))}" cy="${f(Math.min(hz + 9, Y(dark)))}" r="3" fill="var(--ink-2)"/>
    <circle cx="${f(X(now))}" cy="${f(Y(now))}" r="10" fill="var(--gold)" opacity=".18"/><circle cx="${f(X(now))}" cy="${f(Y(now))}" r="5.5" fill="var(--gold-ui)" stroke="var(--card)" stroke-width="2"/>
  </svg>`;
}

function todayDuring() {
  const cur = it('09:15'), n1 = it('11:00'), n2 = it('11:45');
  const s = sun.sat;
  const MH = 96, vw = 300, vh = vw * (MH / 358), vx = 0, vy = 296 - vh / 2 - 2;
  const L = ES.lundy, C = ES.conway;
  const k = vw / 358;
  const leg = curve([L, [L[0] - 16, L[1] - 8], [C[0] + 14, C[1] + 8], C]);
  const map = `<svg viewBox="${vx} ${vy} ${vw} ${f(vh)}" width="358" height="${MH}" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0">
    <rect x="0" y="0" width="520" height="527" fill="var(--map-bg)"/><use href="#mono-east"/><use href="#topo-east" style="--map-a:var(--map-a-east)"/>
    <path d="${leg}" fill="none" stroke="var(--ember)" stroke-width="${2 * k}" stroke-dasharray="${0.1 * k} ${4.5 * k}" stroke-linecap="round"/>
    <circle cx="${C[0]}" cy="${C[1]}" r="${3.4 * k}" fill="var(--route-case)" stroke="var(--ember)" stroke-width="${1.8 * k}"/>
    <text class="maplabel" x="${C[0] + 9 * k}" y="${C[1] + 4 * k}" style="font-size:${11 * k}px;stroke-width:${3 * k}px">Conway Summit</text>
    <circle cx="${L[0]}" cy="${L[1]}" r="${15 * k}" fill="var(--gold)" opacity=".22"/><circle cx="${L[0]}" cy="${L[1]}" r="${6 * k}" fill="var(--gold)" stroke="var(--route-case)" stroke-width="${2.2 * k}"/>
    <text class="maplabel" x="${L[0] + 13 * k}" y="${L[1] + 4 * k}" style="font-size:${11 * k}px;stroke-width:${3 * k}px">Lundy Canyon</text>
  </svg>`;
  const T = (x) => { const r = tm(x.t); return `${r.hm}<small>${r.ap}</small>`; };
  const nMammoth = weather.places[0];
  return `${statusBar('9:30', { bars: 1, wifi: false })}
  <div class="page">
    <div class="pagehead"><div><div class="eyebrow">Saturday, October 10</div><h1 class="large">${esc(sat.title)}</h1></div>
      <span class="offline">${icon('cloud-slash', 'bold')}Offline</span></div>
    <div class="card now"><div class="mapwrap" style="height:${MH}px">${map}
        <span class="glassbtn" style="position:absolute;right:10px;top:10px;z-index:3;width:34px;height:34px;color:var(--tint)">${icon('navigation-arrow', 'fill')}</span>
        <span class="nowchip"><i class="pulse"></i>Now</span></div>
      <div class="body2">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><h2 class="title3">${esc(cur.title)}</h2><span class="tag ember">${icon('clock', 'bold')}Leave by 10:50</span></div>
        <p class="sub" style="margin-top:3px">First pond about 0.25 mi in. Dams and chewed aspen stumps within a mile.</p>
        <div class="bar"><i style="width:14%"></i></div>
        <div class="barl"><span>9:15</span><span>15 of 95 min</span><span>10:50</span></div>
      </div></div>
    <div class="list nextlist">
      <div class="row"><span class="time">${T(n1)}</span><div style="min-width:0"><div class="tt">Conway Summit overlook</div><div class="ss">${icon('car-profile')}10 min · Pour the cocoa</div></div>${chev}</div>
      <div class="row"><span class="time">${T(n2)}</span><div style="min-width:0"><div class="tt">${esc(n2.title)}</div><div class="ss">${icon('car-profile')}16 min · Basin Café or a picnic</div></div>${chev}</div>
    </div>
    <div class="card sun">
      <div style="display:flex;justify-content:space-between;align-items:center"><span class="wlabel">${icon('sun', 'bold')}Sun</span><span class="wlabel" style="color:var(--ink-2);text-transform:none;letter-spacing:-.005em;font-size:13px;font-weight:600">${icon('moon', 'bold')}New moon tonight</span></div>
      ${sunArc()}
      <div class="suntimes">
        <div><span>Sunrise</span><b>${s.sunrise}</b></div>
        <div><span style="color:var(--gold-ink)">Golden hour</span><b>${s.goldenPM.split('–')[0]}<small>pm</small></b></div>
        <div><span>Sunset</span><b>${s.sunset}<small>pm</small></b></div>
        <div><span>Dark</span><b>${s.dark}<small>pm</small></b></div>
      </div>
    </div>
    <div class="grid2">
      <div class="widget"><span class="wlabel" style="color:var(--ember)">${icon('book-open-text', 'bold')}Devotion</span>
        <div style="font-family:var(--serif);font-size:18px;font-weight:560;line-height:1.16;margin-top:6px;letter-spacing:-.01em;text-wrap:balance">${esc(dvSat.title)}</div>
        <div class="cap" style="margin-top:5px">${esc(dvSat.read[0])}</div></div>
      <div class="widget"><span class="wlabel">${icon('thermometer-simple', 'bold')}Mammoth</span>
        <div style="display:flex;align-items:baseline;gap:5px;margin-top:5px"><b style="font-size:28px;font-weight:650;letter-spacing:-.04em;line-height:1">${nMammoth.hi}°</b><span class="sub" style="font-weight:600">${nMammoth.lo}°</span><span class="cap" style="margin-left:auto">Normal</span></div>
        <div class="cap" style="margin-top:7px;display:flex;gap:5px;align-items:flex-start"><span style="width:7px;height:7px;border-radius:4px;background:var(--tint);margin-top:4px;flex:none"></span>Tioga Rd open. 10-min delays at Tuolumne.</div></div>
    </div>
  </div>
  ${tabBar('Today')}`;
}

function planSat() {
  const T = (x) => { const r = tm(x.t); return `${r.hm}<small>${r.ap}</small>`; };
  const dir = `<span class="dir">${icon('navigation-arrow', 'fill')}</span>`;
  const item = (x, body, { node = x.anchor ? 'anchor' : '', cls = '', maps = !!x.maps } = {}) => `<div class="item ${cls}"><div class="tm">${T(x)}</div><div class="rail"><i class="node ${node}"></i></div><div class="card box${maps ? ' hasdir' : ''}">${maps ? dir : ''}${body}</div></div>`;
  const leg = (t) => `<div class="leg"><span></span><span class="rail"></span><span class="lt">${icon('car-profile')}${t}</span></div>`;
  const [a, b, c, d2, e] = ['09:15', '11:00', '11:45', '12:45', '14:15'].map(it);
  return `${statusBar('9:30', { bars: 1, wifi: false })}
  <div class="navbar"><div class="navrow"><span class="navttl">Plan</span><div class="seg" style="width:220px"><span>Fri 9</span><span class="on">Sat 10</span><span>Sun 11</span></div>
    <span class="navbtn">${icon('map-trifold')}</span></div><div style="height:6px"></div></div>
  <div class="tl" style="top:101px">
    ${item(a, `<div style="display:flex;justify-content:space-between;align-items:center"><span class="tag gold"><i class="pulse" style="width:6px;height:6px;margin-right:2px;box-shadow:none"></i>Now</span><span class="foot">Until about 10:50</span></div>
      <div class="tt" style="margin-top:6px">${esc(a.title)}</div>
      <div class="nt">Beaver dams and chewed aspen stumps within about 1 mile.</div>
      <div class="btnrow"><span class="btn sm tinted">${icon('book-open-text', 'bold')}Devotion</span><span class="btn sm plain">${icon('hands-praying')}Ask the animals</span></div>`, { node: 'cur', cls: 'cur' })}
    ${leg('10 min drive')}
    ${item(b, `<div class="tt">Conway Summit overlook</div><div class="nt">Aspens sweeping down toward Mono Lake. Pour the cocoa.</div>`)}
    ${leg('16 min drive')}
    ${item(c, `<div class="tt">${esc(c.title)}</div><div class="nt">Basin Café (Sat 7–8:45) or a picnic from Mono Market.</div>`)}
    ${item(d2, `<div class="tt">${esc(d2.title)}</div><div class="nt">A flat, 1-mile walk among tufa towers. $3 per adult; kids free.</div>`)}
    ${leg('20–35 min drive')}
    ${item(e, `<div style="display:flex;justify-content:space-between;align-items:center"><div class="tt">Festival or quiet time</div><span class="tag gold">Choose one</span></div>
      <div class="choices">
        <div class="opt"><span class="radio"></span><div class="ot">Festival</div><div class="od">Leaves in the Loop, June Lake</div></div>
        <div class="opt"><span class="radio"></span><div class="ot">Quiet time</div><div class="od">Nap, or the cozy corner</div></div>
      </div>`, { node: 'choice', maps: false })}
  </div>
  <div class="nowline" style="top:171px"><span class="bub">9:30</span><span class="dt"></span><span class="ln" style="max-width:14px"></span></div>
  ${tabBar('Plan')}`;
}

// ================================================================== SCREEN 4
function kidsHunt() {
  const core = hunt.filter((h) => !h.bonus), bonus = hunt.filter((h) => h.bonus);
  const found = { 1: new Set(['aspen', 'willow', 'big', 'cone', 'granite', 'dam', 'eyes']) };
  const counts = [7, found[1].size - 1, 5]; // core counts per kid (Kid 2 excludes bonus)
  const F = found[1];
  const nCore = core.filter((h) => F.has(h.id)).length;
  const ring = (n, on) => { const r = 16, C = 2 * Math.PI * r; return `<svg viewBox="0 0 38 38"><circle cx="19" cy="19" r="${r}" fill="none" stroke="var(--fill-2)" stroke-width="3"/><circle cx="19" cy="19" r="${r}" fill="none" stroke="var(--gold-ui)" stroke-width="3" stroke-linecap="round" stroke-dasharray="${f((C * n) / 11)} ${f(C)}" transform="rotate(-90 19 19)"/></svg>`; };
  const NAMES = { aspen: 'Aspen leaf', cottonwood: 'Cottonwood leaf', willow: 'Willow leaf', birch: 'Birch leaf', red: 'A red leaf', big: 'Biggest leaf', heart: 'Heart leaf', cone: 'Pinecone', granite: 'Granite sparkle', dam: 'Beaver dam', tufa: 'Tufa tower', eyes: 'Aspen eyes', track: 'Animal track', obsidian: 'Obsidian' };
  const card = (h) => { const on = F.has(h.id); return `<div class="find${on ? '' : ' off'}${h.id === 'dam' ? ' fresh' : ''}">${h.bonus ? '<span class="tag plain bonus">Bonus</span>' : ''}${on ? `<span class="ok">${icon('check', 'bold')}</span>` : ''}
    <span class="art"><svg viewBox="0 0 100 100"><use href="#${on ? 'art' : 'sil'}-${h.id}"/></svg></span><b>${NAMES[h.id]}</b></div>`; };
  return `${statusBar('9:30', { bars: 1, wifi: false })}
  <div class="navbar clear"><div class="navrow"><span class="back">${icon('caret-left', 'bold')}Kids</span><span></span><span class="navbtn">${icon('question', 'bold')}</span></div></div>
  <div class="page" style="top:91px">
    <div style="padding:4px 20px 16px"><h1 class="large">Leaf hunt</h1></div>
    <div class="kids">${kids.map((k, i) => `<div class="kid${i === 1 ? ' on' : ''}"><span class="ring">${ring(counts[i], i === 1)}<b>${i + 1}</b></span><div><div class="kn">${k}</div><div class="kc">${counts[i]} of 11</div></div></div>`).join('')}</div>
    <div class="progress"><div class="big"><b>${nCore}</b><span>of 11 found · ${11 - nCore} to go</span></div>
      <div class="pips">${core.map((h) => `<i class="${F.has(h.id) ? 'on' : ''}"></i>`).join('')}</div></div>
    <div class="hunt">${[...core, ...bonus].map(card).join('')}</div>
  </div>
  ${tabBar('Kids')}`;
}

// ================================================================== SCREEN 5
function devotionSat(tr = 'ESV') {
  const ref = dvSat.read[0];
  const p = passages[ref];
  const text = tr === 'ESV' ? p.esv : p.niv;
  const split = tr === 'ESV' ? 'The earth brought forth' : 'The land produced';
  const [v11, v12] = [text.slice(0, text.indexOf(split)).trim(), text.slice(text.indexOf(split))];
  const STEPS = [['Look', 'done'], ['Read', 'on'], ['Wonder', ''], ['Pray', ''], ['Do', '']];
  const L = ES.lundy, vw = 190, vh = vw * (400 / 390);
  const topo = `<div class="dv-topo"><svg viewBox="4 ${f(L[1] - vh * 0.42)} ${f(vw)} ${f(vh)}" width="390" height="400" preserveAspectRatio="xMidYMid slice"><use href="#topo-east"/></svg></div>`;
  return `${statusBar('9:30', { bars: 1, wifi: false })}${topo}
  <div class="navbar clear"><div class="navrow"><span class="back">${icon('caret-left', 'bold')}Devotions</span><span></span><span class="navbtn">${icon('check', 'bold')}</span></div></div>
  <div class="page" style="top:91px">
    <div class="dv-head"><div class="eyebrow">Saturday · In the first aspen grove</div><h1 class="large">${esc(dvSat.title)}</h1></div>
    <div class="turns"><div class="turn"><span class="av" style="background:var(--gold-soft);color:var(--gold-ink)">${icon('book-open-text', 'bold')}</span><div><span>Reads</span><b>${reader}</b></div></div>
      <div class="turn"><span class="av" style="background:var(--tint-soft);color:var(--tint)">${icon('hands-praying', 'bold')}</span><div><span>Prays</span><b>${prayer}</b></div></div>
      <span class="swap">${icon('arrows-clockwise', 'bold')}</span></div>
    <div class="passage">
      <div class="ph"><div><div class="steplabel">${icon('book-open-text', 'fill')}Read</div><b>${esc(ref)}</b></div><div class="seg"><span class="${tr === 'ESV' ? 'on' : ''}">ESV</span><span class="${tr === 'NIV' ? 'on' : ''}">NIV</span></div></div>
      <p class="rnote">${esc(dvSat.readNote)}</p>
      <p class="scripture"><sup>11</sup>${esc(v11)} <sup>12</sup>${esc(v12)}</p>
      <div class="pf"><p class="notice">${tr === 'ESV' ? 'Scripture quotation (ESV®) © 2001 by Crossway. Used by permission. Full notice in About.' : 'Scripture quotation (NIV®) © 2011 by Biblica, Inc.® Used by permission. Full notice in About.'}</p><a>YouVersion ${icon('arrow-up-right', 'bold')}</a></div>
    </div>
  </div>
  <div class="stepper">${STEPS.map(([l, st]) => `<span class="st ${st}">${st === 'done' ? icon('check', 'bold') : ''}${l}</span>`).join('')}<span class="nextbtn">${icon('arrow-right', 'bold')}</span></div>
  ${tabBar('Devotions')}`;
}

// ------------------------------------------------------------------ page
const SCREENS = [
  ['today-before', 'Today · before the trip', todayBefore],
  ['today-during', 'Today · Saturday 9:30 am', todayDuring],
  ['plan-sat', 'Plan · Saturday', planSat],
  ['kids-hunt', 'Kids · Leaf hunt', kidsHunt],
  ['devotion-sat', 'Devotion · Saturday', devotionSat],
];
const defs = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>${topoRoute}${shoreRoute}${topoEast}${monoEast}</defs>${buildArt()}</svg>`;
const frames = (theme) => SCREENS.map(([id, label, fn]) => `<figure><div class="phone" id="${id}-${theme}" data-theme="${theme}">${fn()}</div><figcaption>${label} · ${theme}</figcaption></figure>`).join('');

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Sierra Morning</title><meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="styles.css">
<style>
  html,body{margin:0;background:#E9E6DF;font-family:Inter,system-ui,sans-serif}
  .wall{display:flex;flex-direction:column;gap:48px;padding:48px}
  .wall > h2{margin:0 0 -24px;font:600 15px/1 Inter;letter-spacing:.02em;color:#5F594F;text-transform:uppercase}
  .row5{display:flex;gap:40px}
  figure{margin:0}
  figcaption{font:500 13px/1.4 Inter;color:#6B655B;margin-top:12px;text-align:center}
  .row5.dark{background:#1A1816;padding:40px;margin:0 -8px;border-radius:32px}
  .row5.dark figcaption{color:#9C9488}
  figure .phone{border-radius:48px;box-shadow:0 0 0 10px #111,0 0 0 11px #333,0 30px 60px -20px rgba(0,0,0,.4)}
  body.shoot figure .phone{border-radius:0;box-shadow:none}
</style></head><body>
${defs}
<main class="wall"><h2>Sierra Morning · light</h2><div class="row5">${frames('light')}</div>
<h2>Night · dark</h2><div class="row5 dark">${frames('dark')}</div></main>
</body></html>`;
writeFileSync(ROOT + 'index.html', html);
console.log('index.html', (html.length / 1024).toFixed(0) + ' KB');
