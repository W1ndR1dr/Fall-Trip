import { esc, now, hasNames } from '../ui.js';
import { leafFall } from '../fx.js';
import { mountStory } from '../story.js';
import { checklist } from '../store.js';
import { days, DEPART, HOME_BY, sun } from '../content/trip.js';
import { icons, card, findDevotion, fmtTime, tripDay } from './common.js';

const CHAPTERS = [
  { route: 'packed', art: 'vig-packed', when: 'Friday, noon', title: 'Leave home', text: 'Snacks and car-sickness supplies within reach, cocoa in the thermos. About eight hours with stops.', link: ['#/pack', 'Packing list'] },
  { route: 'orchard', art: 'vig-orchard', when: 'Friday, 2 pm', title: 'Oakdale', text: 'A 20-minute stretch: feed the goats at Oakdale Cheese, or buy apples at Bloomingcamp Ranch for caramel apples later.', link: ['#/faith/fri', 'Friday devotion'] },
  { route: 'granite', art: 'vig-granite', when: 'Friday, golden hour', title: 'Tioga Road', text: 'Last gas at Crane Flat, then Olmsted Point and Tenaya Lake as the granite turns pink. Dinner is a picnic by the lake.', link: ['#/faith/m-granite', 'Moment at Olmsted Point'] },
  { route: 'tioga', art: 'vig-home', when: 'Friday, dusk', title: 'Over Tioga Pass', text: 'California’s highest highway pass, 9,945 feet, then down to Lee Vining. Mammoth by about 8.', link: ['#/plan/fri', 'Friday, hour by hour'] },
  { route: 'tufa', art: 'vig-tufa', when: 'Saturday', title: 'Mono Lake', text: 'Tufa towers built by underwater springs, a lake saltier than the sea, and the youngest volcano in the chain five minutes away.', link: ['#/kids/rocks', 'Rocks & volcanoes'] },
  { route: 'aspens', art: 'vig-aspens', when: 'Saturday', title: 'The aspens', text: 'Lundy Canyon’s beaver ponds and Conway Summit should be near peak. June Lake’s fall festival is the same weekend.', link: ['#/kids/leaves', 'Why leaves change'] },
  { route: 'night', art: 'vig-night', when: 'Saturday night', title: 'New Moon', text: 'No moonlight at all. Full dark by 7:50: the Milky Way, Saturn, and the Summer Triangle.', link: ['#/kids/sky', 'Night sky guide'] },
  { route: 'home', art: 'vig-home', when: 'Sunday', title: 'Home', text: 'A morning devotion with a view, then back over Tioga (or Sonora Pass). Leave by 9:30, home around 6.', link: ['#/faith/sun', 'Sunday devotion'] },
];

const SECTIONS = [
  ['#/plan', 'spec-aspen', 'Plan', 'Hour by hour'],
  ['#/explore', 'spec-tufa', 'Activities', 'Optional things to do'],
  ['#/kids/hunt', 'spec-red', 'Leaf hunt', 'Eleven things to find'],
  ['#/faith', 'spec-heart', 'Devotions', 'Five minutes each'],
  ['#/color', 'spec-big', 'Color report', 'Where it’s peaking'],
  ['#/kids/sky', 'spec-obsidian', 'Night sky', 'New Moon on Saturday'],
  ['#/pack', 'spec-cone', 'Packing', 'For 20° mornings'],
  ['#/before', 'spec-granite', 'Before you go', 'Road and weather checks'],
];

function phase(t) {
  if (t < new Date(DEPART).getTime() - 3 * 3600e3) return 'before';
  if (t > new Date(HOME_BY).getTime() + 4 * 3600e3) return 'after';
  return 'during';
}

function todayCard(t) {
  const all = days.flatMap((d) => d.items.map((it) => ({ ...it, day: d })));
  const idx = all.findIndex((it) => new Date(it.t).getTime() > t);
  const cur = idx === -1 ? all[all.length - 1] : all[Math.max(0, idx - 1)];
  const next = idx === -1 ? [] : all.slice(idx, idx + 2);
  const s = sun[tripDay(new Date(t)) || 'fri'];
  const dv = findDevotion(cur.day.id);
  return card(`<span class="eyebrow">Today · ${esc(s.date)}</span><h2 style="margin-top:6px">${esc(cur.day.title)}</h2>
    <div class="rows"><span class="t">${fmtTime(cur.t)}</span><span><b>Now</b> · ${esc(cur.title)}</span>
      ${next.map((n) => `<span class="t">${fmtTime(n.t)}</span><span><b>Next</b> · ${esc(n.title)}</span>`).join('')}</div>
    <div class="sunline"><span>Sunrise <b>${s.sunrise}</b></span><span>Golden hour <b>${s.goldenPM.split('–')[0]}</b></span><span>Sunset <b>${s.sunset}</b></span><span>Dark <b>${s.dark}</b></span></div>
    <div class="btn-row"><a class="btn small" href="#/plan/${cur.day.id}">${icons.plan}Today’s plan</a>${dv ? `<a class="btn small secondary" href="#/faith/${dv.id}">${icons.book}Devotion</a>` : ''}</div>`, 'today');
}

export function home() {
  const t = now().getTime();
  const ph = phase(t);
  const ms = Math.max(0, new Date(DEPART).getTime() - t);
  const d = Math.floor(ms / 86400e3), h = Math.floor((ms % 86400e3) / 3600e3), m = Math.floor((ms % 3600e3) / 60e3);
  const standalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  const found = [0, 1, 2].reduce((a, i) => a + checklist('hunt:' + i).count(), 0);

  const hero = `<section class="hero" aria-label="Fall Trip"><img class="art art-hero" src="img/art/hero.webp" alt="A watercolor of golden aspens below snowy peaks"></section>
    <div class="hero-text"><h1 class="title">Fall <em>Trip</em></h1>
      <p class="sub">Eastern Sierra · October 9–11, 2026</p>
      ${ph === 'before' ? `<div class="countdown" role="timer" aria-label="${d} days, ${h} hours until we leave"><div><b data-cd="d">${d}</b><span>days</span></div><div><b data-cd="h">${h}</b><span>hours</span></div><div><b data-cd="m">${m}</b><span>min</span></div><span class="until">until Friday at noon</span></div>` : ''}
      ${ph === 'after' ? `<p class="read" style="margin-top:18px">Welcome home. <a href="#/faith/lookback">Look back at the weekend together →</a></p>` : ''}
    </div>`;

  const today = ph === 'during' ? `<div class="page" style="padding-top:24px">${todayCard(t)}</div>` : '';

  const story = `<section class="story" aria-label="The route, day by day"><div class="story-stage" aria-hidden="true"><div class="story-label">The route <span>· scroll to follow</span></div></div>
    <div class="story-steps">${CHAPTERS.map((ch) => `<div class="story-step">${card(`<span class="eyebrow">${esc(ch.when)}</span><h3>${esc(ch.title)}</h3>
      <img class="art" src="img/art/${ch.art}.webp" alt="" loading="lazy"><p>${esc(ch.text)}</p><a class="textlink" href="${ch.link[0]}">${esc(ch.link[1])} →</a>`)}</div>`).join('')}</div></section>`;

  const rest = `<div class="page">
    <div class="section" style="margin-top:28px"><div class="section-title"><h2>Everything</h2></div>
      <nav class="quick" aria-label="Sections">${SECTIONS.map(([hh, a, tt, dd]) => `<a href="${hh}"><img class="art" src="img/art/${a}.webp" alt="" loading="lazy"><b>${tt}</b><span>${hh === '#/kids/hunt' && found ? `${found} found so far` : dd}</span></a>`).join('')}</nav></div>
    ${!hasNames() ? `<div class="section">${card(`<h3>Add the kids’ names</h3><p class="muted">So the leaf hunt, reading turns, and journal know who’s who. Names are stored only on this device.</p><div class="btn-row"><a class="btn small" href="#/settings">${icons.gear}Add names</a></div>`)}</div>` : ''}
    ${!standalone ? `<div class="section">${card(`<h3>Install on your Home Screen</h3><p class="muted">It then opens without a signal, which matters on Tioga Road and in the canyons.</p><div class="btn-row"><a class="btn small secondary" href="#/install">${icons.share}How to install</a></div>`, 'tint')}</div>` : ''}
    <p class="foot"><a href="#/about">About & sources</a> · <a href="#/settings">Settings</a></p></div>`;

  return {
    title: '',
    html: hero + today + story + rest,
    mount(root) {
      const stops = [leafFall(root.querySelector('.hero'), { count: 9 }), mountStory(root, CHAPTERS)];
      const timer = setInterval(() => {
        const ms2 = Math.max(0, new Date(DEPART).getTime() - now().getTime());
        const v = { d: Math.floor(ms2 / 86400e3), h: Math.floor((ms2 % 86400e3) / 3600e3), m: Math.floor((ms2 % 3600e3) / 60e3) };
        for (const k in v) { const el = root.querySelector(`[data-cd="${k}"]`); if (el) el.textContent = v[k]; }
      }, 30000);
      return () => { stops.forEach((s) => s && s()); clearInterval(timer); };
    },
  };
}
