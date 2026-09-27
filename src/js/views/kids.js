import * as store from '../store.js';
import { checklist } from '../store.js';
import { esc, kids, chime, haptic, reducedMotion } from '../ui.js';
import { leaves, things, tracks as trackArt, icons } from '../art.js';
import { burst, tween } from '../fx.js';
import { hunt, badgeLines, leafScience, tracks, rocks, carGames, trivia, drawPrompts, sky } from '../content/kids.js';
import { recipes, activities } from '../content/trip.js';
import { head, page } from './common.js';

const artFor = (key) => {
  const [ns, fn] = key.split('.');
  const lib = { leaves, things, tracks: trackArt }[ns];
  return lib && lib[fn] ? lib[fn]() : '';
};

export function kidsHome() {
  const tiles = [
    ['#/kids/hunt', leaves.aspen(), 'Leaf hunt', 'Find 11 treasures (+3 bonus)'],
    ['#/kids/leaves', leaves.red(), 'Why leaves change', 'The gold was hiding!'],
    ['#/kids/tracks', trackArt.beaver(), 'Animal tracks', 'Who walked here?'],
    ['#/kids/rocks', things.tufa(), 'Rocks & volcanoes', 'Tufa, obsidian, a supervolcano'],
    ['#/kids/sky', things.moon(0.12, true), 'Night sky', 'New Moon weekend'],
    ['#/kids/draw', things.book(), 'Draw & make', 'Rubbings, pressing, prompts'],
    ['#/kids/games', things.pumpkin(), 'Car games', 'I-spy, trivia, stories'],
    ['#/kids/photos', leaves.heart(), 'Photo checklist', '12 family shots'],
    ['#/kids/cozy', things.cocoa(), 'Cozy kitchen', 'Cocoa, cider, caramel apples'],
  ];
  return {
    title: 'Kids',
    html: page(`${head('Explorer HQ', '', 'For the kids')}
      <div class="tiles">${tiles.map(([h, a, t, s]) => `<a class="tile" href="${h}">${a}<b>${t}</b><span>${s}</span></a>`).join('')}</div>`),
  };
}

// ---------------- Leaf hunt (one per kid) ----------------
export function huntView() {
  const k = kids();
  const who = Math.min(2, Math.max(0, store.get('huntKid', 0)));
  const cl = checklist('hunt:' + who);
  const core = hunt.filter((h) => !h.bonus);
  const done = core.filter((h) => cl.has(h.id)).length;
  const complete = done === core.length;
  return {
    title: 'Leaf hunt',
    html: page(`${head('Leaf hunt', '#/kids', 'One hunt per explorer')}
      <div class="seg" role="group" aria-label="Whose hunt">${k.map((n, i) => `<button type="button" data-kid="${i}" aria-pressed="${i === who}">${esc(n)}</button>`).join('')}</div>
      <div class="card section">
        <div style="display:flex;justify-content:space-between;align-items:baseline"><h3>${esc(k[who])}'s treasures</h3><b data-count>${done} / ${core.length}</b></div>
        <div class="progress" style="margin-top:8px"><i style="width:${(100 * done) / core.length}%"></i></div>
        <div data-badge>${complete ? badgeHTML(who, k[who]) : '<p class="small muted" style="margin-top:8px">Tap a card when you find it. Find all 11 for a badge!</p>'}</div>
      </div>
      <div class="hunt-grid">${hunt.map((h) => `<button type="button" class="hunt-item" data-id="${h.id}" aria-pressed="${cl.has(h.id)}">
        ${artFor(h.art)}${h.bonus ? '<span class="bonus">Bonus</span>' : ''}<b>${esc(h.name)}</b><span class="small muted">${esc(h.hint)}</span></button>`).join('')}</div>`),
    mount(root) {
      root.querySelectorAll('[data-kid]').forEach((b) => b.addEventListener('click', () => { store.set('huntKid', +b.dataset.kid); window.dispatchEvent(new HashChangeEvent('hashchange')); }));
      root.querySelectorAll('.hunt-item').forEach((b) => b.addEventListener('click', () => {
        const on = cl.toggle(b.dataset.id);
        b.setAttribute('aria-pressed', on);
        haptic();
        const n = core.filter((h) => cl.has(h.id)).length;
        root.querySelector('[data-count]').textContent = `${n} / ${core.length}`;
        const bar = root.querySelector('.progress i');
        tween(parseFloat(bar.style.width) || 0, (100 * n) / core.length, 500, (v) => (bar.style.width = v + '%'));
        if (on) {
          const r = b.getBoundingClientRect();
          burst(r.left + r.width / 2, r.top + r.height / 3);
          chime();
        }
        if (n === core.length && on) {
          root.querySelector('[data-badge]').innerHTML = badgeHTML(who, k[who]);
          chime([523, 659, 784, 1047]);
          setTimeout(() => burst(window.innerWidth / 2, window.innerHeight / 3, { n: 40 }), 250);
        }
      }));
    },
  };
}

function badgeHTML(i, name) {
  return `<div class="badge" style="margin-top:10px">${badgeSVG()}<div><div class="kicker">Badge earned</div><h3>${esc(badgeLines[i % badgeLines.length])}</h3><p class="small">${esc(name)} found all 11 treasures.</p></div></div>`;
}
function badgeSVG() {
  return `<svg viewBox="0 0 100 100" role="img" aria-label="Badge"><circle cx="50" cy="50" r="44" fill="var(--gold)" stroke="var(--accent)" stroke-width="5"/><circle cx="50" cy="50" r="34" fill="none" stroke="var(--accent)" stroke-width="1.5" stroke-dasharray="3 4"/>
  <g transform="translate(26 18) scale(.48)">${leaves.aspen().replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g></svg>`;
}

// ---------------- Why leaves change (scroll-driven) ----------------
export function leavesView() {
  const s = leafScience;
  const steps = [
    { title: 'All summer: a sugar kitchen', text: s.intro, at: 0 },
    ...s.steps.map((st, i) => ({ ...st, at: [0.05, 0.4, 0.68, 1][i] })),
    { title: 'Wonder', text: s.wonder, at: 1 },
  ];
  return {
    title: 'Why leaves change',
    html: page(`${head('Why leaves change', '#/kids', 'Scroll slowly and watch the leaf')}
      <section class="science">
        <div class="science-stage">
          <div style="display:grid;justify-items:center">
            <div data-leaf>${leaves.aspen()}</div>
            <div class="pigbars">${s.pigments.map((p) => `<div class="pigbar"><span>${p.name}</span><span><i data-pig="${p.key}" style="background:${p.color}"></i></span></div>`).join('')}</div>
            <label class="small" style="margin-top:8px;display:flex;gap:8px;align-items:center">Summer <input type="range" min="0" max="100" value="0" data-season aria-label="Season, summer to fall" style="width:min(56vw,260px)"> Fall</label>
          </div>
        </div>
        <div class="science-steps">${steps.map((st, i) => `<article class="card" data-at="${st.at}"><h3>${esc(st.title)}</h3><p>${esc(st.text)}</p></article>`).join('')}
          <article class="card"><h3>What each color does</h3>${s.pigments.map((p) => `<p><b style="color:${p.color}">●</b> <b>${p.name}:</b> ${esc(p.kid)}</p>`).join('')}</article>
          <article class="card"><h3>Aspen bonus facts</h3>${s.bonus.map((b) => `<p>${esc(b)}</p>`).join('')}<a class="btn" href="#/kids/hunt">Go find a flat aspen stem →</a></article>
        </div>
      </section>`),
    mount(root) {
      const leaf = root.querySelector('[data-leaf] svg path');
      const bars = Object.fromEntries([...root.querySelectorAll('[data-pig]')].map((e) => [e.dataset.pig, e]));
      const range = root.querySelector('[data-season]');
      const mixc = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
      const G = [94, 155, 58], Y = [242, 193, 78], R = [194, 65, 45];
      let manual = false;
      function set(p) {
        const chl = 1 - Math.min(1, Math.max(0, (p - 0.2) / 0.45));
        const ant = Math.max(0, (p - 0.7) / 0.3) * 0.6;
        let c = mixc(Y, G, chl);
        c = mixc(c, R, ant * 0.55);
        leaf.setAttribute('fill', `rgb(${c.join(',')})`);
        bars.chl.style.width = chl * 90 + 5 + '%';
        bars.car.style.width = '72%';
        bars.car.style.opacity = 0.35 + 0.65 * (1 - chl);
        bars.ant.style.width = ant * 100 + '%';
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
          // Blend between the "at" values of the cards around the reading line.
          const line = window.innerHeight * 0.62;
          const cards = [...root.querySelectorAll('[data-at]')].map((c) => {
            const r = c.getBoundingClientRect();
            return { y: r.top + r.height / 2, at: +c.dataset.at };
          });
          let p = cards[0].at;
          for (let i = 0; i < cards.length; i++) {
            if (cards[i].y <= line) p = cards[i].at;
            else {
              if (i > 0) {
                const a = cards[i - 1], b = cards[i];
                p = a.at + (b.at - a.at) * Math.min(1, Math.max(0, (line - a.y) / (b.y - a.y)));
              }
              break;
            }
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

// ---------------- Tracks ----------------
export function tracksView() {
  const cl = checklist('tracks');
  return {
    title: 'Animal tracks',
    html: page(`${head('Who walked here?', '#/kids', 'Animal tracks')}
      <p class="lede">Look in mud, sand, and dust near water, early in the morning. Tap "Saw it!" when you find one.</p>
      <div class="grid two">${tracks.map((t) => `<article class="card track">${trackArt[t.id] ? trackArt[t.id]() : ''}<div><h3>${esc(t.name)}</h3><p class="small"><b>Clue:</b> ${esc(t.clue)}</p><p class="small muted"><b>Where:</b> ${esc(t.where)}</p>
        <label class="check" style="border:0;padding:4px 0"><input type="checkbox" data-id="${t.id}" ${cl.has(t.id) ? 'checked' : ''}><span>Saw it!</span></label></div></article>`).join('')}</div>
      <p class="note section">Never feed wildlife. Store food in the car or lodging. Bears are real here.</p>`),
    mount: (root) => wireChecks(root, cl),
  };
}

function wireChecks(root, cl) {
  root.querySelectorAll('input[data-id]').forEach((i) => i.addEventListener('change', () => {
    const on = cl.toggle(i.dataset.id);
    i.checked = on;
    haptic();
    if (on) { const r = i.getBoundingClientRect(); burst(r.left + 14, r.top + 14, { n: 14 }); chime([784, 988]); }
  }));
}

// ---------------- Rocks ----------------
export function rocksView() {
  const art = { granite: things.granite(), tufa: things.tufa() };
  return {
    title: 'Rocks & volcanoes',
    html: page(`${head('Rocks & volcanoes', '#/kids', 'A land built by fire and ice')}
      <p class="lede">We're driving through one of the youngest volcanic landscapes in America. Some of it is younger than castles!</p>
      <div class="grid two">${rocks.map((r) => `<article class="card"><div style="display:flex;gap:12px;align-items:center">${art[r.id] ? `<div style="width:64px;flex:none">${art[r.id]}</div>` : ''}<div><h3>${esc(r.title)}</h3><p class="small muted">${esc(r.where)}</p></div></div><p>${esc(r.text)}</p></article>`).join('')}</div>
      <p class="note section">Look, touch, and photograph. Leave rocks, obsidian, and pumice where they are, so the next kids can find them too.</p>`),
  };
}

// ---------------- Sky ----------------
export function skyView() {
  const cl = checklist('sky');
  return {
    title: 'Night sky',
    html: page(`${head('Night sky', '#/kids', 'Sat Oct 10 · New Moon')}
      <section class="card feature"><div style="display:flex;gap:14px;align-items:center"><div style="width:84px;flex:none">${things.moon(0.0, true)}</div>
        <div><h2>${esc(sky.headline)}</h2><p>${esc(sky.moon.note)}</p></div></div></section>
      <p class="lede section">${esc(sky.timing)}</p>
      <section class="card section"><h3>Sky scavenger hunt</h3>
      ${sky.finds.map((f) => `<label class="check"><input type="checkbox" data-id="${f.id}" ${cl.has(f.id) ? 'checked' : ''}><span><b>${esc(f.name)}</b> <span class="muted small">(${esc(f.when)})</span><br><span class="small">${esc(f.how)}</span></span></label>`).join('')}</section>
      <section class="card section"><h3>Stargazing tips</h3><ul class="sky-list">${sky.tips.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></section>
      <div class="btn-row"><a class="btn" href="#/faith/m-stars">${icons.faith}Moment: "He names the stars"</a></div>
      <p class="small muted section">Sky timing from the U.S. Naval Observatory; planet positions computed for Mammoth. Tip: switch the phone to dark mode (or Settings → Theme → Dark) to protect night vision.</p>`),
    mount: (root) => wireChecks(root, cl),
  };
}

// ---------------- Games & trivia ----------------
export function gamesView() {
  return {
    title: 'Car games',
    html: page(`${head('Car games', '#/kids', 'For the long, curvy roads')}
      <div class="grid two">${carGames.map((g) => `<article class="card"><h3>${esc(g.title)}</h3><p>${esc(g.text)}</p></article>`).join('')}</div>
      <section class="card section"><h3>Fall trivia</h3><p class="small muted">Tap a question to see the answer.</p>
      ${trivia.map((t) => `<details class="qa"><summary>${esc(t.q)}</summary><p>${esc(t.a)}</p></details>`).join('')}</section>
      <p class="note section">Car-sick tip: eyes on the horizon, windows cracked, crackers ready. Pause games on the curviest parts (Priest Grade, Tioga's east side).</p>`),
  };
}

// ---------------- Draw & make ----------------
export function drawView() {
  const { rubbing, pressing } = activities;
  return {
    title: 'Draw & make',
    html: page(`${head('Draw & make', '#/kids', 'Crafts and prompts')}
      <div class="grid two">
        <article class="card"><h3>${esc(rubbing.title)}</h3><ol>${rubbing.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol></article>
        <article class="card"><h3>${esc(pressing.title)}</h3><ol>${pressing.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol></article>
      </div>
      <section class="card section"><h3>Drawing prompts</h3><p class="small muted">Tap for a random one, or pick your favorite.</p>
        <p class="verse" data-prompt style="min-height:3em">${esc(drawPrompts[0])}</p>
        <button class="btn gold" type="button" data-next>${icons.sparkle}New prompt</button>
        <ul style="margin-top:14px">${drawPrompts.map((p) => `<li>${esc(p)}</li>`).join('')}</ul></section>`),
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

// ---------------- Photos ----------------
export function photosView() {
  const cl = checklist('photos');
  return {
    title: 'Photo checklist',
    html: page(`${head('Photo checklist', '#/kids', 'Memories to make')}
      <section class="card">${activities.photos.map((p) => `<label class="check"><input type="checkbox" data-id="${p.id}" ${cl.has(p.id) ? 'checked' : ''}><span>${esc(p.text)}</span></label>`).join('')}</section>
      <p class="small muted section">Night-sky tip: prop the phone on a rock or bag. iPhone Night mode takes a long exposure automatically when it's still.</p>`),
    mount: (root) => wireChecks(root, cl),
  };
}

// ---------------- Cozy kitchen + reading corner ----------------
const READS = [
  ['Owl Moon', 'Jane Yolen', 'A hushed night walk. Perfect before stargazing.'],
  ['Frederick', 'Leo Lionni', 'A mouse who gathers colors and words for winter.'],
  ['Leaf Man', 'Lois Ehlert', 'Collage leaves that travel. Try making your own!'],
  ['Fletcher and the Falling Leaves', 'Julia Rawlinson', 'A fox worries about his tree losing its leaves.'],
  ['Winnie-the-Pooh (Pooh Sticks chapter)', 'A. A. Milne', 'Then play Pooh Sticks at a creek bridge!'],
  ['The Hobbit, chapter 1', 'J. R. R. Tolkien', 'For a fireside read-aloud. "In a hole in the ground there lived a hobbit."'],
];
export function cozyView() {
  return {
    title: 'Cozy kitchen',
    html: page(`${head('Cozy kitchen', '#/kids', 'Cocoa, cider, caramel apples')}
      <div class="grid two">${recipes.map((r) => `<article class="card"><h3>${esc(r.title)}</h3>
        <h4 class="kicker" style="margin-top:8px">You need</h4><ul>${r.ingredients.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
        <h4 class="kicker">Steps</h4><ol>${r.steps.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>
        ${r.note ? `<p class="note">${esc(r.note)}</p>` : ''}</article>`).join('')}</div>
      <section class="card section"><h3>Reading-corner picks</h3><p class="small muted">Booky Joint in Mammoth has new and used books if you want a trip souvenir.</p>
        <ul>${READS.map(([t, a, w]) => `<li><b>${esc(t)}</b> by ${esc(a)}. ${esc(w)}</li>`).join('')}</ul></section>`),
  };
}
