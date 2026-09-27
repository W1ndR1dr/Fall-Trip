import * as store from '../store.js';
import { checklist } from '../store.js';
import { esc, now, chime, haptic } from '../ui.js';
import { logDot, thunk, stampSVG } from '../hand.js';
import { burst } from '../fx.js';
import { days, routes, sun, weather, menu, beforeWeGo, RETRIEVED } from '../content/trip.js';
import { packing } from '../content/packing.js';
import { conditions } from '../content/conditions.js';
import { head, page, slip, tag, mapsBtn, fmtTime, findDevotion, tripDay, icons, rerender, sectionH } from './common.js';

const KIND = { drive: 'on the road', stop: 'stop', food: 'food', fuel: 'gas', walk: 'walk', wonder: 'wonder', lodging: 'home base', prep: 'prep', fun: 'fun', cozy: 'cozy', choice: 'choose' };
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
  const body = `<h3>${esc(it.title)}</h3><p>${esc(it.text)}</p>
    <div class="tags">${tag(KIND[it.kind] || it.kind, 'ink')}${it.drive ? tag(it.drive) : ''}${it.stay ? tag(it.stay) : ''}</div>
    ${opts.length ? `<p class="pencil-note">options: ${opts.map((o) => `<a href="#/do/${o.id}">${esc(o.name)}</a>`).join(' · ')}</p>` : ''}
    ${maps || dv || it.choices ? `<div class="actions">${maps ? mapsBtn(maps, 'Maps', 'btn small') : ''}
      ${dv ? `<a class="btn line small" href="#/faith/${dv.id}">${icons.book}${esc(dv.title)}</a>` : ''}
      ${(it.choices || []).map((c) => `<a class="btn line small" href="#/route/${c}">${esc(routes[c].title)}</a>`).join('')}</div>` : ''}`;
  return `<li class="${it.anchor ? 'anchor' : ''} ${state}"><span class="tm">${fmtTime(it.t)}</span>${logDot(it.anchor)}
    ${it.anchor ? slip(body, { key: it.t }) : `<div class="slip plain">${body}</div>`}</li>`;
}

function forecastHTML(dayId) {
  const rows = conditions.forecasts.filter((f) => f.onTrip)
    .map((f) => ({ place: f.place, ps: f.periods.filter((p) => p.name.startsWith(DAYNAME[dayId])) })).filter((r) => r.ps.length);
  if (!rows.length) return '';
  return `<p class="small"><b>NWS forecast</b> <span class="typed muted">(as of ${esc(asOf())})</span></p>${rows.map((r) => `<p class="small"><b>${esc(r.place)}:</b> ${r.ps.map((p) => `${esc(p.name)} ${esc(p.temp)}, ${esc(p.text)}, wind ${esc(p.wind)}`).join('; ')}</p>`).join('')}`;
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
  const aside = `<aside>
    ${slip(`<div class="kicker">Almanac · ${esc(s.date)}</div><div class="almanac"><dl>
      <dt>sunrise</dt><dd>${s.sunrise} am</dd><dt>golden am</dt><dd>${s.goldenAM}</dd>
      <dt>golden pm</dt><dd>${s.goldenPM}</dd><dt>sunset</dt><dd>${s.sunset} pm</dd><dt>dark sky</dt><dd>${s.dark} pm</dd>
      <dt>moon</dt><dd>${esc(s.moon)}</dd></dl></div>
      <p class="note-hand">In the canyons the crest hides the sun 30–60 min early. Chase the light on open overlooks.</p>`, { cls: 'kraft', key: 'alm' + day.id })}
    ${slip(`<div class="kicker">Weather</div>${forecastHTML(day.id)}
      <div class="almanac"><dl>${weather.places.map((p) => `<dt>${esc(p.name)}</dt><dd>~${p.hi}° / ${p.lo}° <span class="muted">${p.elev}</span></dd>`).join('')}</dl></div>
      <p class="small muted">${esc(weather.note)} ${esc(weather.outlook)}</p>`, { key: 'wx' })}
    ${slip(`<div class="kicker">Trip kit</div><ul class="toc">
      <li><a href="#/pack"><span class="t" style="font-size:1.1rem">Packing list</span><span class="dots"></span></a></li>
      <li><a href="#/before"><span class="t" style="font-size:1.1rem">Before we go</span><span class="dots"></span></a></li>
      <li><a href="#/route/route-tioga"><span class="t" style="font-size:1.1rem">Sunday: home over Tioga</span><span class="dots"></span></a></li>
      <li><a href="#/route/route-sonora"><span class="t" style="font-size:1.1rem">Sunday: Sonora Pass</span><span class="dots"></span></a></li></ul>`, { key: 'kit' })}
  </aside>`;
  return {
    title: 'Plan',
    html: page(`${head('The Plan', { section: 'II · the plan', folio: { fri: '4', sat: '6', sun: '8' }[day.id] })}
      <div class="tabs-kraft" role="group" aria-label="Day">${days.map((d) => `<button type="button" data-day="${d.id}" aria-pressed="${d.id === day.id}">${d.label.toUpperCase().slice(0, 3)} ${d.date.split(' ')[1]}</button>`).join('')}</div>
      <div class="plan-cols" style="margin-top:16px"><div>
        <h2>${esc(day.title)}</h2><p class="lede" style="font-style:italic;color:var(--ink-2)">${esc(day.blurb)}</p>
        <p class="note-hand" style="margin:6px 0 16px">Red seals are the few fixed points. Everything in pencil is just an idea: swap it, skip it, linger.</p>
        <ol class="log">${items.join('')}</ol>
      </div>${aside}</div>`),
    mount(root) {
      root.querySelectorAll('[data-day]').forEach((b) => b.addEventListener('click', () => (location.hash = '#/plan/' + b.dataset.day)));
      const nowEl = root.querySelector('.log li.now');
      if (nowEl && !dayId) setTimeout(() => nowEl.scrollIntoView({ block: 'center' }), 60);
    },
  };
}

export function routeView(id) {
  const r = routes[id];
  if (!r) return plan('sun');
  return {
    title: r.title,
    html: page(`${head(r.title, { back: '#/plan/sun', section: 'Sunday option', lede: r.summary })}
      ${slip(`<ol class="route-legs">${r.legs.map(([t, x]) => `<li><b>${esc(t)}</b><span>${esc(x)}</span></li>`).join('')}</ol>
      <p class="note-hand" style="margin-top:12px">${esc(r.note)}</p>`, { key: id, tape: 't2' })}
      <div class="btn-row">${id === 'route-tioga' ? mapsBtn({ daddr: 'Tenaya Lake, Yosemite' }, 'Maps: Tenaya Lake', 'btn') : mapsBtn({ daddr: 'Columbia State Historic Park, Columbia, CA' }, 'Maps: Columbia', 'btn')}
      <a class="btn line" href="#/route/${id === 'route-tioga' ? 'route-sonora' : 'route-tioga'}">Compare the other road</a></div>`),
  };
}

function checklistHTML(key, groups) {
  const cl = checklist(key);
  let n = 0;
  return groups.map((g, gi) => slip(`<h3>${esc(g.group)}</h3>${g.note ? `<p class="note-hand">${esc(g.note)}</p>` : ''}
    <div style="margin-top:6px">${g.items.map((txt) => { const id = key + '-' + (n++); return `<label class="check"><input type="checkbox" data-id="${id}" ${cl.has(id) ? 'checked' : ''}><span>${esc(txt)}</span></label>`; }).join('')}</div>`, { key: key + gi, cls: gi % 2 ? '' : 'ruled-off' })).join('');
}

function tally(total) {
  return `<div class="slip kraft" data-key="tally"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px">
    <span class="hand" style="font-size:1.25rem" data-count></span><span class="stamp" data-stamp style="width:88px;opacity:0">${stampSVG({ top: 'READY FOR', bottom: 'THE MOUNTAINS', mid: 'PACKED', seed: 5, size: 88 })}</span></div></div>`;
}

function wireChecklist(root, key, total, word) {
  const cl = checklist(key);
  const label = root.querySelector('[data-count]');
  const stamp = root.querySelector('[data-stamp]');
  const upd = (celebrate) => {
    const c = cl.count();
    if (label) label.textContent = c === total ? `All ${total} ${word}. Well done!` : `${c} of ${total} ${word}`;
    if (stamp) {
      if (c === total) { if (celebrate) thunk(stamp); else stamp.style.opacity = '.9'; }
      else stamp.style.opacity = '0';
    }
  };
  root.querySelectorAll('input[data-id]').forEach((inp) =>
    inp.addEventListener('change', () => {
      const on = cl.toggle(inp.dataset.id);
      if (on !== inp.checked) inp.checked = on;
      haptic();
      upd(true);
      if (cl.count() === total) { const r = inp.getBoundingClientRect(); burst(r.left + 14, r.top + 14); chime(); }
    })
  );
  upd(false);
}

export function packView() {
  const total = packing.reduce((a, g) => a + g.items.length, 0);
  return {
    title: 'Packing',
    html: page(`${head('Packing', { back: '#/plan', section: 'IX · packing', folio: '31', lede: 'Mornings in the 20s up high, afternoons in the 60s and 70s. Pack like an onion: layers.' })}
      ${tally(total)}${checklistHTML('pack', packing)}
      <button class="btn line" type="button" data-reset>Uncheck everything</button>`),
    mount(root) {
      wireChecklist(root, 'pack', total, 'packed');
      root.querySelector('[data-reset]').addEventListener('click', () => {
        if (confirm('Uncheck the whole packing list?')) { checklist('pack').clear(); rerender(); }
      });
    },
  };
}

export function beforeView() {
  const groups = [{ group: 'Friday-morning checks', items: beforeWeGo.checklist }];
  return {
    title: 'Before we go',
    html: page(`${head('Before We Go', { back: '#/plan', section: 'X · before we go', folio: '33', lede: `Five minutes of checks while there’s still signal. This journal’s facts were gathered ${RETRIEVED}.` })}
      ${slip(`<div class="kicker">Conditions, as of ${esc(asOf())}</div>
        <p class="small"><b>Tioga Road (NPS):</b> ${esc(conditions.tioga || 'not captured')}</p>
        ${Object.entries(conditions.roads).map(([r, t]) => `<p class="small"><b>Caltrans ${r === '395' ? 'US' : 'CA'}-${r}:</b> ${esc(t.slice(0, 240))}…</p>`).join('')}
        ${conditions.forecasts.map((f) => `<p class="small"><b>${esc(f.place)}:</b> ${f.periods.slice(0, 3).map((p) => `${esc(p.name)} ${esc(p.temp)} ${esc(p.text)}`).join(' · ')}</p>`).join('')}`, { key: 'cond', tape: 't3' })}
      ${slip(`<div class="kicker">Check live</div><ul class="toc">${beforeWeGo.links.map((l) => `<li><a href="${l.url}" target="_blank" rel="noopener"><span><span class="t" style="font-size:1.08rem">${esc(l.name)}</span><span class="d">${esc(l.why)}</span></span><span class="dots"></span><span class="pg">${icons.ext}</span></a></li>`).join('')}</ul>`, { key: 'links' })}
      ${tally(beforeWeGo.checklist.length)}${checklistHTML('before', groups)}
      ${slip(`<h3>If Tioga is closed</h3><p>Storm closures are rare in early October, but check NPS and QuickMap first.</p>
        <ul><li><b>Sonora Pass (CA-108):</b> the best backup, ~7¼–8¼ hr. Steep (26%): car-sickness meds.</li>
        <li><b>Monitor + Carson Pass (CA-89/88):</b> ~8–8¾ hr.</li><li><b>Reno + I-80:</b> ~9½–10½ hr.</li></ul>
        <p class="note-hand">Chain controls apply to every car, 4WD included.</p>`, { key: 'tioga-closed', cls: 'kraft' })}`),
    mount(root) { wireChecklist(root, 'before', beforeWeGo.checklist.length, 'checked'); },
  };
}
