import * as store from '../store.js';
import { checklist } from '../store.js';
import { esc, haptic } from '../ui.js';
import { maybeStar, pop } from '../hand.js';
import { menu, areas, colorReport, RETRIEVED } from '../content/trip.js';
import { hunt } from '../content/kids.js';
import { head, page, card, mapsBtn, icons, sectionTitle } from './common.js';

const FILTERS = [
  ['all', 'All'], ['maybe', 'Starred'], ['color', 'Fall color'], ['animals', 'Animals'], ['rocks', 'Rocks & volcanoes'],
  ['stars', 'Stars'], ['crafts', 'Crafts'], ['cozy', 'Cozy'], ['easy', 'Low energy'], ['food', 'Food & coffee'],
];
const effort = (n) => `<span class="effort" aria-label="Effort ${n} of 3">${[1, 2, 3].map((i) => `<i class="${i <= n ? 'on' : ''}"></i>`).join('')}</span>`;
// A painting for activities that have one; wide scenes vs. single objects.
const ART = { lundy: 'vig-aspens', southtufa: 'vig-tufa', conway: 'vig-aspens', olmsted: 'vig-granite', tenaya: 'vig-granite', stars: 'vig-night', oakdalecheese: 'vig-orchard', bloomingcamp: 'vig-orchard', sonsfarm: 'vig-orchard', panum: 'spec-obsidian', obsidiandome: 'spec-obsidian', hotcreek: 'spec-granite', quake: 'spec-granite', rmcf: 'spec-red', bookyjoint: 'spec-heart', convict: 'vig-tufa', juneloop: 'vig-aspens', leavesloop: 'spec-big', mcgee: 'spec-aspen', rockcreek: 'spec-birch', bishopcreek: 'spec-cottonwood', lakesbasin: 'spec-willow' };
const picture = (id) => {
  const a = ART[id];
  if (!a) return '';
  return `<div class="pic"><img class="art ${a.startsWith('vig') ? 'wide' : 'spec'}" src="img/art/${a}.webp" alt="" loading="lazy"></div>`;
};

function activityCard(a, maybes) {
  const on = maybes.has(a.id);
  const pic = picture(a.id);
  return `<article class="card ${pic ? 'media' : ''}">
    <button class="maybe" type="button" data-maybe="${a.id}" aria-pressed="${on}" aria-label="${on ? 'Starred' : 'Star'} ${esc(a.name)}">${maybeStar(on)}</button>
    ${pic}<div class="${pic ? 'body' : ''}"><h3 style="padding-right:44px"><a href="#/do/${a.id}" style="text-decoration:none">${esc(a.name)}</a></h3>
    <p class="muted">${esc(a.text)}</p>
    <div class="meta"><span>${icons.clock}${esc(a.time)}</span>${a.kind === 'food' ? '' : `<span>Effort ${effort(a.energy)}</span>`}${a.status && /⚠/.test(a.status) ? `<span class="flag">Check first</span>` : ''}</div>
    ${a.hours ? `<p class="small" style="margin-top:8px">${esc(a.hours)}</p>` : ''}
    <div class="actions">${mapsBtn(a.maps, 'Maps')}<a class="btn small soft" href="#/do/${a.id}">Details</a></div></div></article>`;
}

export function explore(filter) {
  const f = filter || store.get('exploreFilter', 'all');
  const maybes = checklist('maybes');
  const match = (a) => f === 'all' ? true : f === 'maybe' ? maybes.has(a.id) : f === 'easy' ? a.energy === 1 && a.kind !== 'food' : f === 'food' ? a.kind === 'food' : (a.tags || []).includes(f);
  const list = menu.filter(match);
  const groups = Object.keys(areas).map((k) => ({ k, items: list.filter((a) => a.area === k) })).filter((g) => g.items.length);
  return {
    title: 'Activities',
    keepScroll: true,
    html: page(`${head('Activities', { lede: 'None of these are required. Star the ones that sound good and decide on the day.' })}
      <div class="pills" role="group" aria-label="Filter">${FILTERS.map(([k, l]) => `<button type="button" data-f="${k}" aria-pressed="${k === f}">${esc(l)}</button>`).join('')}</div>
      <div class="btn-row" style="margin-top:6px"><a class="btn small secondary" href="#/color">${icons.leaf}Color report</a><a class="btn small secondary" href="#/food">${icons.cup}Food & coffee</a></div>
      ${groups.length ? groups.map((g) => `<section class="section">${sectionTitle(areas[g.k].name, areas[g.k].drive)}
        <div class="grid cols">${g.items.map((a) => activityCard(a, maybes)).join('')}</div></section>`).join('')
        : `<div class="section">${card('<p>Nothing starred yet. Tap the star on anything that sounds good.</p>', 'tint')}</div>`}`),
    mount(root) {
      root.querySelectorAll('[data-f]').forEach((b) => b.addEventListener('click', () => { store.set('exploreFilter', b.dataset.f); location.hash = '#/explore/' + b.dataset.f; }));
      root.querySelectorAll('[data-maybe]').forEach((b) => b.addEventListener('click', () => {
        const on = maybes.toggle(b.dataset.maybe);
        b.setAttribute('aria-pressed', on);
        b.innerHTML = maybeStar(on);
        if (on) pop(b);
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
  const rows = [['Time', a.time], ['Walk', a.walk], ['Restrooms', a.wc], ['Fee', a.fee], ['Hours', a.hours], ['Status', a.status]].filter(([, v]) => v);
  const art = ART[a.id];
  return {
    title: a.name,
    html: page(`${head(a.name, { back: '#/explore', eyebrow: areas[a.area].name })}
      ${art ? `<img class="art" src="img/art/${art}.webp" alt="" style="width:${art.startsWith('vig') ? '100%' : '160px'};max-width:560px;margin:0 auto 18px;border-radius:14px">` : ''}
      <p class="read">${esc(a.text)}</p>
      ${card(`<dl class="facts">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('')}${a.kind === 'food' ? '' : `<dt>Effort</dt><dd>${effort(a.energy)}</dd>`}</dl>`)}
      <div class="btn-row">${mapsBtn(a.maps, 'Open in Maps', 'btn')}
        <button class="btn secondary" type="button" data-maybe aria-pressed="${maybes.has(a.id)}">${maybeStar(maybes.has(a.id)).replace('<svg', '<svg class="ico"')}<span>${maybes.has(a.id) ? 'Starred' : 'Star'}</span></button></div>
      ${finds.length ? `<div class="section">${card(`<span class="eyebrow">Leaf hunt</span><p>Look for: ${finds.map((h) => `<a href="#/kids/hunt">${esc(h.name)}</a>`).join(', ')}.</p>`, 'tint')}</div>` : ''}
      <p class="small faint" style="margin-top:18px">Checked ${esc(RETRIEVED)}. Hours change; call ahead when it matters.</p>`),
    mount(root) {
      const b = root.querySelector('[data-maybe]');
      b.addEventListener('click', () => {
        const on = maybes.toggle(a.id);
        b.setAttribute('aria-pressed', on);
        b.innerHTML = `${maybeStar(on).replace('<svg', '<svg class="ico"')}<span>${on ? 'Starred' : 'Star'}</span>`;
        haptic();
      });
    },
  };
}

// Colors for Just starting → Patchy → Near peak → Peak → Past.
const STAGES = ['#8da65a', '#c7c04e', '#e9b93f', '#e0822e', '#9c6a4a'];
export function colorView() {
  const r = colorReport;
  return {
    title: 'Color report',
    html: page(`${head('Color report', { back: '#/explore', eyebrow: `Updated ${r.retrieved}`, lede: r.summary })}
      <p class="small muted">${esc(r.asOf)}. Projections for Oct 9–11 are mine, based on those reports and the 2024–2025 timing.</p>
      <div class="grid cols section" style="margin-top:20px">${r.spots.map((s) => card(`<div style="display:flex;gap:12px;align-items:flex-start"><span class="rank">${s.rank}</span>
        <div><h3>${esc(s.name)}</h3><span class="small faint">${s.elev.toLocaleString()} ft</span></div></div>
        <div class="scale" role="img" aria-label="Projected for our weekend: ${esc(s.proj)}">${STAGES.map((c, i) => `<i style="background:${c}" class="${Math.abs(i + 1 - s.level) <= 0.5 ? 'on' : ''}"></i>`).join('')}</div>
        <div class="scale-legend"><span>Start</span><span>Patchy</span><span>Near</span><span>Peak</span><span>Past</span></div>
        <dl class="facts" style="margin-top:12px"><dt>Latest</dt><dd>${esc(s.now)}</dd><dt>Oct 9–11</dt><dd>${esc(s.proj)}</dd></dl>
        ${s.warn || s.far ? `<div class="meta">${s.warn ? `<span class="flag">${esc(s.warn)}</span>` : ''}${s.far ? '<span>Far from Mammoth</span>' : ''}</div>` : ''}`)).join('')}</div>
      <div class="section">${card(`<span class="eyebrow">Latest reports</span><ul class="linklist">${r.links.map((l) => `<li><a href="${l.url}" target="_blank" rel="noopener"><span class="t">${esc(l.name)}</span>${icons.ext}</a></li>`).join('')}</ul>`)}</div>`),
  };
}

export function foodView() {
  const food = menu.filter((m) => m.kind === 'food');
  const groups = Object.keys(areas).map((k) => ({ k, items: food.filter((a) => a.area === k) })).filter((g) => g.items.length);
  return {
    title: 'Food & coffee',
    html: page(`${head('Food & coffee', { back: '#/explore', lede: 'October hours, checked ' + RETRIEVED + '.' })}
      ${card(`<span class="eyebrow">Closed or changed</span><p>Ohanas 395 in June Lake has closed. Carson Peak Inn is temporarily closed. Base Camp Café appears closed. The Tuolumne Meadows store and grill are closed for the season. Whoa Nellie Deli's closing date is unconfirmed.</p>`, 'tint')}
      ${groups.map((g) => `<section class="section">${sectionTitle(areas[g.k].name)}<div class="grid cols">${g.items.map((a) => card(`<h3>${esc(a.name)}</h3><p class="muted">${esc(a.text)}</p><p class="small"><b>Hours</b> · ${esc(a.hours || '')}</p><div class="actions">${mapsBtn(a.maps, 'Maps')}</div>`)).join('')}</div></section>`).join('')}
      <div class="section">${card(`<h3>Recipes</h3><p class="muted">Hot cocoa, spiced cider, caramel apples, and s’mores without a campfire.</p><div class="actions"><a class="btn small" href="#/kids/cozy">${icons.cup}Recipes</a></div>`)}</div>`),
  };
}
