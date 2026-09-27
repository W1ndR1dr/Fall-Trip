import { esc, now, hasNames, kids } from '../ui.js';
import { leafFall } from '../fx.js';
import { mountStory } from '../story.js';
import { checklist } from '../store.js';
import { days, DEPART, HOME_BY, sun } from '../content/trip.js';
import { art, icons, slip, findDevotion, fmtTime, tripDay } from './common.js';

const CHAPTERS = [
  { route: 'packed', art: 'vig-packed', when: 'Friday · noon', title: 'The car is packed', text: 'Cocoa in the thermos, crayons in the seat pockets, and five of us pointed east. Somewhere past the hills, the season is changing.', link: ['#/pack', 'The packing list'] },
  { route: 'orchard', art: 'vig-orchard', when: 'Friday afternoon · Oakdale', title: 'Seedtime and harvest', text: 'Orchards in rows, apples on the stands, and goats who will eat right out of your hand. Everything here is being gathered in.', link: ['#/faith/fri', 'Friday’s devotion'] },
  { route: 'granite', art: 'vig-granite', when: 'Friday golden hour · Tioga Road', title: 'Up to the granite', text: 'Glaciers polished these domes smooth. As the sun goes low, the rock turns pink and the whole sky seems to be talking.', link: ['#/faith/m-granite', '“The sky is talking”'] },
  { route: 'tioga', art: 'vig-home', when: 'Friday dusk · 9,945 feet', title: 'Over the top', text: 'The highest highway pass in California, then down the long grade to Mono Lake in the last light. Mammoth by bedtime.', link: ['#/plan/fri', 'Friday, hour by hour'] },
  { route: 'tufa', art: 'vig-tufa', when: 'Saturday · Mono Lake', title: 'Towers grown by springs', text: 'A lake saltier than the ocean, full of tiny brine shrimp. Its tufa towers grew where spring water bubbled up, a little at a time, for hundreds of years.', link: ['#/kids/rocks', 'Rocks & volcanoes'] },
  { route: 'aspens', art: 'vig-aspens', when: 'Saturday · Lundy & June Lake', title: 'Into the gold', text: 'The gold was inside every aspen leaf all summer, hidden under the green. Listen: the leaves quake and clap. Look closer: a beaver was here.', link: ['#/kids/leaves', 'Why leaves change'] },
  { route: 'night', art: 'vig-night', when: 'Saturday night · New Moon', title: 'The darkest sky of the month', text: 'No moon at all. Just the Milky Way, golden Saturn, and more stars than we can count. He knows every one by name.', link: ['#/kids/sky', 'The night-sky guide'] },
  { route: 'home', art: 'vig-home', when: 'Sunday · the Lord’s Day', title: 'Home again, grateful', text: 'A morning with a view, a song, and one whispered thank-you each. Then down the mountains with our pockets full of leaves.', link: ['#/faith/sun', 'Sunday’s devotion'] },
];

const TOC = [
  ['#/plan', 'The Plan', 'hour by hour, with room to breathe', 'II'],
  ['#/explore', 'Adventures', 'a menu of optional fun', 'III'],
  ['#/kids/hunt', 'The Leaf Hunt', 'three explorers, eleven treasures', 'IV'],
  ['#/faith', 'Devotions', 'look · read · wonder · pray · do', 'V'],
  ['#/color', 'Where the Gold Is', 'this week’s color report', 'VI'],
  ['#/kids/sky', 'The Night Sky', 'a New Moon weekend', 'VII'],
  ['#/kids', 'Explorer HQ', 'tracks, rocks, games, crafts', 'VIII'],
  ['#/pack', 'Packing', 'layers for the 20s to the 70s', 'IX'],
  ['#/before', 'Before We Go', 'Friday-morning checks', 'X'],
];

const countdown = (ms) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600) };
};
function phase(t) {
  if (t < new Date(DEPART).getTime() - 3 * 3600e3) return 'before';
  if (t > new Date(HOME_BY).getTime() + 4 * 3600e3) return 'after';
  return 'during';
}

const emblem = () => `<svg class="emblem" viewBox="0 0 140 170" aria-hidden="true"><defs>
  <linearGradient id="foil" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f7e2a0"/><stop offset=".35" stop-color="#d9ab4a"/><stop offset=".55" stop-color="#f3d587"/><stop offset="1" stop-color="#a97a26"/></linearGradient></defs>
  <g transform="rotate(-10 70 80)"><path d="M70 12C104 36 124 70 120 100C116 126 94 136 70 130C46 136 24 126 20 100C16 70 36 36 70 12Z" fill="url(#foil)"/>
  <path d="M70 22V128M70 56L100 42M70 56L40 42M70 82L106 70M70 82L34 70M70 106L100 98M70 106L40 98" stroke="#7a5518" stroke-width="2" fill="none" stroke-linecap="round" opacity=".55"/>
  <path d="M67 130h6v34h-6z" fill="url(#foil)"/></g>
  <circle cx="70" cy="80" r="66" fill="none" stroke="url(#foil)" stroke-width="1.5" stroke-dasharray="2 5"/></svg>`;

function todaySlip(t) {
  const all = days.flatMap((d) => d.items.map((it) => ({ ...it, day: d })));
  const idx = all.findIndex((it) => new Date(it.t).getTime() > t);
  const cur = idx === -1 ? all[all.length - 1] : all[Math.max(0, idx - 1)];
  const next = idx === -1 ? [] : all.slice(idx, idx + 2);
  const s = sun[tripDay(new Date(t)) || 'fri'];
  const dv = findDevotion(cur.day.id);
  return slip(`<span class="tape corner-l"></span><div class="kicker">${esc(s.date)} · today</div><h2>${esc(cur.day.title)}</h2>
    <div class="today-grid" style="margin-top:10px">
      <span class="t">${fmtTime(cur.t)}</span><span><b>Now-ish:</b> ${esc(cur.title)}</span>
      ${next.map((n) => `<span class="t">${fmtTime(n.t)}</span><span><b>Next:</b> ${esc(n.title)}</span>`).join('')}
    </div>
    <p class="typed small muted" style="margin-top:10px">SUNRISE ${s.sunrise} · GOLDEN ${s.goldenPM.split('–')[0]} · SUNSET ${s.sunset} · DARK ${s.dark}</p>
    <div class="btn-row"><a class="btn small" href="#/plan/${cur.day.id}">${icons.plan}The whole day</a>${dv ? `<a class="btn line small" href="#/faith/${dv.id}">${icons.faith}Today’s devotion</a>` : ''}</div>`, { key: 'today' });
}

export function home() {
  const t = now().getTime();
  const ph = phase(t);
  const c = countdown(new Date(DEPART).getTime() - t);
  const standalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  const names = hasNames() ? kids().map(esc).join(', ') : '';
  const found = [0, 1, 2].reduce((a, i) => a + checklist('hunt:' + i).count(), 0);

  const cover = `<section class="cover" aria-label="Fall Trip journal cover"><span class="spine"></span><span class="band"></span>
    <div class="foil">${emblem()}<h1>Fall Trip</h1><div class="sub">AN EASTERN SIERRA FIELD JOURNAL</div>
      <svg class="rule" viewBox="0 0 160 10" aria-hidden="true"><path d="M2 5h60M98 5h60" stroke="currentColor" stroke-width="1.2"/><path d="M80 1l4 4-4 4-4-4z" fill="currentColor"/></svg>
      <div class="sub" style="letter-spacing:.12em">OCTOBER 9 – 11 · MMXXVI</div></div>
    ${ph === 'before' ? `<div class="luggage" role="timer" aria-label="${c.d} days and ${c.h} hours until we leave"><div class="kicker" style="color:#6b3a1a">departs Friday, noon</div>
      <div class="count">${c.d}<small> days</small> ${c.h}<small> hrs</small></div><span class="typed">${names ? 'EXPLORERS: ' + names.toUpperCase() : 'PROPERTY OF THE EXPLORERS'}</span></div>` : ''}
    ${ph === 'after' ? `<div class="luggage"><div class="count" style="font-size:1.6rem">Welcome home</div><a class="typed" href="#/faith/lookback">look back together →</a></div>` : ''}
    <div class="open-hint">open the journal ↓</div></section>`;

  const today = ph === 'during' ? `<div class="page">${todaySlip(t)}</div>` : '';

  const story = `<section class="mapstory" aria-label="Our route, as a story"><div class="map-stage" aria-hidden="true"><div class="cartouche"><span class="hand">Our road to the gold</span><span class="typed">not to scale · east is up</span></div></div>
    <div class="map-steps">${CHAPTERS.map((ch, i) => `<div class="map-step">${slip(`<span class="tape ${['', 't2', 't3'][i % 3]}"></span>
      <img class="art vignette" src="img/art/${ch.art}.webp" alt="" loading="lazy"><div class="when">${esc(ch.when)}</div><h3>${esc(ch.title)}</h3><p>${esc(ch.text)}</p>
      <a class="note-hand arrow" href="${ch.link[0]}">${esc(ch.link[1])}</a>`, { key: 'ch' + i })}</div>`).join('')}</div></section>`;

  const contents = `<div class="page">
    ${slip(`<div class="kicker">Contents</div><h2 style="margin-bottom:6px">In this journal</h2>
      <ol class="toc">${TOC.map(([h, tt, d, n]) => `<li><a href="${h}"><span class="num">${n}.</span><span><span class="t">${esc(tt)}</span><span class="d">${esc(d)}${h === '#/kids/hunt' && found ? ` · ${found} found so far` : ''}</span></span><span class="dots"></span><span class="pg">${icons.back.replace('class="ico"', 'class="ico" style="transform:scaleX(-1)"')}</span></a></li>`).join('')}</ol>`, { key: 'toc', tape: 'corner-r' })}
    ${!hasNames() ? slip(`<h3>Who’s exploring?</h3><p>Write the kids’ names in the front of the journal so the hunt, reading turns, and gratitude pages know who’s who. <span class="muted">Names stay on this device only.</span></p><a class="btn small" href="#/settings">${icons.gear}Write names</a>`, { cls: 'kraft', key: 'names' }) : ''}
    ${!standalone ? slip(`<h3>Keep it in your pocket</h3><p>Add Fall Trip to the Home Screen so it opens with no signal in the canyons.</p><a class="btn gold small" href="#/install">${icons.share}How to install</a>`, { key: 'install' }) : ''}
    <p class="footer-note"><a href="#/about">about, credits & sources</a> · <a href="#/settings">settings</a></p></div>`;

  return {
    title: '',
    html: cover + today + story + contents,
    mount(root) {
      const stops = [leafFall(root.querySelector('.cover'), { count: 10 }), mountStory(root, CHAPTERS)];
      return () => stops.forEach((s) => s && s());
    },
  };
}
