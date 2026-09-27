import * as store from '../store.js';
import { checklist } from '../store.js';
import { esc, kids, chime, haptic, reducedMotion } from '../ui.js';
import { thunk, pressIn, stampSVG, drawOn } from '../hand.js';
import { burst } from '../fx.js';
import { hunt, badgeLines, leafScience, tracks, rocks, carGames, trivia, drawPrompts, sky } from '../content/kids.js';
import { recipes, activities } from '../content/trip.js';
import { head, page, slip, tag, art, icons, rerender } from './common.js';

// Painting for each hunt item and rock.
const SPEC = { aspen: 'spec-aspen', cottonwood: 'spec-cottonwood', willow: 'spec-willow', birch: 'spec-birch', red: 'spec-red', big: 'spec-big', heart: 'spec-heart', cone: 'spec-cone', granite: 'spec-granite', dam: 'spec-dam', tufa: 'spec-tufa', eyes: 'spec-eyes', track: 'track-deer', obsidian: 'spec-obsidian' };
const LATIN = { aspen: 'Populus tremuloides', cottonwood: 'Populus trichocarpa', willow: 'Salix sp.', birch: 'Betula occidentalis', red: 'Acer glabrum, or wild rose', cone: 'Pinus jeffreyi', granite: 'Sierra Nevada batholith', dam: 'Castor canadensis, engineer', tufa: 'calcium carbonate', eyes: 'Populus tremuloides', obsidian: 'volcanic glass' };
const ROCKART = { granite: 'spec-granite', tufa: 'spec-tufa', obsidian: 'spec-obsidian', pumice: 'spec-granite', panum: 'vig-granite', caldera: 'vig-night', islands: 'vig-tufa' };

export function kidsHome() {
  const shelf = [
    ['#/kids/hunt', 'spec-aspen', 'The Leaf Hunt', 'eleven treasures to press'],
    ['#/kids/leaves', 'sci-red', 'Why Leaves Change', 'the gold was hiding'],
    ['#/kids/tracks', 'track-beaver', 'Who Walked Here?', 'animal tracks'],
    ['#/kids/rocks', 'spec-tufa', 'Rocks & Volcanoes', 'tufa, obsidian, a supervolcano'],
    ['#/kids/sky', 'vig-night', 'The Night Sky', 'a New Moon weekend'],
    ['#/kids/draw', 'spec-heart', 'Draw & Make', 'rubbings, pressing, prompts'],
    ['#/kids/games', 'vig-packed', 'Car Games', 'I-spy, trivia, stories'],
    ['#/kids/photos', 'vig-aspens', 'Photo List', 'twelve family shots'],
    ['#/kids/cozy', 'vig-orchard', 'The Cozy Kitchen', 'cocoa, cider, caramel apples'],
  ];
  return {
    title: 'Explorer HQ',
    html: page(`${head('Explorer HQ', { section: 'VIII · for the kids', folio: '22', lede: 'Pages for the explorers. Pick one!' })}
      <div class="shelf">${shelf.map(([h, a, t, s], i) => `<a href="${h}">${slip(`${i % 3 === 0 ? '<span class="tape"></span>' : ''}<img class="art" src="img/art/${a}.webp" alt="" loading="lazy" style="${a.startsWith('vig') ? 'width:100%;height:80px;object-fit:cover' : ''}"><b>${t}</b><span>${s}</span>`, { key: 'shelf' + i })}</a>`).join('')}</div>`),
  };
}

// ---------------- The leaf hunt: a specimen page per explorer ----------------
export function huntView() {
  const k = kids();
  const who = Math.min(2, Math.max(0, store.get('huntKid', 0)));
  const cl = checklist('hunt:' + who);
  const core = hunt.filter((h) => !h.bonus);
  const done = core.filter((h) => cl.has(h.id)).length;
  return {
    title: 'The Leaf Hunt',
    html: page(`${head('The Leaf Hunt', { back: '#/kids', section: 'IV · the leaf hunt', folio: '12' })}
      <div class="tabs-kraft" role="group" aria-label="Whose specimen page">${k.map((n, i) => `<button type="button" data-kid="${i}" aria-pressed="${i === who}">${esc(n)}</button>`).join('')}</div>
      ${slip(`<div style="display:flex;justify-content:space-between;gap:12px;align-items:center">
        <div><div class="kicker">Specimens collected by</div><div class="hand" style="font-size:1.7rem;line-height:1.1">${esc(k[who])}</div>
        <p class="typed small" data-count style="margin:6px 0 0">${done} OF ${core.length} PRESSED</p></div>
        <span class="stamp" data-badge style="width:100px;opacity:${done === core.length ? '.9' : '0'}">${stampSVG({ top: 'MASTER LEAF', bottom: 'HUNTER · 2026', mid: 'BADGE', seed: 21 + who, size: 100 })}</span></div>
        <p class="note-hand" data-badge-line style="${done === core.length ? '' : 'display:none'}">${esc(badgeLines[who % badgeLines.length])}</p>`, { cls: 'kraft', key: 'hunt-head' })}
      <p class="note-hand" style="margin:4px 0 14px">Tap a square when you find it, and it gets pressed into the journal.</p>
      <div class="specimens">${hunt.map((h, i) => `<button type="button" class="specimen" data-id="${h.id}" data-key="spec-${h.id}" aria-pressed="${cl.has(h.id)}" aria-label="${esc(h.name)}${cl.has(h.id) ? ', found' : ''}">
        <span class="frame"></span>
        <span class="found-stamp stamp">${stampSVG({ top: 'FOUND', bottom: 'OCT 2026', mid: '✓', seed: 40 + i, size: 62 })}</span>
        <span class="pic"><img src="img/art/${SPEC[h.id]}.webp" alt="" loading="lazy"><span class="tape ${['', 't2', 't3'][i % 3]}"></span></span>
        ${h.bonus ? '<span class="bonus-flag">bonus</span>' : `<span class="typed" style="font-size:.7rem;color:var(--ink-2)">No. ${String(i + 1).padStart(2, '0')}</span>`}
        <b>${esc(h.name)}</b>${LATIN[h.id] ? `<span class="latin">${esc(LATIN[h.id])}</span>` : ''}
        <span class="hint">${esc(h.hint)}</span><span class="press">tap when found</span></button>`).join('')}</div>`),
    mount(root) {
      root.querySelectorAll('[data-kid]').forEach((b) => b.addEventListener('click', () => { store.set('huntKid', +b.dataset.kid); rerender(); }));
      root.querySelectorAll('.specimen').forEach((b) => b.addEventListener('click', () => {
        const on = cl.toggle(b.dataset.id);
        b.setAttribute('aria-pressed', on);
        haptic();
        const n = core.filter((h) => cl.has(h.id)).length;
        root.querySelector('[data-count]').textContent = `${n} OF ${core.length} PRESSED`;
        if (on) {
          pressIn(b.querySelector('.pic img'), b.querySelector('.pic .tape'));
          const st = b.querySelector('.found-stamp');
          st.style.opacity = '0';
          setTimeout(() => thunk(st, { rot: -12 }), 380);
          const r = b.getBoundingClientRect();
          setTimeout(() => { burst(r.left + r.width / 2, r.top + r.height / 3, { n: 14 }); chime(); }, 420);
        }
        const badge = root.querySelector('[data-badge]');
        const line = root.querySelector('[data-badge-line]');
        if (n === core.length && on) {
          setTimeout(() => { thunk(badge, { rot: -8 }); chime([523, 659, 784, 1047]); burst(window.innerWidth / 2, 180, { n: 40 }); line.style.display = ''; }, 700);
        } else if (n < core.length) { badge.style.opacity = '0'; line.style.display = 'none'; }
      }));
    },
  };
}

// ---------------- Why leaves change: scroll paints the leaf ----------------
export function leavesView() {
  const s = leafScience;
  const steps = [
    { title: 'All summer: a sugar kitchen', text: s.intro, at: 0 },
    ...s.steps.map((st, i) => ({ ...st, at: [0.05, 0.4, 0.68, 1][i] })),
    { title: 'Wonder', text: s.wonder, at: 1 },
  ];
  const PIG = { chl: '#5e9b3a', car: '#e9b52f', ant: '#c2412d' };
  return {
    title: 'Why leaves change',
    html: page(`${head('Why Leaves Change', { back: '#/kids', section: 'VIII · for the kids', folio: '24', lede: 'Scroll slowly and watch the leaf.' })}
      <section class="science">
        <div class="science-stage"><div style="display:grid;justify-items:center">
          <div class="leafbox"><img class="art" data-l="green" src="img/art/sci-green.webp" alt="An aspen leaf changing color" style="position:relative">
            <img class="art" data-l="gold" src="img/art/spec-aspen.webp" alt="" style="position:absolute;inset:0;opacity:0">
            <img class="art" data-l="red" src="img/art/sci-red.webp" alt="" style="position:absolute;inset:0;opacity:0"></div>
          <div class="pigbars">${s.pigments.map((p) => `<div class="pigbar"><span>${p.name.toUpperCase()}</span><span><i data-pig="${p.key}" style="background:${PIG[p.key]}"></i></span></div>`).join('')}</div>
          <label class="hand" style="margin-top:6px;display:flex;gap:8px;align-items:center">summer <input class="season" type="range" min="0" max="100" value="0" data-season aria-label="Season, summer to fall"> fall</label>
        </div></div>
        <div class="science-steps">${steps.map((st, i) => `<div class="slip" data-at="${st.at}" data-key="sci${i}"><h3>${esc(st.title)}</h3><p>${esc(st.text)}</p></div>`).join('')}
          ${slip(`<h3>What each color does</h3>${s.pigments.map((p) => `<p><span style="color:${PIG[p.key]};font-size:1.3em">●</span> <b>${p.name}:</b> ${esc(p.kid)}</p>`).join('')}`, { key: 'sci-colors', cls: 'kraft' })}
          ${slip(`<h3>Aspen facts</h3>${s.bonus.map((b) => `<p>${esc(b)}</p>`).join('')}<a class="btn small" href="#/kids/hunt">Go find a flat aspen stem →</a>`, { key: 'sci-facts' })}
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

function wireChecks(root, cl) {
  root.querySelectorAll('input[data-id]').forEach((i) => i.addEventListener('change', () => {
    const on = cl.toggle(i.dataset.id);
    i.checked = on;
    haptic();
    if (on) { const r = i.getBoundingClientRect(); burst(r.left + 14, r.top + 14, { n: 12 }); chime([784, 988]); }
  }));
}

export function tracksView() {
  const cl = checklist('tracks');
  return {
    title: 'Who walked here?',
    html: page(`${head('Who Walked Here?', { back: '#/kids', section: 'VIII · for the kids', folio: '25', lede: 'Look in mud, sand, and dust near water, early in the morning.' })}
      <div class="cards">${tracks.map((t) => slip(`<div class="track"><img class="art" src="img/art/track-${t.id}.webp" alt="${esc(t.name)} track" loading="lazy"><div>
        <h3>${esc(t.name)}</h3><p class="note-hand">${esc(t.clue)}</p><p class="small muted"><i>${esc(t.where)}</i></p>
        <label class="check" style="border:0;padding:2px 0;min-height:44px"><input type="checkbox" data-id="${t.id}" ${cl.has(t.id) ? 'checked' : ''}><span>We saw it!</span></label></div></div>`, { key: 'tr' + t.id })).join('')}</div>
      <p class="note-hand section">Never feed wildlife. Keep food in the car or the lodging. Bears are real here.</p>`),
    mount: (root) => wireChecks(root, cl),
  };
}

export function rocksView() {
  return {
    title: 'Rocks & volcanoes',
    html: page(`${head('Rocks & Volcanoes', { back: '#/kids', section: 'VIII · for the kids', folio: '26', lede: 'A land made by fire and ice. Some of it is younger than castles!' })}
      <div class="cards">${rocks.map((r, i) => slip(`${ROCKART[r.id] ? `<img class="art" src="img/art/${ROCKART[r.id]}.webp" alt="" loading="lazy" style="${ROCKART[r.id].startsWith('vig') ? 'width:100%' : 'width:96px;float:right;margin:-6px -4px 4px 8px'}">` : ''}
        <h3>${esc(r.title)}</h3><p class="typed small muted">${esc(r.where.toUpperCase())}</p><p>${esc(r.text)}</p>`, { key: 'rk' + r.id, tape: i === 0 ? 'corner-l' : '' })).join('')}</div>
      <p class="note-hand section">Look, touch, photograph. Leave the rocks, obsidian, and pumice for the next explorers.</p>`),
  };
}

export function skyView() {
  const cl = checklist('sky');
  return {
    title: 'Night sky',
    html: page(`${head('The Night Sky', { back: '#/kids', section: 'VII · the night sky', folio: '20', lede: sky.headline })}
      ${slip(`<img class="art" src="img/art/vig-night.webp" alt="" style="width:100%"><p style="margin-top:8px">${esc(sky.moon.note)}</p><p class="note-hand">${esc(sky.timing)}</p>`, { key: 'sky-hero', tape: 't2' })}
      ${slip(`<div class="kicker">A sky scavenger hunt</div>${sky.finds.map((f) => `<label class="check"><input type="checkbox" data-id="${f.id}" ${cl.has(f.id) ? 'checked' : ''}><span><b>${esc(f.name)}</b> <span class="typed small muted">${esc(f.when)}</span><br>${esc(f.how)}</span></label>`).join('')}`, { key: 'sky-hunt' })}
      ${slip(`<div class="kicker">Stargazing tips</div><ul>${sky.tips.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`, { key: 'sky-tips', cls: 'kraft' })}
      <div class="btn-row"><a class="btn" href="#/faith/m-stars">${icons.book}“He names the stars”</a></div>
      <p class="note-hand section">Tip: switch the journal to lantern mode (Settings → Theme → Dark) to save your night vision.</p>`),
    mount: (root) => wireChecks(root, cl),
  };
}

export function gamesView() {
  return {
    title: 'Car games',
    html: page(`${head('Car Games', { back: '#/kids', section: 'VIII · for the kids', folio: '27', lede: 'For the long, curvy roads.' })}
      <div class="cards">${carGames.map((g, i) => slip(`<h3>${esc(g.title)}</h3><p>${esc(g.text)}</p>`, { key: 'g' + i, cls: i % 3 === 1 ? 'kraft' : '' })).join('')}</div>
      ${slip(`<div class="kicker">Fall trivia</div><p class="note-hand">Tap a question to peek at the answer.</p>${trivia.map((t) => `<details class="qa"><summary>${esc(t.q)}</summary><p>${esc(t.a)}</p></details>`).join('')}`, { key: 'trivia', tape: 'corner-r' })}
      <p class="note-hand section">Car-sick tip: eyes on the horizon, windows cracked, crackers ready. Pause the games on the curviest stretches.</p>`),
  };
}

export function drawView() {
  const { rubbing, pressing } = activities;
  return {
    title: 'Draw & make',
    html: page(`${head('Draw & Make', { back: '#/kids', section: 'VIII · for the kids', folio: '28' })}
      <div class="cards">
        ${slip(`<h3>${esc(rubbing.title)}</h3><ol>${rubbing.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>`, { key: 'rub', tape: 't2' })}
        ${slip(`<h3>${esc(pressing.title)}</h3><ol>${pressing.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>`, { key: 'press', cls: 'kraft' })}
      </div>
      ${slip(`<div class="kicker">Drawing prompt</div><p class="hand" data-prompt style="font-size:1.6rem;line-height:1.25;min-height:3.8em">${esc(drawPrompts[0])}</p>
        <button class="btn gold" type="button" data-next>${icons.sparkle}Another one</button>
        <ul style="margin-top:14px">${drawPrompts.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>`, { key: 'prompts' })}`),
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
    html: page(`${head('The Photo List', { back: '#/kids', section: 'VIII · for the kids', folio: '29', lede: 'Twelve pictures to take home.' })}
      ${slip(activities.photos.map((p) => `<label class="check"><input type="checkbox" data-id="${p.id}" ${cl.has(p.id) ? 'checked' : ''}><span>${esc(p.text)}</span></label>`).join(''), { key: 'photos', tape: 'corner-l' })}
      <p class="note-hand">Night-sky tip: prop the phone on a rock. iPhone Night mode takes a long exposure when it’s still.</p>`),
    mount: (root) => wireChecks(root, cl),
  };
}

const READS = [
  ['Owl Moon', 'Jane Yolen', 'A hushed night walk. Perfect before stargazing.'],
  ['Frederick', 'Leo Lionni', 'A mouse who gathers colors and words for winter.'],
  ['Leaf Man', 'Lois Ehlert', 'Collage leaves that travel. Try making your own!'],
  ['Fletcher and the Falling Leaves', 'Julia Rawlinson', 'A fox worries about his tree losing its leaves.'],
  ['Winnie-the-Pooh (the Pooh Sticks chapter)', 'A. A. Milne', 'Then play Pooh Sticks at a creek bridge!'],
  ['The Hobbit, chapter 1', 'J. R. R. Tolkien', 'A fireside read-aloud: “In a hole in the ground there lived a hobbit.”'],
];
export function cozyView() {
  return {
    title: 'Cozy kitchen',
    html: page(`${head('The Cozy Kitchen', { back: '#/kids', section: 'VIII · for the kids', folio: '30', lede: 'Cocoa, cider, caramel apples, and a good book.' })}
      <div class="cards">${recipes.map((r, i) => slip(`<div class="kicker">Recipe card</div><h3>${esc(r.title)}</h3>
        <p class="typed small" style="margin-top:8px">YOU NEED</p><ul>${r.ingredients.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
        <p class="typed small">STEPS</p><ol>${r.steps.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>
        ${r.note ? `<p class="note-hand">${esc(r.note)}</p>` : ''}`, { key: 'rc' + r.id, cls: 'ruled-card', tape: ['', 't2', 't3', ''][i] })).join('')}</div>
      ${slip(`<div class="kicker">For the reading corner</div><p class="note-hand">Booky Joint in Mammoth has new and used books if you want a trip souvenir.</p>
        <ul>${READS.map(([t, a, w]) => `<li><i>${esc(t)}</i> by ${esc(a)}. ${esc(w)}</li>`).join('')}</ul>`, { key: 'reads', cls: 'kraft' })}`),
  };
}
