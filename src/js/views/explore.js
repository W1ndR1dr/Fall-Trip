import * as store from '../store.js';
import { checklist } from '../store.js';
import { esc, haptic } from '../ui.js';
import { ring, maybeStar, paperclip, drawOn } from '../hand.js';
import { menu, areas, colorReport, RETRIEVED } from '../content/trip.js';
import { hunt } from '../content/kids.js';
import { head, page, slip, tag, mapsBtn, art, icons, rerender } from './common.js';

const FILTERS = [
  ['all', 'everything'], ['maybe', 'our maybes ★'], ['color', 'fall color'], ['animals', 'animals'], ['rocks', 'rocks & volcanoes'],
  ['stars', 'stars'], ['crafts', 'crafts'], ['cozy', 'cozy'], ['easy', 'low energy'], ['food', 'food & cocoa'],
];
const energy = (n) => `<span class="energy" aria-label="effort ${n} of 3">${[1, 2, 3].map((i) => `<i class="${i <= n ? 'on' : ''}"></i>`).join('')}</span>`;
const ART = { lundy: 'vig-aspens', southtufa: 'vig-tufa', conway: 'vig-aspens', olmsted: 'vig-granite', stars: 'vig-night', oakdalecheese: 'vig-orchard', bloomingcamp: 'vig-orchard', panum: 'spec-obsidian', obsidiandome: 'spec-obsidian', hotcreek: 'spec-granite', rmcf: 'spec-red', bookyjoint: 'spec-heart' };

function card(a, maybes) {
  const on = maybes.has(a.id);
  const pic = ART[a.id];
  return slip(`${paperclip()}
    <div class="card-head"><h3><a href="#/do/${a.id}">${esc(a.name)}</a></h3>
      <button class="maybe" type="button" data-maybe="${a.id}" aria-pressed="${on}" aria-label="${on ? 'On' : 'Add to'} our maybe list">${maybeStar(on)}</button></div>
    ${pic ? `<img class="art" src="img/art/${pic}.webp" alt="" loading="lazy" style="width:${pic.startsWith('vig') ? '100%' : '90px'};margin:4px auto 2px">` : ''}
    <p>${esc(a.text)}</p>
    <div class="tags">${tag(a.time)}${a.kind === 'food' ? '' : `<span class="tag ink">effort ${energy(a.energy)}</span>`}${a.status && /⚠/.test(a.status) ? tag('heads up', 'warn') : ''}</div>
    ${a.hours ? `<p class="typed small muted">${esc(a.hours)}</p>` : ''}
    <div class="actions">${mapsBtn(a.maps, 'Maps')}<a class="btn line small" href="#/do/${a.id}">Details</a></div>`, { cls: 'ruled-card', key: 'act-' + a.id });
}

export function explore(filter) {
  const f = filter || store.get('exploreFilter', 'all');
  const maybes = checklist('maybes');
  const match = (a) => f === 'all' ? true : f === 'maybe' ? maybes.has(a.id) : f === 'easy' ? a.energy === 1 && a.kind !== 'food' : f === 'food' ? a.kind === 'food' : (a.tags || []).includes(f);
  const list = menu.filter(match);
  const groups = Object.keys(areas).map((k) => ({ k, items: list.filter((a) => a.area === k) })).filter((g) => g.items.length);
  return {
    title: 'Adventures',
    keepScroll: true,
    html: page(`${head('Adventures', { section: 'III · adventures', folio: '10', lede: 'Nothing here is required. Star what sounds fun, then choose by mood, energy, and weather.' })}
      <div class="circle-pick" role="group" aria-label="Show">${FILTERS.map(([k, l], i) => `<button type="button" data-f="${k}" aria-pressed="${k === f}">${esc(l)}${k === f ? ring(i + 3) : ''}</button>`).join('')}</div>
      <div class="btn-row" style="margin:14px 0 6px"><a class="btn small gold" href="#/color">${icons.leaf}Where the gold is</a><a class="btn line small" href="#/food">${icons.cup}Food & cocoa</a></div>
      ${groups.length ? groups.map((g) => `<section class="section"><div class="section-h"><h2>${esc(areas[g.k].name)}</h2></div>
        <p class="note-hand" style="margin:-4px 0 12px">${esc(areas[g.k].drive)}</p>
        <div class="cards">${g.items.map((a) => card(a, maybes)).join('')}</div></section>`).join('')
        : slip(`<p class="hand" style="font-size:1.3rem">No stars yet. Tap ☆ on anything that sounds fun.</p>`, { key: 'empty' })}`),
    mount(root) {
      root.querySelectorAll('.circle-pick svg.ring').forEach((s) => drawOn(s, { ms: 500 }));
      root.querySelectorAll('[data-f]').forEach((b) => b.addEventListener('click', () => { store.set('exploreFilter', b.dataset.f); location.hash = '#/explore/' + b.dataset.f; }));
      root.querySelectorAll('[data-maybe]').forEach((b) => b.addEventListener('click', () => {
        const on = maybes.toggle(b.dataset.maybe);
        b.setAttribute('aria-pressed', on);
        b.innerHTML = maybeStar(on);
        if (on) drawOn(b.querySelector('svg'), { ms: 450 });
        haptic();
      }));
    },
  };
}

export function activityView(id) {
  const a = menu.find((m) => m.id === id);
  if (!a) return explore();
  const maybes = checklist('maybes');
  const finds = (a.hunt || []).map((h) => hunt.find((x) => x.id === h)).filter(Boolean);
  const rows = [['time', a.time], ['walk', a.walk], ['bathrooms', a.wc], ['fee', a.fee], ['hours', a.hours], ['status', a.status]].filter(([, v]) => v);
  const pic = ART[a.id];
  return {
    title: a.name,
    html: page(`${head(a.name, { back: '#/explore', section: areas[a.area].name })}
      ${slip(`${pic ? `<img class="art" src="img/art/${pic}.webp" alt="" style="width:100%;max-width:420px;margin:0 auto 8px">` : ''}
        <p style="font-size:1.12rem">${esc(a.text)}</p>
        <dl class="facts">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('')}${a.kind === 'food' ? '' : `<dt>effort</dt><dd>${energy(a.energy)}</dd>`}</dl>
        <div class="actions">${mapsBtn(a.maps, 'Open in Maps', 'btn')}
          <button class="btn line" type="button" data-maybe aria-pressed="${maybes.has(a.id)}"><span>${maybes.has(a.id) ? '★ on our maybe list' : '☆ add to maybes'}</span></button></div>`, { key: 'act-d-' + a.id, tape: 'corner-l' })}
      ${finds.length ? slip(`<div class="kicker">Leaf-hunt treasures here</div><div class="tags">${finds.map((h) => `<a class="tag" href="#/kids/hunt">${esc(h.name)}</a>`).join('')}</div>`, { cls: 'kraft', key: 'finds' + a.id }) : ''}
      <p class="note-hand">Details checked ${esc(RETRIEVED)}. Hours change, so call ahead when it matters.</p>`),
    mount(root) {
      const b = root.querySelector('[data-maybe]');
      b.addEventListener('click', () => {
        const on = maybes.toggle(a.id);
        b.setAttribute('aria-pressed', on);
        b.querySelector('span').textContent = on ? '★ on our maybe list' : '☆ add to maybes';
        haptic();
      });
    },
  };
}

// Paint chips: Just starting → Patchy → Near peak → Peak → Past
const CHIPS = ['#8da65a', '#c7c04e', '#f2c14e', '#e58a2b', '#9c6a4a'];
export function colorView() {
  const r = colorReport;
  return {
    title: 'Where the gold is',
    html: page(`${head('Where the Gold Is', { back: '#/explore', section: 'VI · color report', folio: '18', lede: r.summary })}
      <p class="typed small muted">RETRIEVED ${esc(r.retrieved)} · ${esc(r.asOf.toUpperCase())}</p>
      <div class="cards section">${r.spots.map((s) => {
        const lv = s.level; // 1..5
        return slip(`<div style="display:flex;gap:12px;align-items:baseline"><span class="rank">${s.rank}</span><div><h3>${esc(s.name)}</h3><span class="typed small muted">${s.elev.toLocaleString()} FT</span></div></div>
          <div class="chip-row" role="img" aria-label="Projected: ${esc(s.proj)}">${CHIPS.map((c, i) => `<i style="background:${c}" class="${Math.abs(i + 1 - lv) <= 0.5 ? 'on' : Math.abs(i + 1 - lv) <= 1 ? 'half' : ''}"></i>`).join('')}</div>
          <div class="chip-legend"><span>start</span><span>patchy</span><span>near</span><span>peak</span><span>past</span></div>
          <p class="small" style="margin-top:8px"><b>Latest:</b> ${esc(s.now)}</p>
          <p class="note-hand">Oct 9–11: ${esc(s.proj)}</p>
          <div class="tags">${s.warn ? tag(s.warn, 'warn') : ''}${s.far ? tag('far from base', 'ink') : ''}</div>`, { key: 'c' + s.rank });
      }).join('')}</div>
      ${slip(`<div class="kicker">Recheck live</div><ul class="toc">${r.links.map((l) => `<li><a href="${l.url}" target="_blank" rel="noopener"><span class="t" style="font-size:1.08rem">${esc(l.name)}</span><span class="dots"></span><span class="pg">${icons.ext}</span></a></li>`).join('')}</ul>
        <p class="note-hand">Projections are mine, from the Sep 23–25 reports plus 2024–25 timing. Mono County updates Wednesdays; CaliforniaFallColor posts Fridays.</p>`, { key: 'recheck', cls: 'kraft' })}`),
  };
}

export function foodView() {
  const food = menu.filter((m) => m.kind === 'food');
  const groups = Object.keys(areas).map((k) => ({ k, items: food.filter((a) => a.area === k) })).filter((g) => g.items.length);
  return {
    title: 'Food & cocoa',
    html: page(`${head('Food & Cocoa', { back: '#/explore', section: 'III · adventures', folio: '14', lede: 'October hours, checked ' + RETRIEVED + '.' })}
      ${slip(`<p class="note-hand" style="font-size:1.12rem">Closed or changed: Ohanas 395 has closed for good · Carson Peak Inn is temporarily closed · Base Camp Café looks closed · Tuolumne’s grill and store are shut for the season · Whoa Nellie Deli’s last day is uncertain.</p>`, { cls: 'kraft', key: 'closed', tape: 't3' })}
      ${groups.map((g) => `<section class="section"><div class="section-h"><h2>${esc(areas[g.k].name)}</h2></div><div class="cards">${g.items.map((a) => slip(`<h3>${esc(a.name)}</h3><p>${esc(a.text)}</p><p class="typed small muted">${esc(a.hours || '')}</p><div class="actions">${mapsBtn(a.maps, 'Maps')}</div>`, { key: 'f' + a.id })).join('')}</div></section>`).join('')}
      ${slip(`<h3>Recipes for the lodging kitchen</h3><p>Hot cocoa, spiced cider, caramel apples, and fire-safe s’mores.</p><a class="btn small" href="#/kids/cozy">${icons.cup}The cozy kitchen</a>`, { key: 'recipes-link' })}`),
  };
}
