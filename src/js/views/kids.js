import * as store from '../store.js';
import { checklist } from '../store.js';
import { esc, kids, chime, haptic, reducedMotion } from '../ui.js';
import { bloomIn, pop, tick, drawOn } from '../hand.js';
import { burst } from '../fx.js';
import { hunt, leafScience, tracks, rocks, carGames, trivia, drawPrompts, sky } from '../content/kids.js';
import { recipes, activities } from '../content/trip.js';
import { head, page, card, icons, rerender } from './common.js';

const SPEC = { aspen: 'spec-aspen', cottonwood: 'spec-cottonwood', willow: 'spec-willow', birch: 'spec-birch', red: 'spec-red', big: 'spec-big', heart: 'spec-heart', cone: 'spec-cone', granite: 'spec-granite', dam: 'spec-dam', tufa: 'spec-tufa', eyes: 'spec-eyes', track: 'track-deer', obsidian: 'spec-obsidian' };
const LATIN = { aspen: 'Populus tremuloides', cottonwood: 'Populus trichocarpa', willow: 'Salix', birch: 'Betula occidentalis', red: 'Acer glabrum', cone: 'Pinus jeffreyi', eyes: 'Populus tremuloides', obsidian: 'volcanic glass', tufa: 'calcium carbonate' };
const ROCKART = { granite: 'spec-granite', tufa: 'spec-tufa', obsidian: 'spec-obsidian', pumice: 'spec-granite', panum: 'spec-obsidian', caldera: 'vig-night', islands: 'vig-tufa' };

const checkRow = (id, on, labelHTML) => `<label class="checkrow"><input type="checkbox" data-id="${id}" ${on ? 'checked' : ''}><span class="box">${tick()}</span><span class="label">${labelHTML}</span></label>`;
function wireChecks(root, cl) {
  root.querySelectorAll('input[data-id]').forEach((i) => i.addEventListener('change', () => {
    const on = cl.toggle(i.dataset.id);
    i.checked = on;
    haptic();
    if (on) { drawOn(i.nextElementSibling.querySelector('svg'), { ms: 260 }); const r = i.getBoundingClientRect(); burst(r.left + 12, r.top + 12, { n: 10 }); chime([784, 988]); }
  }));
}

export function kidsHome() {
  const tiles = [
    ['#/kids/hunt', 'spec-aspen', 'Leaf hunt', '11 things to find'],
    ['#/kids/leaves', 'sci-red', 'Why leaves change', 'Scroll and watch'],
    ['#/kids/tracks', 'track-beaver', 'Animal tracks', '8 to look for'],
    ['#/kids/rocks', 'spec-tufa', 'Rocks & volcanoes', 'Tufa, obsidian, lava'],
    ['#/kids/sky', 'vig-night', 'Night sky', 'New Moon Saturday'],
    ['#/kids/draw', 'spec-heart', 'Draw & make', 'Rubbings and pressing'],
    ['#/kids/games', 'vig-packed', 'Car games', 'Games and trivia'],
    ['#/kids/photos', 'vig-aspens', 'Photo list', '12 family photos'],
    ['#/kids/cozy', 'spec-red', 'Recipes', 'Cocoa and caramel apples'],
  ];
  return {
    title: 'Kids',
    html: page(`${head('Kids', { lede: 'Things to find, read, and make.' })}
      <div class="tiles">${tiles.map(([h, a, t, s]) => `<a href="${h}"><div class="pic"><img class="art ${a.startsWith('vig') ? 'wide' : ''}" src="img/art/${a}.webp" alt="" loading="lazy"></div><div class="txt"><b>${t}</b><span>${s}</span></div></a>`).join('')}</div>`),
  };
}

// ---------------- Leaf hunt: one list per child ----------------
export function huntView() {
  const k = kids();
  const who = Math.min(2, Math.max(0, store.get('huntKid', 0)));
  const cl = checklist('hunt:' + who);
  const core = hunt.filter((h) => !h.bonus);
  const done = core.filter((h) => cl.has(h.id)).length;
  return {
    title: 'Leaf hunt',
    html: page(`${head('Leaf hunt', { back: '#/kids', lede: 'Tap a card when you find it. Each explorer has their own list.' })}
      <div class="segmented" role="group" aria-label="Whose list">${k.map((n, i) => `<button type="button" data-kid="${i}" aria-pressed="${i === who}">${esc(n)}</button>`).join('')}</div>
      ${card(`<div class="tally"><span><span class="eyebrow">${esc(k[who])}</span></span><b data-count>${done} / ${core.length}</b></div>
        <div class="progress"><i style="width:${(100 * done) / core.length}%"></i></div>
        <p class="small" data-done style="margin-top:10px" ${done === core.length ? '' : 'hidden'}><b>All ${core.length} found.</b> Well done!</p>`).replace('<div class="card ', '<div style="margin:16px 0 18px" class="card ')}
      <div class="hunt">${hunt.map((h) => `<button type="button" class="find" data-id="${h.id}" aria-pressed="${cl.has(h.id)}">
        <span class="tick">${tick()}</span>
        <span class="pic"><img src="img/art/${SPEC[h.id]}.webp" alt="" loading="lazy"></span>
        ${h.bonus ? '<span class="bonus">Bonus</span>' : ''}<b>${esc(h.name)}</b>${LATIN[h.id] ? `<span class="latin">${esc(LATIN[h.id])}</span>` : ''}
        <span class="hint">${esc(h.hint)}</span></button>`).join('')}</div>`),
    mount(root) {
      root.querySelectorAll('[data-kid]').forEach((b) => b.addEventListener('click', () => { store.set('huntKid', +b.dataset.kid); rerender(); }));
      root.querySelectorAll('.find').forEach((b) => b.addEventListener('click', () => {
        const on = cl.toggle(b.dataset.id);
        b.setAttribute('aria-pressed', on);
        haptic();
        const n = core.filter((h) => cl.has(h.id)).length;
        root.querySelector('[data-count]').textContent = `${n} / ${core.length}`;
        root.querySelector('.progress i').style.width = (100 * n) / core.length + '%';
        root.querySelector('[data-done]').hidden = n !== core.length;
        if (on) {
          bloomIn(b.querySelector('.pic img'));
          pop(b.querySelector('.tick'));
          drawOn(b.querySelector('.tick svg'), { ms: 300 });
          const r = b.getBoundingClientRect();
          burst(r.left + r.width / 2, r.top + r.height / 3, { n: 14 });
          chime();
          if (n === core.length) setTimeout(() => { burst(window.innerWidth / 2, 200, { n: 40 }); chime([523, 659, 784, 1047]); }, 350);
        }
      }));
    },
  };
}

// ---------------- Why leaves change ----------------
export function leavesView() {
  const s = leafScience;
  const steps = [
    { title: 'Summer', text: s.intro, at: 0 },
    ...s.steps.map((st, i) => ({ ...st, at: [0.05, 0.4, 0.68, 1][i] })),
    { title: 'Something to wonder about', text: s.wonder, at: 1 },
  ];
  const PIG = { chl: '#5e9b3a', car: '#e2ab22', ant: '#c2412d' };
  return {
    title: 'Why leaves change',
    html: page(`${head('Why leaves change', { back: '#/kids', lede: 'Scroll slowly and watch the leaf. Or drag the slider.' })}
      <section class="science">
        <div class="science-stage"><div style="display:grid;justify-items:center">
          <div class="leafbox"><img class="art" data-l="green" src="img/art/sci-green.webp" alt="An aspen leaf changing color from green to gold">
            <img class="art" data-l="gold" src="img/art/spec-aspen.webp" alt="" style="opacity:0"><img class="art" data-l="red" src="img/art/sci-red.webp" alt="" style="opacity:0"></div>
          <div class="pigments">${s.pigments.map((p) => `<div class="pigment"><span>${p.name}</span><span><i data-pig="${p.key}" style="background:${PIG[p.key]}"></i></span></div>`).join('')}</div>
          <label class="small muted" style="margin-top:8px;display:flex;gap:10px;align-items:center">Summer <input type="range" min="0" max="100" value="0" data-season aria-label="Season, summer to fall"> Fall</label>
        </div></div>
        <div class="science-steps">${steps.map((st) => `<div class="card" data-at="${st.at}"><h3>${esc(st.title)}</h3><p>${esc(st.text)}</p></div>`).join('')}
          ${card(`<h3>The three colors</h3>${s.pigments.map((p) => `<p><span style="color:${PIG[p.key]}">●</span> <b>${p.name}.</b> ${esc(p.kid)}</p>`).join('')}`)}
          ${card(`<h3>Aspen facts</h3>${s.bonus.map((b) => `<p>${esc(b)}</p>`).join('')}<div class="actions"><a class="btn small" href="#/kids/hunt">Find a flat aspen stem</a></div>`)}
        </div></section>`),
    mount(root) {
      const L = Object.fromEntries([...root.querySelectorAll('[data-l]')].map((e) => [e.dataset.l, e]));
      const bars = Object.fromEntries([...root.querySelectorAll('[data-pig]')].map((e) => [e.dataset.pig, e]));
      const range = root.querySelector('[data-season]');
      let manual = false;
      function set(p) {
        const chl = 1 - Math.min(1, Math.max(0, (p - 0.2) / 0.45));
        const ant = Math.max(0, (p - 0.7) / 0.3);
        L.gold.style.opacity = (1 - chl).toFixed(3);
        L.red.style.opacity = (ant * 0.9).toFixed(3);
        bars.chl.style.width = chl * 92 + 4 + '%';
        bars.car.style.width = '74%';
        bars.car.style.opacity = (0.3 + 0.7 * (1 - chl)).toFixed(2);
        bars.ant.style.width = ant * 62 + '%';
        range.value = Math.round(p * 100);
      }
      range.addEventListener('input', () => { manual = true; set(range.value / 100); });
      let ticking = false;
      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          ticking = false;
          if (manual) return;
          const line = window.innerHeight * 0.66;
          const cards = [...root.querySelectorAll('[data-at]')].map((c) => { const r = c.getBoundingClientRect(); return { y: r.top + r.height / 2, at: +c.dataset.at }; });
          let p = cards[0].at;
          for (let i = 0; i < cards.length; i++) {
            if (cards[i].y <= line) p = cards[i].at;
            else { if (i > 0) { const a = cards[i - 1], b = cards[i]; p = a.at + (b.at - a.at) * Math.min(1, Math.max(0, (line - a.y) / (b.y - a.y))); } break; }
          }
          set(reducedMotion() ? Math.round(p * 4) / 4 : p);
        });
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('touchstart', () => (manual = false), { passive: true });
      set(0);
      return () => window.removeEventListener('scroll', onScroll);
    },
  };
}

export function tracksView() {
  const cl = checklist('tracks');
  return {
    title: 'Animal tracks',
    html: page(`${head('Animal tracks', { back: '#/kids', lede: 'Look in mud, sand, and dust near water, early in the morning.' })}
      <div class="grid two">${tracks.map((t) => card(`<div class="track"><img class="art" src="img/art/track-${t.id}.webp" alt="${esc(t.name)} track" loading="lazy"><div>
        <h3>${esc(t.name)}</h3><p style="margin:4px 0 0">${esc(t.clue)}</p><p class="small muted" style="margin:4px 0 0">${esc(t.where)}</p></div></div>
        <div style="margin-top:6px">${checkRow(t.id, cl.has(t.id), 'We saw one')}</div>`)).join('')}</div>
      <p class="small muted" style="margin-top:18px">Never feed wildlife. Keep food in the car or indoors; black bears live here.</p>`),
    mount: (root) => wireChecks(root, cl),
  };
}

export function rocksView() {
  return {
    title: 'Rocks & volcanoes',
    html: page(`${head('Rocks & volcanoes', { back: '#/kids', lede: 'Some of this land is younger than castles.' })}
      <div class="grid two">${rocks.map((r) => card(`${ROCKART[r.id] ? `<img class="art" src="img/art/${ROCKART[r.id]}.webp" alt="" loading="lazy" style="${ROCKART[r.id].startsWith('vig') ? 'width:100%;border-radius:10px;margin-bottom:12px' : 'width:84px;float:right;margin:0 0 6px 10px'}">` : ''}
        <h3>${esc(r.title)}</h3><p class="small faint" style="margin-top:4px">${esc(r.where)}</p><p>${esc(r.text)}</p>`)).join('')}</div>
      <p class="small muted" style="margin-top:18px">Look, touch, and take pictures, but leave rocks, obsidian, and pumice where you found them.</p>`),
  };
}

export function skyView() {
  const cl = checklist('sky');
  return {
    title: 'Night sky',
    html: page(`${head('Night sky', { back: '#/kids', eyebrow: 'Saturday, October 10 · New Moon', lede: sky.moon.note })}
      <img class="art" src="img/art/vig-night.webp" alt="" style="width:100%;max-width:560px;border-radius:14px;margin-bottom:18px">
      <p class="read">${esc(sky.timing)}</p>
      <div class="section">${card(`<span class="eyebrow">Things to find</span><div style="margin-top:6px">${sky.finds.map((f) => checkRow(f.id, cl.has(f.id), `<b>${esc(f.name)}</b><small>${esc(f.how)} <span class="faint">${esc(f.when)}.</span></small>`)).join('')}</div>`)}</div>
      <div class="section">${card(`<span class="eyebrow">Tips</span><ul style="margin:8px 0 0;padding-left:1.1em">${sky.tips.map((t) => `<li style="margin:6px 0">${esc(t)}</li>`).join('')}</ul>`, 'tint')}</div>
      <div class="btn-row"><a class="btn" href="#/faith/m-stars">${icons.book}Devotion: He names the stars</a></div>
      <p class="small muted" style="margin-top:16px">Dark mode (Settings) is easier on your night vision.</p>`),
    mount: (root) => wireChecks(root, cl),
  };
}

export function gamesView() {
  return {
    title: 'Car games',
    html: page(`${head('Car games', { back: '#/kids' })}
      <div class="grid two">${carGames.map((g) => card(`<h3>${esc(g.title)}</h3><p class="muted">${esc(g.text)}</p>`)).join('')}</div>
      <div class="section">${card(`<span class="eyebrow">Trivia</span><div style="margin-top:4px">${trivia.map((t) => `<details class="qa"><summary>${esc(t.q)}</summary><p>${esc(t.a)}</p></details>`).join('')}</div>`)}</div>
      <p class="small muted" style="margin-top:16px">Car sickness: eyes on the horizon, a window cracked, crackers handy. Skip the games on the curviest stretches.</p>`),
  };
}

export function drawView() {
  const { rubbing, pressing } = activities;
  return {
    title: 'Draw & make',
    html: page(`${head('Draw & make', { back: '#/kids' })}
      <div class="grid two">${[rubbing, pressing].map((x) => card(`<h3>${esc(x.title)}</h3><ol style="padding-left:1.2em;margin:10px 0 0">${x.steps.map((s) => `<li style="margin:6px 0">${esc(s)}</li>`).join('')}</ol>`)).join('')}</div>
      <div class="section">${card(`<span class="eyebrow">Drawing prompt</span><p class="read" data-prompt style="font-size:1.35rem;min-height:3.4em;margin-top:8px">${esc(drawPrompts[0])}</p>
        <button class="btn" type="button" data-next>${icons.sparkle}Another one</button>`)}</div>`),
    mount(root) {
      let i = 0;
      root.querySelector('[data-next]').addEventListener('click', () => {
        i = (i + 1 + Math.floor(Math.random() * (drawPrompts.length - 1))) % drawPrompts.length;
        root.querySelector('[data-prompt]').textContent = drawPrompts[i];
        haptic();
      });
    },
  };
}

export function photosView() {
  const cl = checklist('photos');
  return {
    title: 'Photo list',
    html: page(`${head('Photo list', { back: '#/kids', lede: 'Twelve pictures to take this weekend.' })}
      ${card(activities.photos.map((p) => checkRow(p.id, cl.has(p.id), esc(p.text))).join(''))}
      <p class="small muted" style="margin-top:14px">For the night sky, rest the phone on something still; Night mode takes a long exposure automatically.</p>`),
    mount: (root) => wireChecks(root, cl),
  };
}

const READS = [
  ['Owl Moon', 'Jane Yolen', 'A quiet night walk. Good before stargazing.'],
  ['Frederick', 'Leo Lionni', 'A mouse who saves up colors and words for winter.'],
  ['Leaf Man', 'Lois Ehlert', 'Collage leaves that travel. Try making one.'],
  ['Fletcher and the Falling Leaves', 'Julia Rawlinson', 'A fox worries about his tree.'],
  ['Winnie-the-Pooh', 'A. A. Milne', 'Read the Poohsticks chapter, then play it at a creek bridge.'],
  ['The Hobbit, chapter one', 'J. R. R. Tolkien', 'A read-aloud for the evening.'],
];
export function cozyView() {
  return {
    title: 'Recipes',
    html: page(`${head('Recipes', { back: '#/kids', lede: 'For the kitchen at the lodging.' })}
      <div class="grid two">${recipes.map((r) => card(`<h3>${esc(r.title)}</h3>
        <p class="eyebrow" style="margin-top:14px">Ingredients</p><ul style="padding-left:1.1em;margin:6px 0">${r.ingredients.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
        <p class="eyebrow" style="margin-top:14px">Steps</p><ol style="padding-left:1.2em;margin:6px 0">${r.steps.map((x) => `<li style="margin:5px 0">${esc(x)}</li>`).join('')}</ol>
        ${r.note ? `<p class="small muted">${esc(r.note)}</p>` : ''}`)).join('')}</div>
      <div class="section">${card(`<span class="eyebrow">Books to read aloud</span><ul style="padding-left:1.1em;margin:10px 0 0">${READS.map(([t, a, w]) => `<li style="margin:7px 0"><i>${esc(t)}</i>, ${esc(a)}. <span class="muted">${esc(w)}</span></li>`).join('')}</ul>
        <p class="small muted" style="margin-top:10px">Booky Joint in Mammoth sells new and used books.</p>`, 'tint')}</div>`),
  };
}
