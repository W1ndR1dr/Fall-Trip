import * as store from '../store.js';
import { esc, chime, haptic } from '../ui.js';
import { thunk, stampSVG, doodles } from '../hand.js';
import { burst } from '../fx.js';
import { daily, moments, bonus, memoryVerse, journalPrompts } from '../content/devotions.js';
import { passages } from '../content/scripture.js';
import { head, page, slip, passageHTML, translationToggle, wireTranslation, findDevotion, turns, family, translation, rerender } from './common.js';

const MARK = { Look: doodles.eye, Read: doodles.book, Wonder: doodles.sparkle, Pray: doodles.pray, Do: doodles.check, Sing: doodles.star };
const ART = { fri: 'vig-orchard', sat: 'vig-aspens', sun: 'vig-home', 'm-granite': 'vig-granite', 'm-springs': 'vig-tufa', 'm-beasts': 'spec-dam', 'm-trees': 'spec-aspen', 'm-stars': 'vig-night' };

export function faithHome() {
  const entry = (d, sub, i) => `<li><a href="#/faith/${d.id}"><span class="num">${store.get('done:' + d.id, false) ? '✓' : ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix'][i] + '.'}</span>
    <span><span class="t">${esc(d.title)}</span><span class="d">${esc(sub)} · ${d.read.map(esc).join(', ')}</span></span><span class="dots"></span></a></li>`;
  return {
    title: 'Devotions',
    html: page(`${head('Devotions', { section: 'V · devotions', folio: '15', lede: 'Five minutes, led by the kids. Look · Read · Wonder · Pray · Do.' })}
      <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">${translationToggle()}<span class="note-hand">both saved for offline</span></div>
      ${slip(`<span class="ribbon" aria-hidden="true"></span><div class="kicker">One for each day</div><ol class="toc">${daily.map((d, i) => entry(d, d.when, i)).join('')}</ol>`, { key: 'dv-daily' })}
      ${slip(`<div class="kicker">Moments along the way</div><p class="note-hand">One or two minutes, pinned to places on the plan.</p><ol class="toc">${moments.map((d, i) => entry(d, d.place, i)).join('')}</ol>`, { key: 'dv-moments', tape: 't2' })}
      ${slip(`<div class="kicker">Whenever they fit</div><ol class="toc">${bonus.map((d, i) => entry(d, d.when, i)).join('')}</ol>`, { key: 'dv-bonus', cls: 'kraft' })}
      <div class="cards section">
        <a href="#/faith/verse" style="text-decoration:none">${slip(`<div class="kicker">Memory verse</div><h3>${esc(memoryVerse)}</h3><p class="note-hand">Tap words to hide them, then say it by heart.</p>`, { key: 'mv-link', tape: 'corner-r' })}</a>
        <a href="#/faith/journal" style="text-decoration:none">${slip(`<div class="kicker">Gratitude journal</div><h3>What did you notice today?</h3><p class="note-hand">One line each, every evening.</p>`, { key: 'gj-link', cls: 'ruled-card' })}</a>
        <a href="#/faith/lookback" style="text-decoration:none">${slip(`<div class="kicker">Sunday</div><h3>Looking back together</h3><p class="note-hand">The whole weekend on one page.</p>`, { key: 'lb-link' })}</a>
      </div>
      <p class="note-hand section">Before the trip: download ESV and NIV inside the YouVersion Bible app. Reading then works offline (its audio still needs a signal). Every passage here links straight to the same verses in the app.</p>`),
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
    ['Read', d.read.map(passageHTML).join('') + (d.readNote ? `<p class="note-hand">${esc(d.readNote)}</p>` : '')],
    ['Wonder', d.wonder], ['Pray', d.pray], ['Do', d.do],
  ].filter(([, v]) => v);
  return {
    title: d.title,
    html: page(`${head(d.title, { back: '#/faith', section: d.when || d.place || 'devotion' })}
      ${who ? `<div class="turns" style="margin-bottom:10px"><span class="nametag"><small>reader</small><b>${esc(who.reader)}</b></span><span class="nametag"><small>prays</small><b>${esc(who.prayer)}</b></span>
        <button class="btn line small" type="button" data-swap>swap turns</button></div>` : ''}
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:0 0 14px">${translationToggle()}
        <button class="btn ${kid ? 'gold' : 'line'} small" type="button" data-kid aria-pressed="${kid}">${kid ? 'Big print: on' : 'Big print for young readers'}</button></div>
      ${ART[d.id] ? `<img class="art" src="img/art/${ART[d.id]}.webp" alt="" style="width:${ART[d.id].startsWith('vig') ? '100%' : '120px'};max-width:460px;margin:0 auto 6px">` : ''}
      <div class="slip prayer ${kid ? 'kidmode' : ''}" data-key="prayer-${d.id}"><span class="ribbon" aria-hidden="true"></span>
        ${steps.map(([k, v]) => `<div class="movement"><span class="mark" style="color:var(--rust)">${MARK[k]}</span><div><h4>${k}</h4>${k === 'Read' ? v : `<p>${esc(v)}</p>`}</div></div>`).join('')}
        ${d.hymn ? `<div class="movement"><span class="mark" style="color:var(--rust)">${MARK.Sing}</span><div><h4>Sing</h4><p class="hymn">${d.hymn.lines.map(esc).join('\n')}</p><p class="typed small muted">${esc(d.hymn.title.toUpperCase())} · ${esc(d.hymn.credit)}</p></div></div>` : ''}
      </div>
      ${d.why ? `<p class="note-hand"><b>Why this passage, here:</b> ${esc(d.why)}</p>` : ''}
      <div style="display:flex;align-items:center;gap:16px;margin-top:14px;flex-wrap:wrap">
        <button class="btn rust" type="button" data-amen>${doodles.sparkle}Amen, we did it</button>
        <span class="stamp" data-stamp style="width:96px;opacity:${done ? '.9' : '0'}">${stampSVG({ top: 'GIVE THANKS', bottom: 'FALL TRIP 2026', mid: 'AMEN', seed: 77, size: 96 })}</span>
        <a class="note-hand" href="#/faith/journal">write in the journal →</a></div>`),
    mount(root) {
      wireTranslation(root, rerender);
      root.querySelector('[data-kid]').addEventListener('click', () => { store.set('kidReader', !kid); rerender(); });
      const sw = root.querySelector('[data-swap]');
      sw && sw.addEventListener('click', () => { store.set('turn:' + d.id, (store.get('turn:' + d.id, 0) + 1) % 3); rerender(); });
      root.querySelector('[data-amen]').addEventListener('click', (e) => {
        store.set('done:' + d.id, true);
        thunk(root.querySelector('[data-stamp]'), { rot: -10 });
        const r = e.currentTarget.getBoundingClientRect();
        burst(r.left + r.width / 2, r.top);
        chime([523, 659, 784]);
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
    html: page(`${head('The Memory Verse', { back: '#/faith', section: memoryVerse, lede: 'Read it together. Take turns hiding a word, then say the whole verse again. Can you hide them all?' })}
      <div style="margin-bottom:12px">${translationToggle()}</div>
      ${slip(`<div class="mv-words kidmode">${words.map((w, i) => `<button type="button" data-w="${i}" class="${hidden.has(i) ? 'hidden' : ''}" aria-label="${hidden.has(i) ? 'hidden word' : esc(w)}">${esc(w)}</button>`).join('')}</div>
        <p class="typed small muted" style="margin-top:12px">${esc(memoryVerse.toUpperCase())} (${tr})</p>`, { key: 'mv', tape: 't2' })}
      <div class="btn-row"><button class="btn gold" type="button" data-hide>Hide a random word</button><button class="btn line" type="button" data-reset>Show them all</button></div>`),
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

const DAYS = [['fri', 'FRI'], ['sat', 'SAT'], ['sun', 'SUN']];
export function journalView() {
  const fam = family();
  const day = store.get('journalDay', 'fri');
  const prompt = journalPrompts[DAYS.findIndex(([d]) => d === day) % journalPrompts.length];
  return {
    title: 'Gratitude journal',
    html: page(`${head('Gratitude Journal', { back: '#/faith', section: 'V · devotions', folio: '17' })}
      <div class="tabs-kraft" role="group" aria-label="Day">${DAYS.map(([d, l]) => `<button type="button" data-day="${d}" aria-pressed="${d === day}">${l}</button>`).join('')}</div>
      ${slip(`<h2 class="hand" style="font-size:1.9rem;margin-bottom:6px">${esc(prompt)}</h2>
        <div class="journal-lines">${fam.map((n, i) => `<label for="j-${i}">${esc(n)}</label><textarea id="j-${i}" data-i="${i}" placeholder="I noticed…">${esc(store.get(`journal:${day}:${i}`, ''))}</textarea>`).join('')}</div>
        <p class="note-hand" style="margin-top:10px">Saved on this device as you write. Little ones can dictate while a grown-up types.</p>`, { key: 'journal-' + day, tape: 'corner-l' })}`),
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
    title: 'Looking back',
    html: page(`${head('Looking Back', { back: '#/faith', section: 'Sunday · together' })}
      ${slip(`<div class="kicker">Our weekend, counted</div><p class="hand" style="font-size:1.4rem;line-height:1.35">${found} leaf-hunt treasures pressed · ${devs} devotions & moments shared · ${store.checklist('photos').count()} family photos</p>`, { cls: 'kraft', key: 'lb-count', tape: 't3' })}
      ${any ? entries.map((e) => e.items.length ? slip(`<div class="kicker">${e.l}</div>${e.items.map(([n, v]) => `<p><span class="typed small">${esc(n.toUpperCase())}:</span> <span class="hand" style="font-size:1.35rem">${esc(v)}</span></p>`).join('')}`, { key: 'lb-' + e.l, cls: 'ruled-card' }) : '').join('')
        : slip(`<p class="hand" style="font-size:1.3rem">No entries yet. Write one line each evening in the gratitude journal, and on Sunday they’ll all be here.</p>`, { key: 'lb-empty' })}
      ${slip(`<div class="kicker">To close the weekend</div>${passageHTML('Ecclesiastes 3:11')}<p>Go around the circle: what is one thing you want to remember forever? Then thank God for it together.</p>`, { key: 'lb-close' })}`),
  };
}
