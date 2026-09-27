import * as store from '../store.js';
import { esc, now, hasNames, kids } from '../ui.js';
import { leaves, things, icons, tracks as trackArt } from '../art.js';
import { leafFall } from '../fx.js';
import { mountStory } from '../story.js';
import { days, DEPART, HOME_BY, sun } from '../content/trip.js';
import { findDevotion, fmtTime, tripDay } from './common.js';
import { checklist } from '../store.js';
import { hunt } from '../content/kids.js';

const CHAPTERS = [
  { look: 'home', when: 'Friday, noon', title: 'The car is packed', text: 'Cocoa in the thermos, crayons in the seat pockets, and five of us pointed east. Somewhere past the hills, the season is changing.', link: ['#/pack', 'Packing list'] },
  { look: 'orchard', when: 'Friday afternoon · Oakdale', title: 'Seedtime and harvest', text: 'Orchards in rows, apples on the stands, and goats who will eat right out of your hand. Everything here is being gathered in.', link: ['#/faith/fri', 'Friday devotion'] },
  { look: 'granite', when: 'Friday golden hour · Tioga Road', title: 'Up to the granite', text: 'Glaciers polished these domes smooth. We climb to 9,945 feet, the highest highway pass in California, as the sun turns the rock pink.', link: ['#/faith/m-granite', '"The sky is talking"'] },
  { look: 'lake', when: 'Saturday · Mono Lake', title: 'Towers grown by springs', text: 'A lake saltier than the ocean, full of tiny brine shrimp. Its tufa towers grew where spring water bubbled up, a little at a time, for hundreds of years.', link: ['#/kids/rocks', 'Rocks & volcanoes'] },
  { look: 'aspen', when: 'Saturday · Lundy & Conway', title: 'Into the gold', text: 'The gold was inside every aspen leaf all summer, hidden under the green. Now it shines. Listen: the leaves quake and clap. Look: a beaver was here.', link: ['#/kids/leaves', 'Why leaves change'] },
  { look: 'night', when: 'Saturday night · New Moon', title: 'The darkest sky of the month', text: 'No moon at all. Just the Milky Way, golden Saturn, and more stars than we can count. He knows every one by name.', link: ['#/kids/sky', 'Night sky guide'] },
  { look: 'west', when: 'Sunday · The Lord\'s Day', title: 'Home again, grateful', text: 'A morning with a view, a song, and one whispered thank-you each. Then down the mountains with pockets full of leaves.', link: ['#/faith/sun', 'Sunday devotion'] },
];

function countdownParts(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60) };
}

function phase(t) {
  const dep = new Date(DEPART).getTime();
  const end = new Date(HOME_BY).getTime();
  if (t < dep - 3 * 3600e3) return 'before';
  if (t > end + 4 * 3600e3) return 'after';
  return 'during';
}

function nextItems(t) {
  const all = days.flatMap((d) => d.items.map((it) => ({ ...it, day: d })));
  const idx = all.findIndex((it) => new Date(it.t).getTime() > t);
  const current = idx === -1 ? all[all.length - 1] : all[Math.max(0, idx - 1)];
  const next = idx === -1 ? [] : all.slice(idx, idx + 2);
  return { current, next };
}

function todayCard(t) {
  const { current, next } = nextItems(t);
  const dayId = tripDay(new Date(t)) || 'fri';
  const s = sun[dayId];
  const dv = findDevotion(dayId);
  return `<section class="card today" aria-labelledby="today-h">
    <div class="kicker">${esc(s.date)} · Today</div>
    <h2 id="today-h">${esc(current.day.title)}</h2>
    <div class="next" style="margin-top:10px">
      <div class="time">${fmtTime(current.t)}</div>
      <div><b>Now-ish:</b> ${esc(current.title)}<div class="muted small">${esc(current.text)}</div></div>
      ${next.map((n) => `<div class="time">${fmtTime(n.t)}</div><div><b>Next:</b> ${esc(n.title)}</div>`).join('')}
    </div>
    <div class="sunbar" style="margin-top:12px">
      <div><span>Sunrise</span><b>${s.sunrise}</b></div>
      <div><span>Golden hr</span><b>${s.goldenPM.split('–')[0]}</b></div>
      <div><span>Sunset</span><b>${s.sunset}</b></div>
      <div><span>Dark</span><b>${s.dark}</b></div>
    </div>
    <div class="btn-row"><a class="btn" href="#/plan/${current.day.id}">${icons.plan}Full day</a>
    ${dv ? `<a class="btn ghost" href="#/faith/${dv.id}">${icons.faith}Today's devotion</a>` : ''}
    <a class="btn ghost" href="#/explore">${icons.explore}What else?</a></div>
  </section>`;
}

function quickLinks() {
  const h = checklist('hunt:0').count() + checklist('hunt:1').count() + checklist('hunt:2').count();
  return `<nav class="quick" aria-label="Quick links">
    <a href="#/plan">${leaves.aspen()}<b>The plan</b><span>Hour by hour, with room to breathe</span></a>
    <a href="#/explore">${things.cocoa()}<b>Pick an adventure</b><span>A menu of optional fun</span></a>
    <a href="#/kids/hunt">${leaves.red()}<b>Leaf hunt</b><span>${h ? `${h} treasures found` : '3 explorers, 14 treasures'}</span></a>
    <a href="#/faith">${things.book()}<b>Devotions</b><span>Look · Read · Wonder · Pray · Do</span></a>
    <a href="#/color">${leaves.big()}<b>Color report</b><span>Where the gold is</span></a>
    <a href="#/kids/sky">${things.moon(0.12, true)}<b>Night sky</b><span>New Moon on Saturday</span></a>
    <a href="#/pack">${things.pumpkin()}<b>Packing list</b><span>Layers for 20s to 70s</span></a>
    <a href="#/before">${things.apple()}<b>Before we go</b><span>Morning-of checks</span></a>
  </nav>`;
}

export function home() {
  const t = now().getTime();
  const ph = phase(t);
  const c = countdownParts(new Date(DEPART).getTime() - t);
  const standalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  const hello = hasNames() ? `Hi, ${kids().map(esc).join(', ')}!` : 'Welcome, explorers!';

  const hero = `<section class="hero" aria-label="Welcome">
    <div class="leafmark" aria-hidden="true">${leaves.aspen()}</div>
    <div class="hero-inner">
      <div class="kicker">Eastern Sierra · Oct 9–11</div>
      <h1>Fall Trip</h1>
      <p class="lede" style="margin-top:6px">${hello} A weekend to notice the beauty God made, together.</p>
      ${ph === 'before' ? `<div class="count" role="timer" aria-label="Countdown to departure">
        <div><b data-cd="d">${c.d}</b><span>days</span></div><div><b data-cd="h">${c.h}</b><span>hours</span></div><div><b data-cd="m">${c.m}</b><span>min</span></div></div>
        <p class="muted small">until we roll out (Friday at noon)</p>` : ''}
      ${ph === 'after' ? `<p class="lede">We made it home. <a href="#/faith/lookback">Look back at the weekend together →</a></p>` : ''}
    </div>
  </section>`;

  const today = ph === 'during' ? `<div class="page" style="padding-top:8px">${todayCard(t)}</div>` : '';

  const story = `<section class="story" aria-label="Our trip, as a story">
    <div class="story-stage" aria-hidden="true"></div>
    <div class="story-steps">
      ${CHAPTERS.map((ch, i) => `<div class="story-step" data-i="${i}"><article class="card">
        <div class="when">${esc(ch.when)}</div><h3>${esc(ch.title)}</h3><p>${esc(ch.text)}</p>
        <a class="btn ghost small" href="${ch.link[0]}">${esc(ch.link[1])} →</a></article></div>`).join('')}
    </div>
  </section>`;

  const end = `<div class="page story-end">
    ${ph === 'before' ? '' : ''}
    <div class="section"><h2>Jump in</h2>${quickLinks()}</div>
    ${!standalone ? `<div class="card section"><h3>Keep it on your Home Screen</h3><p class="muted">Works with no signal in the canyons once it's installed.</p><a class="btn gold" href="#/install">${icons.share}How to install</a></div>` : ''}
    ${!hasNames() ? `<div class="card section"><h3>Who's exploring?</h3><p class="muted">Add the kids' names so the hunt, reading turns, and journal know who's who. Names stay on this device only.</p><a class="btn" href="#/settings">${icons.gear}Add names</a></div>` : ''}
    <p class="footer-note"><a href="#/about">About, credits & sources</a> · <a href="#/settings">Settings</a></p>
  </div>`;

  return {
    title: '',
    html: hero + today + story + end,
    mount(root) {
      const stops = [];
      stops.push(leafFall(root.querySelector('.hero'), { count: 12 }));
      stops.push(mountStory(root.querySelector('.story'), CHAPTERS));
      const timer = setInterval(() => {
        const p = countdownParts(new Date(DEPART).getTime() - now().getTime());
        for (const k of ['d', 'h', 'm']) {
          const el = root.querySelector(`[data-cd="${k}"]`);
          if (el) el.textContent = p[k];
        }
      }, 30000);
      return () => { stops.forEach((s) => s && s()); clearInterval(timer); };
    },
  };
}
