import * as store from '../store.js';
import { checklist } from '../store.js';
import { esc, now, chime, haptic } from '../ui.js';
import { tick, drawOn } from '../hand.js';
import { burst } from '../fx.js';
import { days, routes, sun, weather, menu, beforeWeGo, RETRIEVED } from '../content/trip.js';
import { packing } from '../content/packing.js';
import { conditions } from '../content/conditions.js';
import { head, page, card, mapsBtn, fmtTime, findDevotion, tripDay, icons, rerender, sectionTitle } from './common.js';

const DAYNAME = { fri: 'Friday', sat: 'Saturday', sun: 'Sunday' };
const asOf = () => new Date(conditions.retrieved).toLocaleString('en-US', { timeZone: 'America/Los_Angeles', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

function lodgingMaps() {
  const addr = store.get('lodging', '');
  return addr ? { daddr: addr } : { q: 'Mammoth Lakes, CA' };
}

function entry(it, state) {
  const dv = it.devotion ? findDevotion(it.devotion) : null;
  const opts = (it.menu || []).map((id) => menu.find((m) => m.id === id)).filter(Boolean);
  const maps = it.kind === 'lodging' && it.anchor ? lodgingMaps() : it.maps;
  const metaBits = [it.drive && `<span>${icons.car}${esc(it.drive)}</span>`, it.stay && `<span>${icons.clock}${esc(it.stay)}</span>`].filter(Boolean);
  return `<li class="tl ${it.anchor ? 'fixed' : ''} ${state}"><span class="time">${fmtTime(it.t)}</span><span class="dot"></span>
    <div class="content"><h3>${esc(it.title)}</h3><p>${esc(it.text)}</p>
      ${metaBits.length ? `<div class="meta">${metaBits.join('')}</div>` : ''}
      ${opts.length ? `<div class="options">${opts.map((o) => `<a href="#/do/${o.id}">${esc(o.name)}</a>`).join('')}</div>` : ''}
      ${maps || dv || it.choices ? `<div class="btn-row" style="margin-top:10px">${maps ? mapsBtn(maps, 'Maps') : ''}
        ${dv ? `<a class="btn small secondary" href="#/faith/${dv.id}">${icons.book}${esc(dv.title)}</a>` : ''}
        ${(it.choices || []).map((c) => `<a class="btn small secondary" href="#/route/${c}">${esc(routes[c].title)}</a>`).join('')}</div>` : ''}
    </div></li>`;
}

function forecastHTML(dayId) {
  const rows = conditions.forecasts.filter((f) => f.onTrip)
    .map((f) => ({ place: f.place, ps: f.periods.filter((p) => p.name.startsWith(DAYNAME[dayId])) })).filter((r) => r.ps.length);
  if (!rows.length) return '';
  return `<p class="small"><b>Forecast</b> <span class="faint">(NWS, ${esc(asOf())})</span></p>${rows.map((r) => `<p class="small"><b>${esc(r.place)}:</b> ${r.ps.map((p) => `${esc(p.name)} ${esc(p.temp)}, ${esc(p.text)}, wind ${esc(p.wind)}`).join('; ')}</p>`).join('')}`;
}

export function plan(dayId) {
  const t = now().getTime();
  const active = dayId || tripDay(now()) || 'fri';
  const day = days.find((d) => d.id === active) || days[0];
  const s = sun[day.id];
  const items = day.items.map((it, i) => {
    const start = new Date(it.t).getTime();
    const nxt = day.items[i + 1] ? new Date(day.items[i + 1].t).getTime() : start + 3600e3;
    return entry(it, t >= nxt ? 'past' : t >= start ? 'now' : '');
  });
  const aside = `<aside class="stack">
    ${card(`<span class="eyebrow">Sun & moon · ${esc(s.date)}</span><dl class="facts">
      <dt>Sunrise</dt><dd>${s.sunrise} am</dd><dt>Golden hour</dt><dd>${s.goldenAM} am · ${s.goldenPM} pm</dd>
      <dt>Sunset</dt><dd>${s.sunset} pm</dd><dt>Full dark</dt><dd>${s.dark} pm</dd><dt>Moon</dt><dd>${esc(s.moon)}</dd></dl>
      <p class="small muted" style="margin-top:10px">In canyons the Sierra crest blocks the sun 30–60 minutes before sunset.</p>`)}
    ${card(`<span class="eyebrow">Weather</span>${forecastHTML(day.id)}
      <dl class="facts">${weather.places.map((p) => `<dt>${esc(p.name)}</dt><dd>${p.hi}° / ${p.lo}° <span class="faint">· ${p.elev}</span></dd>`).join('')}</dl>
      <p class="small muted" style="margin-top:10px">${esc(weather.note)}</p>`)}
    ${card(`<ul class="linklist">
      <li><a href="#/pack"><span><span class="t">Packing list</span></span>${icons.back.replace('class="ico"', 'class="ico" style="transform:scaleX(-1)"')}</a></li>
      <li><a href="#/before"><span><span class="t">Before you go</span><span class="d">Roads, weather, and a morning checklist</span></span>${icons.back.replace('class="ico"', 'class="ico" style="transform:scaleX(-1)"')}</a></li>
      <li><a href="#/route/route-tioga"><span><span class="t">Sunday via Tioga</span></span>${icons.back.replace('class="ico"', 'class="ico" style="transform:scaleX(-1)"')}</a></li>
      <li><a href="#/route/route-sonora"><span><span class="t">Sunday via Sonora Pass</span></span>${icons.back.replace('class="ico"', 'class="ico" style="transform:scaleX(-1)"')}</a></li></ul>`)}
  </aside>`;
  return {
    title: 'Plan',
    html: page(`${head('Plan', { eyebrow: 'October 9–11' })}
      <div class="segmented" role="group" aria-label="Day">${days.map((d) => `<button type="button" data-day="${d.id}" aria-pressed="${d.id === day.id}">${d.label.slice(0, 3)} ${d.date.split(' ')[1]}</button>`).join('')}</div>
      <div class="plan-cols" style="margin-top:22px"><div>
        <h2>${esc(day.title)}</h2><p class="read muted">${esc(day.blurb)}</p>
        <div class="legend"><span><i class="fixed"></i>Fixed</span><span><i></i>Flexible: move, swap, or skip</span></div>
        <ol class="timeline">${items.join('')}</ol>
      </div>${aside}</div>`),
    mount(root) {
      root.querySelectorAll('[data-day]').forEach((b) => b.addEventListener('click', () => (location.hash = '#/plan/' + b.dataset.day)));
      const nowEl = root.querySelector('.tl.now');
      if (nowEl && !dayId) setTimeout(() => nowEl.scrollIntoView({ block: 'center' }), 60);
    },
  };
}

export function routeView(id) {
  const r = routes[id];
  if (!r) return plan('sun');
  return {
    title: r.title,
    html: page(`${head(r.title, { back: '#/plan/sun', eyebrow: 'Sunday option', lede: r.summary })}
      ${card(`<ol class="legs">${r.legs.map(([t, x]) => `<li><b>${esc(t)}</b><span>${esc(x)}</span></li>`).join('')}</ol>`)}
      <p class="small muted" style="margin-top:14px">${esc(r.note)}</p>
      <div class="btn-row">${id === 'route-tioga' ? mapsBtn({ daddr: 'Tenaya Lake, Yosemite' }, 'Directions to Tenaya Lake', 'btn') : mapsBtn({ daddr: 'Columbia State Historic Park, Columbia, CA' }, 'Directions to Columbia', 'btn')}
      <a class="btn secondary" href="#/route/${id === 'route-tioga' ? 'route-sonora' : 'route-tioga'}">Compare the other route</a></div>`),
  };
}

// ---- Checklists with a pen-drawn check (JS draw-on) ----
function checkRows(key, items, offset = 0) {
  const cl = checklist(key);
  return items.map((txt, i) => {
    const id = `${key}-${offset + i}`;
    return `<label class="checkrow"><input type="checkbox" data-id="${id}" ${cl.has(id) ? 'checked' : ''}><span class="box">${tick()}</span><span class="label">${esc(txt)}</span></label>`;
  }).join('');
}

function wireChecklist(root, key, total, word) {
  const cl = checklist(key);
  const label = root.querySelector('[data-count]');
  const bar = root.querySelector('.progress i');
  const upd = () => {
    const c = cl.count();
    if (label) label.textContent = `${c} / ${total}`;
    if (bar) bar.style.width = (100 * c) / total + '%';
    const done = root.querySelector('[data-done]');
    if (done) done.hidden = c !== total;
  };
  root.querySelectorAll('input[data-id]').forEach((inp) =>
    inp.addEventListener('change', () => {
      const on = cl.toggle(inp.dataset.id);
      if (on !== inp.checked) inp.checked = on;
      if (on) drawOn(inp.nextElementSibling.querySelector('svg'), { ms: 260 });
      haptic();
      upd();
      if (on && cl.count() === total) { const r = inp.getBoundingClientRect(); burst(r.left + 12, r.top + 12); chime(); }
    })
  );
  upd();
}

const tallyCard = (title, word) => card(`<div class="tally"><span><span class="eyebrow">${esc(word)}</span></span><b data-count></b></div><div class="progress"><i></i></div><p class="small" data-done hidden style="margin-top:10px">All done.</p>`);

export function packView() {
  const total = packing.reduce((a, g) => a + g.items.length, 0);
  let offset = 0;
  const groups = packing.map((g) => { const html = card(`<h3>${esc(g.group)}</h3>${g.note ? `<p class="small muted">${esc(g.note)}</p>` : ''}<div style="margin-top:8px">${checkRows('pack', g.items, offset)}</div>`); offset += g.items.length; return html; });
  return {
    title: 'Packing',
    html: page(`${head('Packing', { back: '#/plan', lede: 'Mornings can be in the 20s up high and afternoons in the 60s or 70s. Pack layers.' })}
      <div class="stack">${tallyCard('Packing', 'Packed')}${groups.join('')}</div>
      <div class="btn-row"><button class="btn secondary small" type="button" data-reset>Uncheck everything</button></div>`),
    mount(root) {
      wireChecklist(root, 'pack', total);
      root.querySelector('[data-reset]').addEventListener('click', () => {
        if (confirm('Uncheck the whole packing list?')) { checklist('pack').clear(); rerender(); }
      });
    },
  };
}

export function beforeView() {
  const n = beforeWeGo.checklist.length;
  return {
    title: 'Before you go',
    html: page(`${head('Before you go', { back: '#/plan', lede: `Check these Friday morning while you have signal. The information in this app was gathered ${RETRIEVED}.` })}
      <div class="stack">
      ${tallyCard('Checks', 'Done')}
      ${card(checkRows('before', beforeWeGo.checklist))}
      ${card(`<span class="eyebrow">Check live</span><ul class="linklist">${beforeWeGo.links.map((l) => `<li><a href="${l.url}" target="_blank" rel="noopener"><span><span class="t">${esc(l.name)}</span><span class="d">${esc(l.why)}</span></span>${icons.ext}</a></li>`).join('')}</ul>`)}
      ${card(`<span class="eyebrow">Saved snapshot · ${esc(asOf())}</span>
        <p class="small"><b>Tioga Road (NPS):</b> ${esc(conditions.tioga || 'not captured')}</p>
        ${Object.entries(conditions.roads).map(([r, t]) => `<p class="small"><b>Caltrans ${r === '395' ? 'US' : 'CA'}-${r}:</b> ${esc(t.slice(0, 240))}…</p>`).join('')}
        ${conditions.forecasts.map((f) => `<p class="small"><b>${esc(f.place)}:</b> ${f.periods.slice(0, 3).map((p) => `${esc(p.name)} ${esc(p.temp)} ${esc(p.text)}`).join(' · ')}</p>`).join('')}`, 'tint')}
      ${card(`<h3>If Tioga is closed</h3><p>Storm closures are rare in early October. Check NPS and QuickMap before you leave.</p>
        <dl class="facts"><dt>Sonora Pass</dt><dd>CA-108. The best backup, 7¼–8¼ hr with stops. Grades up to 26%, so plan for car sickness.</dd>
        <dt>Carson Pass</dt><dd>CA-89 and CA-88 via Monitor Pass. 8–8¾ hr.</dd><dt>I-80</dt><dd>Via Reno. 9½–10½ hr.</dd></dl>
        <p class="small muted" style="margin-top:10px">When chain controls are on, every vehicle must carry chains, including 4WD.</p>`)}
      </div>`),
    mount(root) { wireChecklist(root, 'before', n); },
  };
}
