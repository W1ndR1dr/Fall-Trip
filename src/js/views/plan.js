import * as store from '../store.js';
import { checklist } from '../store.js';
import { esc, now, chime, haptic } from '../ui.js';
import { icons } from '../art.js';
import { burst } from '../fx.js';
import { days, routes, sun, weather, menu, beforeWeGo, RETRIEVED } from '../content/trip.js';
import { packing } from '../content/packing.js';
import { head, page, mapsBtn, fmtTime, findDevotion, tripDay } from './common.js';

const kindChip = {
  drive: ['Drive', 'car'], stop: ['Stop', 'map'], food: ['Food', 'cup'], fuel: ['Gas', 'car'], walk: ['Walk', 'walk'],
  wonder: ['Wonder', 'sparkle'], lodging: ['Home base', 'moon'], prep: ['Prep', 'list'], fun: ['Fun', 'star'], cozy: ['Cozy', 'cup'], choice: ['Choose', 'map'],
};

function lodgingMaps() {
  const addr = store.get('lodging', '');
  return addr ? { daddr: addr } : { q: 'Mammoth Lakes, CA' };
}

function itemCard(it, state) {
  const [label, ic] = kindChip[it.kind] || ['', 'info'];
  const dv = it.devotion ? findDevotion(it.devotion) : null;
  const opts = (it.menu || []).map((id) => menu.find((m) => m.id === id)).filter(Boolean);
  const maps = it.kind === 'lodging' && it.anchor ? lodgingMaps() : it.maps;
  return `<li class="tl ${it.anchor ? 'anchor' : ''} ${state}">
    <div class="tm">${fmtTime(it.t)}</div>
    <article class="card">
      <h3>${esc(it.title)}</h3>
      <p>${esc(it.text)}</p>
      <div class="meta">
        ${label ? `<span class="chip alt">${icons[ic]}${label}</span>` : ''}
        ${it.drive ? `<span class="chip">${icons.car}${esc(it.drive)}</span>` : ''}
        ${it.stay ? `<span class="chip">${icons.clock}${esc(it.stay)}</span>` : ''}
        ${it.anchor ? '' : '<span class="chip alt">Flexible</span>'}
      </div>
      ${opts.length ? `<div class="chips">${opts.map((o) => `<a class="chip" href="#/do/${o.id}">${esc(o.name)} →</a>`).join('')}</div>` : ''}
      <div class="btn-row">
        ${maps ? mapsBtn(maps) : ''}
        ${dv ? `<a class="btn ghost small" href="#/faith/${dv.id}">${icons.faith}${esc(dv.title)}</a>` : ''}
        ${(it.choices || []).map((c) => `<a class="btn ghost small" href="#/route/${c}">${esc(routes[c].title)}</a>`).join('')}
      </div>
    </article>
  </li>`;
}

export function plan(dayId) {
  const t = now().getTime();
  const active = dayId || tripDay(now()) || 'fri';
  const day = days.find((d) => d.id === active) || days[0];
  const s = sun[day.id];
  const items = day.items.map((it, i) => {
    const start = new Date(it.t).getTime();
    const nxt = day.items[i + 1] ? new Date(day.items[i + 1].t).getTime() : start + 3600e3;
    const state = t >= nxt ? 'past' : t >= start ? 'now' : '';
    return itemCard(it, state);
  });

  const side = `<aside>
    <section class="card"><h3>${esc(s.date)}: light</h3>
      <div class="sunbar" style="margin-top:8px">
        <div><span>Sunrise</span><b>${s.sunrise}</b></div><div><span>Sunset</span><b>${s.sunset}</b></div>
        <div><span>Golden AM</span><b>${s.goldenAM}</b></div><div><span>Golden PM</span><b>${s.goldenPM}</b></div>
      </div>
      <p class="small muted" style="margin-top:8px">${icons.moon} ${esc(s.moon)}. Fully dark by ${s.dark} pm.</p>
      <p class="small muted">The Sierra crest hides the sun early in canyons. Golden light fades there 30–60 minutes before sunset.</p>
    </section>
    <section class="card"><h3>Weather</h3>
      ${weather.forecast ? `<p class="small"><b>Forecast (${esc(weather.forecastRetrieved)}):</b></p>${weather.forecast.map((f) => `<p class="small"><b>${esc(f.name)}:</b> ${esc(f.text)}</p>`).join('')}` : ''}
      <ul class="small" style="padding-left:18px;margin:6px 0">${weather.places.map((p) => `<li><b>${esc(p.name)}</b> (${p.elev}): ~${p.hi}° / ${p.lo}°</li>`).join('')}</ul>
      <p class="small muted">${esc(weather.note)}</p><p class="small muted">${esc(weather.outlook)}</p>
    </section>
    <section class="card"><h3>Trip kit</h3>
      <ul class="linklist">
        <li><a href="#/pack">${icons.pack}<span>Packing list<span class="why">Weather-driven, checkable</span></span></a></li>
        <li><a href="#/before">${icons.list}<span>Before we go<span class="why">Morning-of checks and live links</span></span></a></li>
        <li><a href="#/route/route-tioga">${icons.car}<span>Sunday: home over Tioga</span></a></li>
        <li><a href="#/route/route-sonora">${icons.car}<span>Sunday: Sonora Pass + Columbia</span></a></li>
      </ul>
    </section>
  </aside>`;

  return {
    title: 'Plan',
    html: page(`${head('The plan', '', 'Oct 9–11 · light spine, lots of room')}
      <div class="daytabs"><div class="seg" role="tablist" aria-label="Day">
        ${days.map((d) => `<button type="button" role="tab" aria-selected="${d.id === day.id}" aria-pressed="${d.id === day.id}" data-day="${d.id}">${d.label.slice(0, 3)} ${d.date.split(' ')[1]}</button>`).join('')}
      </div></div>
      <div class="plan-cols"><div>
        <h2>${esc(day.title)}</h2><p class="lede">${esc(day.blurb)}</p>
        <p class="small muted">Gold dots are the few fixed points. Everything else is a suggestion. Swap, skip, or linger.</p>
        <ol class="timeline">${items.join('')}</ol>
      </div>${side}</div>`),
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
    html: page(`${head(r.title, '#/plan/sun', 'Sunday route option')}
      <p class="lede">${esc(r.summary)}</p>
      <section class="card"><ol class="route-legs">${r.legs.map(([t, x]) => `<li><b>${esc(t)}</b><span>${esc(x)}</span></li>`).join('')}</ol>
      <p class="small muted" style="margin-top:10px">${esc(r.note)}</p></section>
      <div class="btn-row">${id === 'route-tioga' ? mapsBtn({ daddr: 'Tenaya Lake, Yosemite' }, 'Maps: Tenaya Lake') : mapsBtn({ daddr: 'Columbia State Historic Park, Columbia, CA' }, 'Maps: Columbia')}
      <a class="btn ghost" href="#/route/${id === 'route-tioga' ? 'route-sonora' : 'route-tioga'}">Compare the other route</a></div>`),
  };
}

function checklistHTML(key, groups) {
  const cl = checklist(key);
  let n = 0;
  return groups.map((g) => `<section class="card section"><h3>${esc(g.group)}</h3>${g.note ? `<p class="small muted">${esc(g.note)}</p>` : ''}
    <div>${g.items.map((txt) => { const id = key + '-' + (n++); return `<label class="check"><input type="checkbox" data-id="${id}" ${cl.has(id) ? 'checked' : ''}><span>${esc(txt)}</span></label>`; }).join('')}</div></section>`).join('');
}

function wireChecklist(root, key, total) {
  const cl = checklist(key);
  const bar = root.querySelector('.progress i');
  const label = root.querySelector('[data-count]');
  const upd = () => {
    const c = cl.count();
    if (bar) bar.style.width = (100 * c) / total + '%';
    if (label) label.textContent = `${c} of ${total}`;
  };
  root.querySelectorAll('input[data-id]').forEach((inp) =>
    inp.addEventListener('change', (e) => {
      const on = cl.toggle(inp.dataset.id);
      if (on !== inp.checked) inp.checked = on;
      haptic();
      upd();
      if (cl.count() === total) {
        const r = inp.getBoundingClientRect();
        burst(r.left + 14, r.top + 14);
        chime();
      }
    })
  );
  upd();
}

export function packView() {
  const total = packing.reduce((a, g) => a + g.items.length, 0);
  return {
    title: 'Packing',
    html: page(`${head('Packing list', '#/plan', 'Weather-driven')}
      <p class="lede">Mornings in the 20s and 30s up high, afternoons in the 60s and 70s (Bishop can hit 80°). Pack layers, not bulk.</p>
      <div class="card"><div style="display:flex;justify-content:space-between"><b>Packed</b><span data-count></span></div><div class="progress" style="margin-top:8px"><i></i></div></div>
      ${checklistHTML('pack', packing)}
      <button class="btn ghost" type="button" data-reset>Uncheck everything</button>`),
    mount(root) {
      wireChecklist(root, 'pack', total);
      root.querySelector('[data-reset]').addEventListener('click', () => {
        if (confirm('Uncheck the whole packing list?')) { checklist('pack').clear(); window.dispatchEvent(new HashChangeEvent('hashchange')); }
      });
    },
  };
}

export function beforeView() {
  const groups = [{ group: 'Morning-of checklist', items: beforeWeGo.checklist }];
  return {
    title: 'Before we go',
    html: page(`${head('Before we go', '#/plan', 'Friday morning')}
      <p class="lede">Five minutes of checks while there's still signal. Data in this app was last refreshed ${esc(RETRIEVED)}.</p>
      <section class="card"><h3>Live links</h3><ul class="linklist">${beforeWeGo.links.map((l) => `<li><a href="${l.url}" target="_blank" rel="noopener">${icons.ext}<span>${esc(l.name)}<span class="why">${esc(l.why)}</span></span></a></li>`).join('')}</ul></section>
      <div class="card section"><div style="display:flex;justify-content:space-between"><b>Done</b><span data-count></span></div><div class="progress" style="margin-top:8px"><i></i></div></div>
      ${checklistHTML('before', groups)}
      <section class="card section"><h3>If Tioga is closed</h3>
      <p>Temporary storm closures are rare in early October but possible. Check NPS and QuickMap before leaving.</p>
      <ul><li><b>Sonora Pass (CA-108):</b> the best backup, ~7¼–8¼ hr with stops. Steep (26%). Car-sickness meds.</li>
      <li><b>Monitor + Carson Pass (CA-89/88):</b> ~8–8¾ hr.</li>
      <li><b>Reno + I-80:</b> ~9½–10½ hr (Sunday I-80 jams).</li></ul>
      <p class="small muted">Chain controls apply to every vehicle, 4WD included. Carry chains if snow is forecast.</p></section>`),
    mount(root) { wireChecklist(root, 'before', beforeWeGo.checklist.length); },
  };
}
