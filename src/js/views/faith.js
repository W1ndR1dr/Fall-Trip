import * as store from '../store.js';
import { esc, chime, haptic } from '../ui.js';
import { doodles, tick, drawOn, pop } from '../hand.js';
import { burst } from '../fx.js';
import { daily, moments, bonus, memoryVerse, journalPrompts } from '../content/devotions.js';
import { passages } from '../content/scripture.js';
import { head, page, card, passageHTML, translationToggle, wireTranslation, findDevotion, turns, family, translation, rerender } from './common.js';

const ICON = { Look: doodles.eye, Read: doodles.book, Wonder: doodles.sparkle, Pray: doodles.pray, Do: doodles.check, Sing: doodles.star };
const ART = { fri: 'vig-orchard', sat: 'vig-aspens', sun: 'vig-home', 'm-granite': 'vig-granite', 'm-springs': 'vig-tufa', 'm-beasts': 'spec-dam', 'm-trees': 'spec-aspen', 'm-stars': 'vig-night' };
const chev = doodles.back.replace('class="ico"', 'class="ico chev" style="transform:scaleX(-1)"');

export function faithHome() {
  const row = (d, sub) => `<li><a href="#/faith/${d.id}"><span class="done ${store.get('done:' + d.id, false) ? 'on' : ''}">${tick()}</span>
    <span><span class="t">${esc(d.title)}</span><span class="d">${esc(sub)} · ${d.read.map(esc).join(', ')}</span></span>${chev}</a></li>`;
  return {
    title: 'Devotions',
    html: page(`${head('Devotions', { lede: 'About five minutes each, led by the kids: Look, Read, Wonder, Pray, Do.' })}
      ${translationToggle()}
      <div class="section" style="margin-top:22px">${card(`<span class="eyebrow">One each day</span><ul class="list">${daily.map((d) => row(d, d.when)).join('')}</ul>`)}</div>
      <div class="section" style="margin-top:16px">${card(`<span class="eyebrow">At stops along the way</span><ul class="list">${moments.map((d) => row(d, d.place)).join('')}</ul>`)}</div>
      <div class="section" style="margin-top:16px">${card(`<span class="eyebrow">Any time</span><ul class="list">${bonus.map((d) => row(d, d.when)).join('')}</ul>`)}</div>
      <div class="section" style="margin-top:16px">${card(`<ul class="list">
        <li><a href="#/faith/verse"><span><span class="t">Memory verse</span><span class="d">${esc(memoryVerse)}: hide one word at a time</span></span>${chev}</a></li>
        <li><a href="#/faith/journal"><span><span class="t">Gratitude journal</span><span class="d">One line each evening</span></span>${chev}</a></li>
        <li><a href="#/faith/lookback"><span><span class="t">Look back</span><span class="d">The whole weekend, on Sunday</span></span>${chev}</a></li></ul>`)}</div>
      <p class="small muted" style="margin-top:18px">Download the ESV and NIV in the YouVersion Bible app before you go: reading then works offline, though its audio needs a signal. Each passage here links to the same verses in the app.</p>`),
    mount: (root) => wireTranslation(root, rerender),
  };
}

export function devotionView(id) {
  const d = findDevotion(id);
  if (!d) return faithHome();
  const kid = store.get('kidReader', false);
  const who = daily.includes(d) || moments.includes(d) ? turns(d.id) : null;
  const done = store.get('done:' + d.id, false);
  const steps = [
    ['Look', d.look],
    ['Read', d.read.map(passageHTML).join('') + (d.readNote ? `<p class="small muted" style="margin-top:10px">${esc(d.readNote)}</p>` : '')],
    ['Wonder', d.wonder], ['Pray', d.pray], ['Do', d.do],
  ].filter(([, v]) => v);
  const art = ART[d.id];
  return {
    title: d.title,
    html: page(`${head(d.title, { back: '#/faith', eyebrow: d.when || d.place || '' })}
      ${art ? `<img class="art" src="img/art/${art}.webp" alt="" style="width:${art.startsWith('vig') ? '100%' : '120px'};max-width:560px;border-radius:14px;margin:0 0 18px">` : ''}
      ${who ? `<div class="turns" style="margin-bottom:12px"><span class="turn"><small>Reads</small><b>${esc(who.reader)}</b></span><span class="turn"><small>Prays</small><b>${esc(who.prayer)}</b></span>
        <button class="btn small secondary" type="button" data-swap>Switch</button></div>` : ''}
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:16px">${translationToggle()}
        <button class="btn small ${kid ? '' : 'secondary'}" type="button" data-kid aria-pressed="${kid}">${kid ? 'Large print on' : 'Large print'}</button></div>
      ${card(`${steps.map(([k, v]) => `<div class="step"><span class="ico-wrap">${ICON[k]}</span><div><h4>${k}</h4>${k === 'Read' ? v : `<p>${esc(v)}</p>`}</div></div>`).join('')}
        ${d.hymn ? `<div class="step"><span class="ico-wrap">${ICON.Sing}</span><div><h4>Sing</h4><p class="hymn">${d.hymn.lines.map(esc).join('\n')}</p><p class="small faint" style="margin-top:8px">${esc(d.hymn.title)} · ${esc(d.hymn.credit)}</p></div></div>` : ''}`, kid ? 'kidmode' : '')}
      ${d.why ? `<p class="small muted" style="margin-top:14px"><b>Why this passage here.</b> ${esc(d.why)}</p>` : ''}
      <div class="btn-row"><button class="btn" type="button" data-done aria-pressed="${done}">${tick().replace('<svg', '<svg class="ico"')}<span>${done ? 'Done' : 'Mark as done'}</span></button><a class="btn secondary" href="#/faith/journal">Journal</a></div>`),
    mount(root) {
      wireTranslation(root, rerender);
      root.querySelector('[data-kid]').addEventListener('click', () => { store.set('kidReader', !kid); rerender(); });
      const sw = root.querySelector('[data-swap]');
      sw && sw.addEventListener('click', () => { store.set('turn:' + d.id, (store.get('turn:' + d.id, 0) + 1) % 3); rerender(); });
      const b = root.querySelector('[data-done]');
      b.addEventListener('click', () => {
        const on = !store.get('done:' + d.id, false);
        store.set('done:' + d.id, on);
        b.setAttribute('aria-pressed', on);
        b.querySelector('span').textContent = on ? 'Done' : 'Mark as done';
        if (on) { pop(b); drawOn(b.querySelector('svg'), { ms: 300 }); const r = b.getBoundingClientRect(); burst(r.left + r.width / 2, r.top); chime([523, 659, 784]); }
        haptic();
      });
    },
  };
}

export function verseGame() {
  const tr = translation();
  const text = passages[memoryVerse][tr === 'NIV' ? 'niv' : 'esv'].replace(/[:;]$/, '.');
  const words = text.split(/\s+/);
  const hidden = new Set(store.get('mv:' + tr, []));
  return {
    title: 'Memory verse',
    html: page(`${head('Memory verse', { back: '#/faith', eyebrow: memoryVerse, lede: 'Read it together. Take turns hiding a word, then say the whole verse. Keep going until every word is hidden.' })}
      <div style="margin-bottom:14px">${translationToggle()}</div>
      ${card(`<div class="words">${words.map((w, i) => `<button type="button" data-w="${i}" class="${hidden.has(i) ? 'hidden' : ''}" aria-label="${hidden.has(i) ? 'hidden word' : esc(w)}">${esc(w)}</button>`).join('')}</div>
        <p class="small faint" style="margin-top:12px">${esc(memoryVerse)} · ${tr}</p>`)}
      <div class="btn-row"><button class="btn" type="button" data-hide>Hide a word</button><button class="btn secondary" type="button" data-reset>Show all</button></div>`),
    mount(root) {
      const save = () => store.set('mv:' + tr, [...hidden]);
      const btns = [...root.querySelectorAll('[data-w]')];
      const toggle = (i) => {
        hidden.has(i) ? hidden.delete(i) : hidden.add(i);
        btns[i].classList.toggle('hidden', hidden.has(i));
        btns[i].setAttribute('aria-label', hidden.has(i) ? 'hidden word' : words[i]);
        save(); haptic();
        if (hidden.size === words.length) { chime([523, 659, 784, 1047]); burst(window.innerWidth / 2, window.innerHeight / 2, { n: 36 }); }
      };
      btns.forEach((b) => b.addEventListener('click', () => toggle(+b.dataset.w)));
      root.querySelector('[data-hide]').addEventListener('click', () => {
        const left = words.map((_, i) => i).filter((i) => !hidden.has(i));
        if (left.length) toggle(left[Math.floor(Math.random() * left.length)]);
      });
      root.querySelector('[data-reset]').addEventListener('click', () => { hidden.clear(); save(); btns.forEach((b, i) => { b.classList.remove('hidden'); b.setAttribute('aria-label', words[i]); }); });
      wireTranslation(root, rerender);
    },
  };
}

const DAYS = [['fri', 'Fri'], ['sat', 'Sat'], ['sun', 'Sun']];
export function journalView() {
  const fam = family();
  const day = store.get('journalDay', 'fri');
  const prompt = journalPrompts[DAYS.findIndex(([d]) => d === day) % journalPrompts.length];
  return {
    title: 'Journal',
    html: page(`${head('Gratitude journal', { back: '#/faith', lede: 'One line from each person, each evening. Saved on this device as you type.' })}
      <div class="segmented" role="group" aria-label="Day">${DAYS.map(([d, l]) => `<button type="button" data-day="${d}" aria-pressed="${d === day}">${l}</button>`).join('')}</div>
      <div class="section" style="margin-top:18px">${card(`<h2>${esc(prompt)}</h2><div class="journal">${fam.map((n, i) => `<label for="j-${i}">${esc(n)}</label><textarea id="j-${i}" data-i="${i}" placeholder="I noticed…">${esc(store.get(`journal:${day}:${i}`, ''))}</textarea>`).join('')}</div>`)}</div>`),
    mount(root) {
      root.querySelectorAll('[data-day]').forEach((b) => b.addEventListener('click', () => { store.set('journalDay', b.dataset.day); rerender(); }));
      root.querySelectorAll('textarea').forEach((t) => t.addEventListener('input', () => store.set(`journal:${day}:${t.dataset.i}`, t.value)));
    },
  };
}

export function lookbackView() {
  const fam = family();
  const entries = DAYS.map(([d], k) => ({ l: ['Friday', 'Saturday', 'Sunday'][k], items: fam.map((n, i) => [n, store.get(`journal:${d}:${i}`, '')]).filter(([, v]) => v && v.trim()) }));
  const any = entries.some((e) => e.items.length);
  const found = [0, 1, 2].reduce((a, i) => a + store.checklist('hunt:' + i).count(), 0);
  const devs = [...daily, ...moments].filter((d) => store.get('done:' + d.id, false)).length;
  return {
    title: 'Look back',
    html: page(`${head('Look back', { back: '#/faith', eyebrow: 'Sunday' })}
      <div class="grid" style="grid-template-columns:repeat(3,1fr)">${[[found, 'leaf-hunt finds'], [devs, 'devotions'], [store.checklist('photos').count(), 'photos']].map(([n, l]) => card(`<b style="font-family:var(--display);font-weight:400;font-size:2.4rem;line-height:1">${n}</b><span class="small muted" style="display:block">${l}</span>`)).join('')}</div>
      <div class="section">${any ? entries.map((e) => e.items.length ? card(`<span class="eyebrow">${e.l}</span>${e.items.map(([n, v]) => `<p class="entry"><b style="font-family:var(--sans);font-size:.9rem">${esc(n)}</b><br>${esc(v)}</p>`).join('')}`) : '').join('<div style="height:14px"></div>')
        : card('<p>No journal entries yet. Add one line each evening and they’ll all show up here on Sunday.</p>', 'tint')}</div>
      <div class="section">${card(`${passageHTML('Ecclesiastes 3:11')}<p style="margin-top:14px">Go around the circle: what’s one thing from this weekend you want to remember? Then thank God for it together.</p>`)}</div>`),
  };
}
