import * as store from '../store.js';
import { checklist } from '../store.js';
import { esc, haptic } from '../ui.js';
import { icons, leaves } from '../art.js';
import { menu, areas, colorReport, RETRIEVED } from '../content/trip.js';
import { hunt } from '../content/kids.js';
import { head, page, mapsBtn } from './common.js';

const TAGS = [
  ['all', 'Everything'], ['maybe', '★ Our maybes'], ['color', 'Fall color'], ['animals', 'Animals'], ['rocks', 'Rocks & volcanoes'],
  ['stars', 'Stars'], ['crafts', 'Crafts'], ['cozy', 'Cozy'], ['easy', 'Low energy'], ['food', 'Food & cocoa'],
];

const energy = (n) => `<span class="energy" aria-label="Energy ${n} of 3">${[1, 2, 3].map((i) => `<i class="${i <= n ? 'on' : ''}"></i>`).join('')}</span>`;

function actCard(a, maybes) {
  const on = maybes.has(a.id);
  return `<article class="card act" data-area="${a.area}">
    <h3><a href="#/do/${a.id}" style="text-decoration:none">${esc(a.name)}</a>
      <button class="star-btn" type="button" data-maybe="${a.id}" aria-pressed="${on}" aria-label="${on ? 'Remove from' : 'Add to'} our maybes">${icons.star}</button></h3>
    <div class="chips"><span class="chip alt">${icons.clock}${esc(a.time)}</span>${a.kind === 'food' ? '' : `<span class="chip alt">${energy(a.energy)}</span>`}
    ${a.status && /⚠/.test(a.status) ? `<span class="chip warn">Heads up</span>` : ''}</div>
    <p>${esc(a.text)}</p>
    ${a.hours ? `<p class="small"><b>Hours:</b> ${esc(a.hours)}</p>` : ''}
    <div class="btn-row">${mapsBtn(a.maps, 'Maps')}<a class="btn ghost small" href="#/do/${a.id}">Details</a></div>
  </article>`;
}

export function explore(filter) {
  const f = filter || store.get('exploreFilter', 'all');
  const maybes = checklist('maybes');
  const match = (a) =>
    f === 'all' ? true : f === 'maybe' ? maybes.has(a.id) : f === 'easy' ? a.energy === 1 && a.kind !== 'food' : f === 'food' ? a.kind === 'food' : (a.tags || []).includes(f);
  const list = menu.filter(match);
  const byArea = Object.keys(areas).map((k) => ({ k, items: list.filter((a) => a.area === k) })).filter((g) => g.items.length);
  return {
    title: 'Explore',
    keepScroll: true,
    html: page(`${head('Pick an adventure', '', 'The optional menu')}
      <p class="lede">Nothing here is required. Star the ones that sound fun, then choose by mood, energy, and weather.</p>
      <div class="filters" role="group" aria-label="Filter">${TAGS.map(([k, l]) => `<button type="button" data-f="${k}" aria-pressed="${k === f}">${l}</button>`).join('')}</div>
      <div class="quick" style="margin:6px 0 4px"><a href="#/color">${leaves.big()}<b>Color report</b><span>Where the gold is</span></a><a href="#/food">${icons.cup}<b>Food & cocoa</b><span>Verified October hours</span></a></div>
      ${byArea.length ? byArea.map((g) => `<section class="section"><h2>${esc(areas[g.k].name)}</h2><p class="small muted">${esc(areas[g.k].drive)}</p>
        <div class="grid two three-lg">${g.items.map((a) => actCard(a, maybes)).join('')}</div></section>`).join('') : `<div class="card section"><p>No stars yet. Tap ☆ on anything that sounds fun.</p></div>`}`),
    mount(root) {
      root.querySelectorAll('[data-f]').forEach((b) => b.addEventListener('click', () => {
        store.set('exploreFilter', b.dataset.f);
        location.hash = '#/explore/' + b.dataset.f;
      }));
      root.querySelectorAll('[data-maybe]').forEach((b) => b.addEventListener('click', () => {
        const on = maybes.toggle(b.dataset.maybe);
        b.setAttribute('aria-pressed', on);
        haptic();
      }));
    },
  };
}

export function activityView(id) {
  const a = menu.find((m) => m.id === id);
  if (!a) return explore();
  const maybes = checklist('maybes');
  const huntItems = (a.hunt || []).map((h) => hunt.find((x) => x.id === h)).filter(Boolean);
  const rows = [['Time', a.time], ['Walk', a.walk], ['Bathrooms', a.wc], ['Fee', a.fee], ['Hours', a.hours], ['Status', a.status]].filter(([, v]) => v);
  return {
    title: a.name,
    html: page(`${head(a.name, '#/explore', areas[a.area].name)}
      <article class="card act">
        <p class="lede" style="color:var(--ink)">${esc(a.text)}</p>
        <dl class="facts">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('')}${a.kind === 'food' ? '' : `<dt>Energy</dt><dd>${energy(a.energy)}</dd>`}</dl>
        <div class="btn-row">${mapsBtn(a.maps)}
        <button class="btn ghost" type="button" data-maybe="${a.id}" aria-pressed="${maybes.has(a.id)}">${icons.star}<span>${maybes.has(a.id) ? 'On our maybe list' : 'Add to maybes'}</span></button></div>
      </article>
      ${huntItems.length ? `<section class="card section"><h3>Leaf hunt finds here</h3><p class="small muted">Keep your eyes open for:</p><div class="chips">${huntItems.map((h) => `<a class="chip" href="#/kids/hunt">${esc(h.name)}</a>`).join('')}</div></section>` : ''}
      <p class="small muted section">Details checked ${esc(RETRIEVED)}. Hours change; call ahead when it matters.</p>`),
    mount(root) {
      const b = root.querySelector('[data-maybe]');
      b.addEventListener('click', () => {
        const on = maybes.toggle(a.id);
        b.setAttribute('aria-pressed', on);
        b.querySelector('span').textContent = on ? 'On our maybe list' : 'Add to maybes';
        haptic();
      });
    },
  };
}

export function colorView() {
  const r = colorReport;
  const pos = (lvl) => ((lvl - 1) / 4) * 100;
  return {
    title: 'Color report',
    html: page(`${head('Color report', '#/explore', `Retrieved ${r.retrieved} · ${r.asOf}`)}
      <p class="lede">${esc(r.summary)}</p>
      <div class="grid two section">${r.spots.map((s) => `<article class="card">
        <div style="display:flex;gap:10px;align-items:baseline"><span class="rank">${s.rank}</span><div><h3>${esc(s.name)}</h3><span class="small muted">${s.elev.toLocaleString()} ft</span></div></div>
        <div class="meter" role="img" aria-label="Projected ${esc(s.proj)}"><i style="left:${pos(s.level)}%"></i></div>
        <div class="meter-scale"><span>Starting</span><span>Patchy</span><span>Near</span><span>Peak</span><span>Past</span></div>
        <p class="small" style="margin-top:8px"><b>Latest:</b> ${esc(s.now)}</p>
        <p class="small"><b>Oct 9–11 (projected):</b> ${esc(s.proj)}</p>
        ${s.warn ? `<span class="chip warn">${esc(s.warn)}</span>` : ''}${s.far ? ' <span class="chip alt">Far from base</span>' : ''}
      </article>`).join('')}</div>
      <section class="card section"><h3>Recheck live</h3><ul class="linklist">${r.links.map((l) => `<li><a href="${l.url}" target="_blank" rel="noopener">${icons.ext}<span>${esc(l.name)}</span></a></li>`).join('')}</ul>
      <p class="small muted">Projections are mine, based on the Sep 23–25 reports and 2024–2025 timing. The Mono County report updates Wednesdays; CaliforniaFallColor posts Fridays.</p></section>`),
  };
}

export function foodView() {
  const food = menu.filter((m) => m.kind === 'food');
  const byArea = Object.keys(areas).map((k) => ({ k, items: food.filter((a) => a.area === k) })).filter((g) => g.items.length);
  return {
    title: 'Food & cocoa',
    html: page(`${head('Food & cocoa', '#/explore', 'October hours, verified ' + RETRIEVED)}
      <div class="card"><p><b>Closed or changed:</b> Ohanas 395 (June Lake) has closed for good. Carson Peak Inn is temporarily closed. Base Camp Café appears closed. Tuolumne Meadows grill and store are closed for the season. Whoa Nellie Deli's closing date is uncertain.</p></div>
      ${byArea.map((g) => `<section class="section"><h2>${esc(areas[g.k].name)}</h2><div class="grid two three-lg">${g.items.map((a) => `<article class="card act"><h3>${esc(a.name)}</h3><p>${esc(a.text)}</p><p class="small"><b>Hours:</b> ${esc(a.hours || '')}</p><div class="btn-row">${mapsBtn(a.maps, 'Maps')}</div></article>`).join('')}</div></section>`).join('')}
      <section class="card section"><h3>Recipes for the lodging kitchen</h3><p>Hot cocoa, spiced cider, caramel apples, and fire-safe s'mores.</p><a class="btn" href="#/kids/cozy">See recipes</a></section>`),
  };
}
