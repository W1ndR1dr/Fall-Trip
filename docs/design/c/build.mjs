// Builds index.html: 5 screens x (light, dark) as 390x844 iPhone frames.
// Real content is imported straight from the app's content modules.
import { readFileSync, writeFileSync } from 'node:fs';
import { days, sun, weather, DEPART, colorReport, menu } from '/home/user/Fall-Trip/src/js/content/trip.js';
import { hunt } from '/home/user/Fall-Trip/src/js/content/kids.js';
import { daily } from '/home/user/Fall-Trip/src/js/content/devotions.js';
import { passages } from '/home/user/Fall-Trip/src/js/content/scripture.js';
import { conditions } from '/home/user/Fall-Trip/src/js/content/conditions.js';
import { symbols as artSymbols, colorVars } from './art.mjs';

const ROUTE = JSON.parse(readFileSync('/home/user/Fall-Trip/public/img/topo/route.json'));
const EAST = JSON.parse(readFileSync('/home/user/Fall-Trip/public/img/topo/eastside.json'));

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const r1 = (n) => Math.round(n * 10) / 10;
const PT = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', hour: 'numeric', minute: '2-digit' });
function tm(iso) {
  const p = PT.formatToParts(new Date(iso));
  const v = (t) => (p.find((x) => x.type === t) || {}).value || '';
  return { hm: `${v('hour')}:${v('minute')}`, ap: v('dayPeriod').toLowerCase() };
}
const T = (iso, cls = 't') => { const x = tm(iso); return `<span class="${cls}">${x.hm}<small>${x.ap}</small></span>`; };
const ft = (m) => Math.round(m * 3.28084).toLocaleString('en-US');

// ------------------------------------------------------------------ topo
function topoSymbol(T, id, indexEvery, base) {
  const layers = T.layers.map((l) => {
    const idx = (l.level - base) % indexEvery === 0;
    return `<path class="tl${idx ? ' ti' : ''}" d="${l.d}"/>`;
  }).join('');
  return `<symbol id="${id}" viewBox="0 0 ${T.width} ${T.height}">${layers}</symbol>`;
}
function waterSymbol(T, id, level) {
  const l = T.layers.find((x) => x.level === level);
  return `<symbol id="${id}" viewBox="0 0 ${T.width} ${T.height}"><path class="water" fill-rule="evenodd" d="M-5 -5H${T.width + 5}V${T.height + 5}H-5Z${l.d}"/></symbol>`;
}
// Smooth route through points (Catmull-Rom -> cubic Bezier)
function spline(pts, tension = 0.5) {
  let d = `M${r1(pts[0][0])} ${r1(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1 = [p1[0] + ((p2[0] - p0[0]) / 6) * tension * 2, p1[1] + ((p2[1] - p0[1]) / 6) * tension * 2];
    const c2 = [p2[0] - ((p3[0] - p1[0]) / 6) * tension * 2, p2[1] - ((p3[1] - p1[1]) / 6) * tension * 2];
    d += `C${r1(c1[0])} ${r1(c1[1])} ${r1(c2[0])} ${r1(c2[1])} ${r1(p2[0])} ${r1(p2[1])}`;
  }
  return d;
}
const S = ROUTE.stops;
const DRIVE = [S.bayarea, S.oakdale, S.groveland, [178, 460], S.craneflat, [166, 332], S.olmsted, S.tenaya, S.tuolumne, S.tioga, S.leevining, [150, 126], [205, 108], S.mammoth];
const driveD = spline(DRIVE);
const E = EAST.stops;
const SAT = [E.mammoth, [372, 150], [300, 190], [230, 210], E.leevining, [120, 260], E.lundy, [80, 300], E.conway, [110, 250], E.leevining, E.southtufa, [240, 190], E.junelake, [360, 168], E.mammoth];
const satD = spline([E.mammoth, [380, 165], [300, 205], [210, 222], E.leevining, [128, 272], E.lundy]) ;

// ------------------------------------------------------------------ icons (24px, 1.8 stroke)
const I = {
  today: '<path d="M3 17.5h18M6.5 17.5a5.5 5.5 0 0 1 11 0M12 6.5v2.2M5.3 10.3l1.5 1.5M18.7 10.3l-1.5 1.5M8.5 21h7"/>',
  plan: '<path d="M9 6.5h11M9 12h11M9 17.5h7"/><circle cx="4.8" cy="6.5" r="1.3"/><circle cx="4.8" cy="12" r="1.3"/><circle cx="4.8" cy="17.5" r="1.3"/>',
  explore: '<circle cx="12" cy="12" r="9"/><path d="M15.6 8.4l-2.1 5.1-5.1 2.1 2.1-5.1z"/>',
  kids: '<path d="M12 21.5v-5.3M12 16.2c-4.4 0-7.2-3-7.2-6.9 0-3.4 2.9-5.9 7.2-7.3 4.3 1.4 7.2 3.9 7.2 7.3 0 3.9-2.8 6.9-7.2 6.9zM12 16.2V7.5M12 12.2l2.8-2.6M12 10l-2.5-2"/>',
  faith: '<path d="M12 6.8C9.6 5 6.4 4.6 3 5.4v13.1c3.4-.8 6.6-.4 9 1.4 2.4-1.8 5.6-2.2 9-1.4V5.4c-3.4-.8-6.6-.4-9 1.4zM12 6.8v13.1"/>',
  sliders: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2.2"/><circle cx="9" cy="17" r="2.2"/>',
  maps: '<path d="M12 2.8l9.2 9.2-9.2 9.2L2.8 12z"/><path d="M9.2 14.6v-2.4c0-.9.7-1.6 1.6-1.6h4M13.2 8.6l2 2-2 2"/>',
  chevL: '<path d="M14.5 5.5L8 12l6.5 6.5"/>',
  chevR: '<path d="M9.5 5.5L16 12l-6.5 6.5"/>',
  arrowR: '<path d="M4.5 12h14M13 6.5l5.5 5.5-5.5 5.5"/>',
  ext: '<path d="M8 16L16.5 7.5M9.5 7.5h7v7"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  car: '<path d="M4.5 16.5v-4l1.8-4.6c.3-.8 1-1.3 1.9-1.3h7.6c.9 0 1.6.5 1.9 1.3l1.8 4.6v4M3.5 16.5h17M6 16.5v2M18 16.5v2"/><circle cx="7.8" cy="13.4" r=".6"/><circle cx="16.2" cy="13.4" r=".6"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  swap: '<path d="M7 4.5L4 7.5l3 3M4 7.5h13M17 13.5l3 3-3 3M20 16.5H7"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
  moon: '<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/>',
  road: '<path d="M8 3.5L5 20.5M16 3.5l3 17M12 5v2.5M12 11v2.5M12 17v2.5"/>',
  wind: '<path d="M3 9h10.5a2.5 2.5 0 1 0-2.5-2.5M3 13.5h15a2.5 2.5 0 1 1-2.5 2.5M3 18h6"/>',
  text: '<path d="M3.5 18.5l4.5-12 4.5 12M5 14.5h6M14.5 18.5l3-8 3 8M15.5 16h4"/>',
  offline: '<path d="M2.5 8.5a14 14 0 0 1 19 0M5.5 12a9.5 9.5 0 0 1 13 0M8.5 15.5a5 5 0 0 1 7 0"/><circle cx="12" cy="19" r="1"/>',
  bag: '<path d="M5 8.5h14l-1 12H6zM9 8.5V7a3 3 0 0 1 6 0v1.5"/>',
  list: '<path d="M4 6.5l1.5 1.5L8 5.5M4 12.5l1.5 1.5L8 11.5M11 7h9M11 13h9M11 19h9M4.5 19h2"/>',
  walk: '<circle cx="13" cy="4.5" r="1.8"/><path d="M10 21l2.5-6.5L15 17v4M9 11.5l2.5-4 3 2.5 3 1M11.5 7.5L8.5 9l-1 3.5"/>',
  pin: '<path d="M12 21s-6.5-6.2-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 14.8 12 21 12 21z"/><circle cx="12" cy="9.8" r="2.3"/>',
  spark: '<path d="M12 3c.4 4.6 1.4 5.6 6 6-4.6.4-5.6 1.4-6 6-.4-4.6-1.4-5.6-6-6 4.6-.4 5.6-1.4 6-6zM18.5 15.5c.2 2 .6 2.4 2.5 2.5-1.9.2-2.3.6-2.5 2.5-.2-1.9-.6-2.3-2.5-2.5 1.9-.1 2.3-.5 2.5-2.5z"/>',
  thermo: '<path d="M10 14.5V5a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0z"/><path d="M12 11v6"/>',
};
const icon = (k, cls = 'i') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${I[k]}</svg>`;

// ------------------------------------------------------------------ chrome
function statusBar(time, { signal = 4, tone = '' } = {}) {
  const bars = [0, 1, 2, 3].map((i) => `<rect x="${i * 5}" y="${9 - i * 2.6 - 2}" width="3.2" height="${i * 2.6 + 3.4}" rx=".9" ${i < signal ? '' : 'opacity=".3"'}/>`).join('');
  return `<div class="sb ${tone}"><span class="sb-time">${time}</span><span class="sb-r">
    <svg width="19" height="12" viewBox="0 0 19 12">${bars}</svg>
    ${signal ? '<svg width="16" height="12" viewBox="0 0 16 12"><path d="M8 11.2 5.6 8.6a3.4 3.4 0 0 1 4.8 0zM3.5 6.5a6.4 6.4 0 0 1 9 0l-1.3 1.4a4.5 4.5 0 0 0-6.4 0zM1.3 4.3a9.5 9.5 0 0 1 13.4 0L13.4 5.7a7.6 7.6 0 0 0-10.8 0z"/></svg>' : ''}
    <svg width="27" height="13" viewBox="0 0 27 13"><rect x=".5" y=".5" width="23" height="12" rx="3.6" fill="none" stroke="currentColor" opacity=".4"/><rect x="2.3" y="2.3" width="${signal ? 16 : 12}" height="8.4" rx="2"/><path d="M25 4.4v4.2c.8-.3 1.4-1.1 1.4-2.1s-.6-1.8-1.4-2.1z" opacity=".45"/></svg></span></div>`;
}
const TABS = [['today', 'Today'], ['plan', 'Plan'], ['explore', 'Activities'], ['kids', 'Kids'], ['faith', 'Devotions']];
function tabBar(active) {
  return `<nav class="tabbar" aria-label="Main"><div class="tabs">${TABS.map(([k, l]) => `<a class="tab${k === active ? ' on' : ''}" ${k === active ? 'aria-current="page"' : ''}>${k === active ? '<span class="tab-pill"></span>' : ''}${icon(k, 'ti')}<span>${l}</span></a>`).join('')}</div></nav><div class="homebar"></div>`;
}
function phone(id, theme, body, { time = '9:41', signal = 4, tab = 'today', sbTone = '' } = {}) {
  return `<section class="phone s-${id}" data-theme="${theme}" id="${id}-${theme}" aria-label="${id} ${theme}">
  <div class="screen">${body}</div>
  ${statusBar(time, { signal, tone: sbTone })}
  ${tabBar(tab)}
</section>`;
}

// ------------------------------------------------------------------ 1. Today, before the trip
function todayBefore() {
  const now = new Date('2026-09-27T09:41:00-07:00');
  const ms = new Date(DEPART) - now;
  const d = Math.floor(ms / 864e5), h = Math.floor((ms % 864e5) / 36e5), m = Math.floor((ms % 36e5) / 6e4);
  // Hero: one SVG in card pixels; the map is placed with a transform so labels stay crisp.
  const W = 366, H = 356, k = 0.93, ox = 26, oy = 36; // map units -> px: (x-ox)*k, (y-oy)*k
  const P = ([x, y]) => [r1((x - ox) * k), r1((y - oy) * k)];
  const lbl = (key, name, sub, side = 'l', dy = 4) => {
    const [x, y] = P(S[key]); const dx = side === 'l' ? -10 : 10;
    return `<g class="stop" transform="translate(${x} ${y})"><circle r="3.6"/><text x="${dx}" y="${dy}" text-anchor="${side === 'l' ? 'end' : 'start'}"><tspan class="sn">${name}</tspan>${sub ? `<tspan class="se" x="${dx}" dy="13">${sub}</tspan>` : ''}</text></g>`;
  };
  const [mx, my] = P(S.mammoth);
  const hero = `<div class="hero field rust grain">
    <svg class="hero-map" viewBox="0 0 ${W} ${H}" aria-hidden="true">
      <g transform="scale(${k}) translate(${-ox} ${-oy})">
        <use href="#topo-route" width="${ROUTE.width}" height="${ROUTE.height}"/>
        <path class="route-case" d="${driveD}"/><path class="route" d="${driveD}"/>
      </g>
      ${lbl('olmsted', 'Olmsted Point', '', 'l', 4)}
      ${lbl('tioga', 'Tioga Pass', '9,945 ft', 'l', -3)}
      ${lbl('leevining', 'Lee Vining', '', 'l', 4)}
      <g class="stop dest" transform="translate(${mx} ${my})"><circle r="10" class="ring"/><circle r="4.4"/><text x="16" y="5"><tspan class="sn">Mammoth Lakes</tspan></text></g>
    </svg>
    <div class="hero-top"><span class="wordmark on">Fall <em>Trip</em></span><button class="iconbtn glass" aria-label="Settings">${icon('sliders')}</button></div>
    <div class="hero-count" role="timer" aria-label="${d} days, ${h} hours, ${m} minutes until we leave">
      <span class="kicker">Leaving in</span>
      <div class="mega">${d}</div>
      <div class="count-side"><span class="count-days">days,</span><span class="count-hm"><b>${h}</b>h <b>${String(m).padStart(2, '0')}</b>m</span></div>
    </div>
    <div class="hero-foot glassbar"><div><b>Leave Friday at noon</b><span>About 8 hours with stops</span></div><a class="route-link" aria-label="Follow the route">Route ${icon('arrowR', 'i sm')}</a></div>
  </div>`;

  const cr = colorReport.spots[0];
  const bento = `<div class="bento">
    <a class="tile plan field olive grain">
      <span class="kicker">Plan</span>
      <h3 class="tile-title">Hour by <em>hour</em></h3>
      <ul class="daylist">${days.map((dd) => `<li><b>${dd.label.slice(0, 3)}</b><span>${esc(dd.title.replace("The Lord's Day, and home", 'Home by dinner'))}</span></li>`).join('')}</ul>
    </a>
    <a class="tile hunt field ochre grain"><svg class="tile-art" viewBox="0 0 100 100" style="${colorVars('aspen')}"><use href="#art-aspen"/></svg><span class="tile-name">Leaf hunt</span><span class="tile-sub">11 things to find</span></a>
    <a class="tile faith field plum grain"><span class="tile-glyph">${icon('faith', 'i lg')}</span><span class="tile-name">Devotions</span><span class="tile-sub">About 5 minutes each</span></a>
    <a class="tile color">
      <span class="tile-name">Color report</span>
      <div class="scale" role="img" aria-label="Conway Summit projected Near Peak to Peak">${colorReport.scale.map((s, i) => `<i class="s${i}"></i>`).join('')}<b style="left:${((cr.level - 0.5) / 5) * 100}%"></b></div>
      <span class="tile-sub"><strong>Conway</strong> near peak</span>
    </a>
    <a class="tile explore">${icon('explore', 'i')}<span class="tile-name">Activities</span><span class="tile-sub">${menu.filter((x) => !x.kind).length} optional things</span></a>
    <a class="tile small">${icon('bag', 'i')}<span class="tile-name">Packing</span></a>
    <a class="tile small">${icon('list', 'i')}<span class="tile-name">Before you go</span></a>
  </div>`;
  return hero + bento;
}

// ------------------------------------------------------------------ 2. Today, during (Sat 9:30)
function todayDuring() {
  const sat = days.find((x) => x.id === 'sat');
  const cur = sat.items.find((x) => x.t.includes('T09:15'));
  const [n1, n2, n3] = sat.items.filter((x) => x.t > cur.t);
  const s = sun.sat;
  const dv = daily.find((x) => x.id === 'sat');
  const mamm = weather.places[0];
  const L = E.lundy, ks = 3.1;
  const vb = [L[0] - 318 / ks, L[1] - 92 / ks, 366 / ks, 300 / ks];
  // sun arc: 6:00 am -> 9:00 pm
  const mins = (t) => { const [hh, mm] = t.split(':').map(Number); return hh * 60 + mm; };
  const pm = (t) => mins(t) + (mins(t) < 12 * 60 ? 12 * 60 : 0);
  const t0 = 6 * 60, t1 = 20.5 * 60;
  const X = (min) => 8 + ((min - t0) / (t1 - t0)) * 150;
  const rise = mins(s.sunrise), set = pm(s.sunset), gold = pm(s.goldenPM.split('–')[0]), dark = pm(s.dark), nowM = 9 * 60 + 30;
  const arcY = (min) => { const u = (min - rise) / (set - rise); return 60 - Math.sin(Math.PI * Math.min(1, Math.max(0, u))) * 48; };
  const seg = (a, b, st = 3) => { let p = ''; for (let mm = a; mm <= b; mm += st) p += `${mm === a ? 'M' : 'L'}${r1(X(mm))} ${r1(arcY(mm))}`; return p + `L${r1(X(b))} ${r1(arcY(b))}`; };

  const nowCard = `<article class="now field rust grain">
    <svg class="now-map" viewBox="${vb.map(r1).join(' ')}" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><use href="#topo-east" width="${EAST.width}" height="${EAST.height}"/>
      <g transform="translate(${L[0]} ${L[1]})"><circle r="${r1(15 / ks)}" class="pulse"/><circle r="${r1(4.5 / ks)}" class="here"/></g></svg>
    <div class="now-top"><span class="kicker live"><i></i>Now</span><span class="now-when">9:15–10:45</span></div>
    <h2 class="now-title">Lundy <em>beaver ponds</em></h2>
    <div class="now-prog" role="progressbar" aria-valuenow="15" aria-valuemin="0" aria-valuemax="90" aria-label="15 of 90 minutes"><i style="width:${(15 / 90) * 100}%"></i></div>
    <div class="now-prog-l"><span>15 min in</span><span>1 hr 15 left</span></div>
    <p class="now-note">First pond is about 0.25 mi in. No restrooms at the trailhead.</p>
    <div class="now-actions"><a class="btn on-field solid">${icon('faith', 'i sm')}Devotion here</a><a class="btn on-field ghost">${icon('maps', 'i sm')}Maps</a></div>
    <a class="now-next"><span class="kicker">Next</span>${T(n1.t, 'nt')}<span class="nn">Conway Summit overlook<small>10 min drive · cocoa stop</small></span>${icon('chevR', 'i sm')}</a>
  </article>`;

  const sunTile = `<div class="tile sun">
    <div class="sec-h tight"><span class="kicker">Light</span><span class="moon">${icon('moon', 'i xs')}New Moon</span></div>
    <svg class="sunarc" viewBox="0 0 166 68" aria-hidden="true">
      <line x1="2" x2="164" y1="60" y2="60" class="hz"/>
      <path d="${seg(rise, set, 6)}" class="arc"/><path d="${seg(rise, nowM)}" class="arc done"/><path d="${seg(gold, set)}" class="arc gold"/>
      <circle cx="${r1(X(nowM))}" cy="${r1(arcY(nowM))}" r="5.5" class="sunnow"/>
      <circle cx="${r1(X(dark))}" cy="60" r="2.6" class="darkdot"/>
    </svg>
    <dl class="suntimes">
      <div><dt>Sunrise</dt><dd>${s.sunrise}</dd></div>
      <div class="g"><dt>Golden hour</dt><dd>${s.goldenPM.split('–')[0]}</dd></div>
      <div><dt>Sunset</dt><dd>${s.sunset}</dd></div>
      <div><dt>Dark</dt><dd>${s.dark}</dd></div>
    </dl></div>`;

  const devTile = `<a class="tile dev field plum grain">
    <svg class="dev-tile-leaf" viewBox="0 0 100 100" aria-hidden="true"><use href="#art-aspen"/></svg>
    <span class="kicker">Devotion</span>
    <h3 class="dev-title">Each according to its kind</h3>
    <span class="dev-ref">${esc(dv.read[0])}</span>
    <span class="dev-turn"><i>Reads</i> Kid 2</span>
  </a>`;

  const later = `<section class="later"><div class="sec-h"><span class="kicker">Later today</span><a class="textlink">Saturday plan ${icon('chevR', 'i xs')}</a></div>
    ${[n2, n3].map((n) => `<div class="later-row">${T(n.t, 'nt')}<b>${esc(n.title)}</b></div>`).join('')}</section>`;

  return `<header class="mast day"><span class="kicker">Saturday · Oct 10</span><span class="offline">${icon('offline', 'i xs')}Offline · all saved</span></header>
  <h1 class="day-title">Into the <em>gold</em></h1>
  <div class="glance">
    <span class="chip">${icon('thermo', 'i xs')}<b>${mamm.hi}°</b> / ${mamm.lo}° Mammoth</span>
    <span class="chip">${icon('road', 'i xs')}Tioga Rd open</span>
  </div>
  ${nowCard}
  <div class="pair">${sunTile}${devTile}</div>
  ${later}`;
}

// ------------------------------------------------------------------ 3. Plan, Saturday
function planSat() {
  const sat = days.find((x) => x.id === 'sat');
  const it = (id) => sat.items.find((x) => x.t.includes(id));
  const lundy = it('T09:15'), conway = it('T11:00'), lunch = it('T11:45'), tufa = it('T12:45'), choice = it('T14:15');
  const vb = [70, 120, 330, 240];
  const mini = `<div class="plan-map field olive grain" aria-hidden="true"><svg viewBox="${vb.join(' ')}" preserveAspectRatio="xMidYMid slice"><use href="#topo-east" width="${EAST.width}" height="${EAST.height}"/><use href="#water-east" width="${EAST.width}" height="${EAST.height}"/>
    <path class="route-case" d="${spline(SAT)}"/><path class="route" d="${spline(SAT)}"/>
    ${['mammoth', 'conway', 'leevining', 'southtufa', 'junelake', 'lundy'].map((k) => `<circle class="dot${k === 'lundy' ? ' on' : ''}" cx="${E[k][0]}" cy="${E[k][1]}" r="${k === 'lundy' ? 8 : 5}"/>`).join('')}</svg></div>`;

  const maps = `<a class="iconbtn sm maps" aria-label="Open in Apple Maps">${icon('maps')}</a>`;
  const when = (x) => { const t = tm(x.t); return `<span class="et"><span class="t">${t.hm}<small>${t.ap}</small></span>${x.drive ? `<span class="drv">${icon('car', 'i xs')}${esc(x.drive.replace('~', '').replace(' min', 'm'))}</span>` : ''}</span>`; };
  const row = (x, title, note) => `<li class="ev${x.anchor ? ' anchor' : ''}">
    ${when(x)}<span class="node"></span>
    <div class="eb"><div class="eh"><div><h3>${esc(title)}</h3><p>${note}</p></div>${x.maps ? maps : ''}</div></div></li>`;

  return `<header class="plan-h">
    <div class="plan-hl"><h1 class="plan-title">Saturday</h1><p class="plan-sub"><em>Into the gold</em></p></div>
    ${mini}
  </header>
  <div class="seg days" role="group" aria-label="Day"><a>Fri <b>9</b></a><a class="on" aria-current="true"><span class="seg-pill"></span>Sat <b>10</b></a><a>Sun <b>11</b></a></div>
  <ol class="timeline">
    <li class="ev earlier"><span class="et"><span class="t">7:00<small>am</small></span></span><span class="node"></span><div class="eb"><h3>Sunrise, then the drive north <span class="plus">Show 2</span></h3></div></li>
    <li class="ev current anchor">${when(lundy)}<span class="node"></span>
      <div class="eb"><div class="eh"><div><h3>Lundy beaver ponds</h3><span class="meta">${icon('clock', 'i xs')}Until 10:45<i class="sep"></i>${icon('walk', 'i xs')}First pond 0.25 mi</span></div></div>
      <p>Beaver dams, chewed aspen stumps, and a creek for throwing rocks.</p>
      <div class="ea"><a class="btn sm plum">${icon('faith', 'i sm')}Saturday devotion</a><a class="btn sm quiet">${icon('maps', 'i sm')}Maps</a></div></div></li>
    <li class="nowline" aria-label="Now, 9:30 am"><span>9:30</span></li>
    ${row(conway, 'Conway Summit overlook', 'Pour the cocoa. <span class="stay">Stay 20 min</span>')}
    ${row(lunch, 'Lunch in Lee Vining', 'Basin Café or a Mono Market picnic')}
    ${row(tufa, 'South Tufa, Mono Lake', '$3 per adult, kids free <span class="stay">· 1–1.5 hr</span>')}
    <li class="ev choice">${T(choice.t, 'et')}<span class="node"></span>
      <div class="eb"><span class="kicker sm">Choose one</span><h3>Festival or quiet time</h3>
        <div class="choose">
          <a class="opt field ochre"><b>Energy left?</b><span>Leaves in the Loop festival at Gull Lake</span></a>
          <a class="opt quiet"><b>Running on fumes?</b><span>Home for a nap or quiet reading</span></a>
          <span class="or" aria-hidden="true">or</span>
        </div></div></li>
  </ol>`;
}

// ------------------------------------------------------------------ 4. Kids, leaf hunt
function kidsHunt() {
  const found = new Set(['aspen', 'willow', 'big', 'cone', 'granite', 'dam', 'eyes']);
  const core = hunt.filter((h) => !h.bonus), bonus = hunt.filter((h) => h.bonus);
  const n = core.filter((h) => found.has(h.id)).length;
  const short = { aspen: 'Aspen leaf', cottonwood: 'Cottonwood leaf', willow: 'Willow leaf', birch: 'Water birch leaf', red: 'A red leaf', big: 'Biggest leaf', heart: 'Heart-shaped leaf', cone: 'Pinecone', granite: 'Granite sparkle', dam: 'Beaver dam', tufa: 'Tufa tower', eyes: 'Aspen “eyes”', track: 'Animal track', obsidian: 'Obsidian' };
  const tile = (h) => {
    const f = found.has(h.id);
    return `<button class="find${f ? ' found' : ''}${h.id === 'big' ? ' bleed' : ''}" aria-pressed="${f}" style="${f ? colorVars(h.id) : ''}">
      <svg class="find-art" viewBox="0 0 100 100" aria-hidden="true"><use href="#art-${h.id}"/></svg>
      ${f ? `<span class="badge">${icon('check', 'i')}</span>` : ''}
      <span class="find-name">${esc(short[h.id])}</span></button>`;
  };
  const pips = core.map((h, i) => `<i class="${i < n ? 'on' : ''}"></i>`).join('');
  return `<nav class="navrow"><a class="back">${icon('chevL', 'i')}Kids</a><a class="navbtn">How to play</a></nav>
  <h1 class="page-title">Leaf <em>hunt</em></h1>
  <div class="kids" role="tablist" aria-label="Whose list">
    ${[['Kid 1', 6], ['Kid 2', 5], ['Kid 3', 4]].map(([k, c], i) => `<a class="kid${i === 0 ? ' on' : ''}" role="tab" aria-selected="${i === 0}">${i === 0 ? '<span class="kid-pill"></span>' : ''}<b>${k}</b><span>${c} of 11</span></a>`).join('')}
  </div>
  <div class="tally"><div class="tally-n"><span class="big">${n}</span><span class="of">of ${core.length} found</span></div><div class="tally-r"><div class="pips" role="img" aria-label="${n} of ${core.length}">${pips}</div><span class="tally-sub">${core.length - n} to go · bonus 1 of 3</span></div></div>
  <div class="grid">${core.map(tile).join('')}</div>
  <div class="sec-h" style="margin:22px 20px 10px"><span class="kicker">Bonus</span></div>
  <div class="grid">${bonus.map(tile).join('')}</div>`;
}

// ------------------------------------------------------------------ 5. Devotion, Saturday
function devotionSat() {
  const dv = daily.find((x) => x.id === 'sat');
  const ref = dv.read[0];
  const p = passages[ref];
  return `<div class="dev-head field plum grain">
    <svg class="dev-leaf" viewBox="0 0 100 100" aria-hidden="true"><use href="#art-aspen"/></svg>
    <nav class="navrow on-field"><a class="back">${icon('chevL', 'i')}Devotions</a><span class="navgroup"><a class="iconbtn on-field" aria-label="Large print">${icon('text')}</a><a class="iconbtn on-field" aria-label="Mark as done">${icon('check')}</a></span></nav>
    <span class="kicker">Saturday · In the first aspen grove</span>
    <h1 class="dev-h1">Each according to <em>its kind</em></h1>
    <div class="turns"><span class="turn"><i>Reads</i><b>Kid 2</b></span><span class="turn"><i>Prays</i><b>Kid 3</b></span><a class="iconbtn on-field sm" aria-label="Switch turns">${icon('swap')}</a></div>
  </div>
  <ol class="steps">
    <li class="step"><span class="sk"><b>01</b>Look</span><p>${esc(dv.look)}</p></li>
    <li class="step read"><div class="sk-row"><span class="sk"><b>02</b>Read</span><div class="seg tr" role="group" aria-label="Translation"><a class="on" aria-pressed="true"><span class="seg-pill"></span>ESV</a><a aria-pressed="false">NIV</a></div></div>
      <blockquote class="passage">${esc(p.esv)}</blockquote>
      <div class="ref-row"><span class="ref">${esc(ref)} <span>ESV</span></span><a class="btn sm quiet">Open in YouVersion ${icon('ext', 'i xs')}</a></div>
      <p class="notice">ESV® Bible © 2001 by Crossway. Used by permission. All rights reserved. <a>Notices</a></p>
    </li>
    <li class="step"><span class="sk"><b>03</b>Wonder</span><p class="big">${esc(dv.wonder)}</p></li>
    <li class="step"><span class="sk"><b>04</b>Pray</span><p>${esc(dv.pray)}</p></li>
    <li class="step"><span class="sk"><b>05</b>Do</span><p>${esc(dv.do)}</p></li>
  </ol>`;
}

// ------------------------------------------------------------------ page
const SCREENS = [
  ['today-before', todayBefore, { time: '9:41', tab: 'today' }],
  ['today-during', todayDuring, { time: '9:30', tab: 'today', signal: 0 }],
  ['plan-sat', planSat, { time: '9:30', tab: 'plan', signal: 0 }],
  ['kids-hunt', kidsHunt, { time: '10:05', tab: 'kids', signal: 1 }],
  ['devotion-sat', devotionSat, { time: '9:32', tab: 'faith', signal: 0, sbTone: 'on-field' }],
];

const defs = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  ${topoSymbol(ROUTE, 'topo-route', 750, 250)}
  ${topoSymbol(EAST, 'topo-east', 300, 1900)}
  ${waterSymbol(EAST, 'water-east', 1960)}
  ${artSymbols()}
</defs></svg>`;

const body = SCREENS.map(([id, fn, opt]) => ['light', 'dark'].map((th) => phone(id, th, fn(), opt)).join('\n')).join('\n');
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>Fall Trip · Editorial Bold</title>
<link rel="stylesheet" href="styles.css"></head><body>
${defs}
<main class="board">${body}</main></body></html>`;
writeFileSync(new URL('./index.html', import.meta.url), html);
console.log('index.html', (html.length / 1024).toFixed(0) + 'KB');
