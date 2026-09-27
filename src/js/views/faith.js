import * as store from '../store.js';
import { esc, chime, haptic } from '../ui.js';
import { icons, leaves } from '../art.js';
import { burst } from '../fx.js';
import { daily, moments, bonus, memoryVerse, journalPrompts } from '../content/devotions.js';
import { passages } from '../content/scripture.js';
import { head, page, passageHTML, translationToggle, wireTranslation, findDevotion, turns, family, translation } from './common.js';

const STEP_ICON = { Look: icons.eye, Read: icons.book, Wonder: icons.sparkle, Pray: icons.pray, Do: icons.check };
const rerender = () => window.dispatchEvent(new HashChangeEvent('hashchange'));

export function faithHome() {
  const card = (d, sub) => `<a class="tile" href="#/faith/${d.id}"><b>${esc(d.title)}</b><span>${esc(sub)}</span><span class="small">${d.read.map(esc).join(' · ')}</span></a>`;
  return {
    title: 'Devotions',
    html: page(`${head('Family devotions', '', 'Look · Read · Wonder · Pray · Do')}
      <p class="lede">About five minutes each, led by the kids. Grown-ups just help. Warm, simple, and outside when possible.</p>
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">${translationToggle()}<span class="small muted">ESV and NIV are both saved for offline.</span></div>
      <section class="section"><h2>One for each day</h2><div class="tiles">${daily.map((d) => card(d, d.when)).join('')}</div></section>
      <section class="section"><h2>Moments along the way</h2><p class="small muted">Short, 1–2 minute pauses pinned to places on the plan.</p><div class="tiles">${moments.map((d) => card(d, d.place)).join('')}</div></section>
      <section class="section"><h2>Whenever they fit</h2><div class="tiles">${bonus.map((d) => card(d, d.when)).join('')}</div></section>
      <section class="section"><h2>Play and remember</h2><div class="tiles">
        <a class="tile" href="#/faith/verse">${leaves.aspen()}<b>Memory verse game</b><span>${esc(memoryVerse)}: tap words to hide them</span></a>
        <a class="tile" href="#/faith/journal">${icons.leaf}<b>Gratitude journal</b><span>"What did you notice today?"</span></a>
        <a class="tile" href="#/faith/lookback">${icons.sparkle}<b>Sunday look-back</b><span>The whole weekend together</span></a>
      </div></section>
      <p class="note section">Tip: in the YouVersion Bible app, download the ESV and NIV before the trip. Reading then works offline; YouVersion's audio still needs a signal. The "Open in Bible app" links open the same passage there.</p>`),
    mount: (root) => wireTranslation(root, rerender),
  };
}

export function devotionView(id) {
  const d = findDevotion(id);
  if (!d) return faithHome();
  const isDaily = daily.includes(d);
  const isMoment = moments.includes(d);
  const kid = store.get('kidReader', false);
  const who = isDaily || isMoment ? turns(d.id) : null;
  const steps = [
    ['Look', d.look],
    ['Read', d.read.map(passageHTML).join('') + (d.readNote ? `<p class="small muted">${esc(d.readNote)}</p>` : '')],
    ['Wonder', d.wonder],
    ['Pray', d.pray],
    ['Do', d.do],
  ].filter(([, v]) => v);
  return {
    title: d.title,
    html: page(`${head(d.title, '#/faith', d.when || d.place || '')}
      ${who ? `<div class="turns"><span class="turn">${icons.book}Reader: <span class="who">${esc(who.reader)}</span></span><span class="turn">${icons.pray}Prays: <span class="who">${esc(who.prayer)}</span></span>
        <button class="btn ghost small" type="button" data-swap>Swap turns</button></div>` : ''}
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin:12px 0">${translationToggle()}
        <button class="btn ${kid ? 'gold' : 'ghost'} small" type="button" data-kid aria-pressed="${kid}">${kid ? 'Big-print reader: on' : 'Big-print reader'}</button></div>
      <article class="card ${kid ? 'kidmode' : ''}">${steps.map(([k, v]) => `<div class="dev-step"><div class="n" aria-hidden="true">${STEP_ICON[k]}</div><div><h4>${k}</h4>${k === 'Read' ? v : `<p>${esc(v)}</p>`}</div></div>`).join('')}
      ${d.hymn ? `<div class="dev-step"><div class="n" aria-hidden="true">${icons.star}</div><div><h4>${esc(d.hymn.title)}</h4><p class="hymn">${d.hymn.lines.map(esc).join('\n')}</p><p class="small muted">${esc(d.hymn.credit)}</p></div></div>` : ''}
      </article>
      ${d.why ? `<p class="small muted section"><b>Why this passage here:</b> ${esc(d.why)}</p>` : ''}
      <div class="btn-row"><button class="btn gold" type="button" data-amen>${icons.sparkle}Amen! We did it</button><a class="btn ghost" href="#/faith/journal">Write in the journal</a></div>`),
    mount(root) {
      wireTranslation(root, rerender);
      root.querySelector('[data-kid]').addEventListener('click', () => { store.set('kidReader', !kid); rerender(); });
      const sw = root.querySelector('[data-swap]');
      sw && sw.addEventListener('click', () => { store.set('turn:' + d.id, (store.get('turn:' + d.id, 0) + 1) % 3); rerender(); });
      root.querySelector('[data-amen]').addEventListener('click', (e) => {
        store.set('done:' + d.id, true);
        const r = e.currentTarget.getBoundingClientRect();
        burst(r.left + r.width / 2, r.top);
        chime([523, 659, 784]);
        haptic();
      });
    },
  };
}

// Memory verse: tap words to hide them, then say it from memory.
export function verseGame() {
  const tr = translation();
  const text = passages[memoryVerse][tr === 'NIV' ? 'niv' : 'esv'].replace(/[:;]$/, '.');
  const words = text.split(/\s+/);
  const hidden = new Set(store.get('mv:' + tr, []));
  return {
    title: 'Memory verse',
    html: page(`${head('Memory verse', '#/faith', memoryVerse)}
      <p class="lede">Read it together. Then take turns tapping a word to hide it, and say the whole verse again. Can you hide them ALL?</p>
      <div style="margin-bottom:12px">${translationToggle()}</div>
      <section class="card kidmode"><div class="mv-words">${words.map((w, i) => `<button type="button" data-w="${i}" class="${hidden.has(i) ? 'hidden' : ''}" aria-label="${hidden.has(i) ? 'hidden word' : esc(w)}">${esc(w)}</button>`).join('')}</div>
        <p class="small muted" style="margin-top:10px">${esc(memoryVerse)} (${tr})</p></section>
      <div class="btn-row"><button class="btn gold" type="button" data-hide>Hide a random word</button><button class="btn ghost" type="button" data-reset>Show all</button></div>`),
    mount(root) {
      const save = () => store.set('mv:' + tr, [...hidden]);
      const btns = [...root.querySelectorAll('[data-w]')];
      const toggle = (i) => {
        hidden.has(i) ? hidden.delete(i) : hidden.add(i);
        const b = btns[i];
        b.classList.toggle('hidden', hidden.has(i));
        b.setAttribute('aria-label', hidden.has(i) ? 'hidden word' : words[i]);
        save();
        haptic();
        if (hidden.size === words.length) {
          chime([523, 659, 784, 1047]);
          burst(window.innerWidth / 2, window.innerHeight / 2, { n: 36 });
        }
      };
      btns.forEach((b) => b.addEventListener('click', () => toggle(+b.dataset.w)));
      root.querySelector('[data-hide]').addEventListener('click', () => {
        const left = words.map((_, i) => i).filter((i) => !hidden.has(i));
        if (left.length) toggle(left[Math.floor(Math.random() * left.length)]);
      });
      root.querySelector('[data-reset]').addEventListener('click', () => {
        hidden.clear(); save(); btns.forEach((b, i) => { b.classList.remove('hidden'); b.setAttribute('aria-label', words[i]); });
      });
      wireTranslation(root, rerender);
    },
  };
}

const DAYS = [['fri', 'Friday'], ['sat', 'Saturday'], ['sun', 'Sunday']];

export function journalView() {
  const fam = family();
  const day = store.get('journalDay', 'fri');
  const prompt = journalPrompts[DAYS.findIndex(([d]) => d === day) % journalPrompts.length];
  return {
    title: 'Journal',
    html: page(`${head('Gratitude journal', '#/faith', 'One line each, every day')}
      <div class="seg" role="group" aria-label="Day">${DAYS.map(([d, l]) => `<button type="button" data-day="${d}" aria-pressed="${d === day}">${l}</button>`).join('')}</div>
      <section class="card section journal"><h2 class="hand" style="font-size:2rem">${esc(prompt)}</h2>
        ${fam.map((n, i) => `<label for="j-${i}">${esc(n)}</label><textarea id="j-${i}" data-i="${i}" placeholder="I noticed…">${esc(store.get(`journal:${day}:${i}`, ''))}</textarea>`).join('')}
        <p class="small muted" style="margin-top:10px">Saved on this device as you type. Kids can dictate and a grown-up types.</p></section>`),
    mount(root) {
      root.querySelectorAll('[data-day]').forEach((b) => b.addEventListener('click', () => { store.set('journalDay', b.dataset.day); rerender(); }));
      root.querySelectorAll('textarea').forEach((t) => t.addEventListener('input', () => store.set(`journal:${day}:${t.dataset.i}`, t.value)));
    },
  };
}

export function lookbackView() {
  const fam = family();
  const entries = DAYS.map(([d, l]) => ({ l, items: fam.map((n, i) => [n, store.get(`journal:${d}:${i}`, '')]).filter(([, v]) => v && v.trim()) }));
  const any = entries.some((e) => e.items.length);
  const huntTotal = [0, 1, 2].reduce((a, i) => a + store.checklist('hunt:' + i).count(), 0);
  const devs = [...daily, ...moments].filter((d) => store.get('done:' + d.id, false)).length;
  return {
    title: 'Look back',
    html: page(`${head('Looking back', '#/faith', 'Sunday: the weekend together')}
      <section class="card feature"><h2>Our weekend in numbers</h2>
        <p>${huntTotal} leaf-hunt treasures found · ${devs} devotions and moments shared · ${store.checklist('photos').count()} family photos checked off</p></section>
      ${any ? entries.map((e) => e.items.length ? `<section class="card section lookback"><h3>${e.l}</h3>${e.items.map(([n, v]) => `<p><b>${esc(n)}:</b> <span class="entry">${esc(v)}</span></p>`).join('')}</section>` : '').join('') : '<div class="card section"><p>No journal entries yet. Add one line each night in the Gratitude journal, and on Sunday they\'ll all appear here.</p></div>'}
      <section class="card section"><h3>To close the weekend</h3>${passageHTML('Ecclesiastes 3:11')}<p>Go around the circle: what is one thing you want to remember forever? Then thank God for it together.</p></section>`),
  };
}
